"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"
import ServiceTable from "./service-table"
import { createContract } from "../api/api-quan-ly-hop-dong"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

type LocalFormState = {
  maKhachThue: string | number | ""
  maPhong: string | number | ""
  ngayBatDau?: Date | string | undefined
  ngayKetThuc?: Date | string | undefined
  tienPhong?: string
  tienCoc?: string
  dvRac?: boolean
  dvWifi?: boolean
  dvCap?: boolean
  dvKhac?: boolean
}

function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map((x) => Number(x))
  return new Date(y, (m || 1) - 1, d || 1)
}

function formatYMD(d?: Date | string): string {
    if (!d) return ""
    if (typeof d === "string") {
      // assume already 'YYYY-MM-DD'
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
      const parsed = new Date(d)
      if (isNaN(parsed.getTime())) return ""
      d = parsed
    }
    const dt = d as Date
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, "0")
    const day = String(dt.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

type ContractFormAsDialogProps = {
  onSuccess?: () => void
}

export function ContractFormAsDialog({ onSuccess }: ContractFormAsDialogProps) {
    const router = useRouter()
    const { language } = useLanguageStore()
    const { toast, showError, showSuccess, showInfo, removeToast } = useToast()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [durationMonths, setDurationMonths] = useState<number | "">("")
    const [isCreating, setIsCreating] = useState(false)

    const [formData, setFormData] = useState<LocalFormState>({
      maKhachThue: "",
      maPhong: "",
      ngayBatDau: undefined,
      ngayKetThuc: undefined,
      tienPhong: "",
      tienCoc: "",
      dvRac: false,
      dvWifi: false,
      dvCap: false,
      dvKhac: false,
    })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tenants, setTenants] = useState<{ value: string | number; label_vietnam_name: string; label_english_name: string }[]>([])
  const [rooms, setRooms] = useState<{ value: string | number; label_vietnam_name: string; label_english_name: string }[]>([])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.maKhachThue === "" || formData.maKhachThue == null)
      newErrors.maKhachThue = language === "vi" ? "Vui lòng chọn khách thuê" : "Please select a tenant";

    if (formData.maPhong === "" || formData.maPhong == null)
      newErrors.maPhong = language === "vi" ? "Vui lòng chọn phòng" : "Please select a room";

    if (!formData.ngayBatDau)
      newErrors.ngayBatDau = language === "vi" ? "Vui lòng chọn ngày bắt đầu" : "Please select start date";

    const durationMissing = durationMonths === "" || (typeof durationMonths === "number" && durationMonths <= 0);
    if (durationMissing && !formData.ngayKetThuc)
      newErrors.ngayKetThuc = language === "vi" ? "Vui lòng nhập thời hạn hợp đồng" : "Please enter contract duration";

    if (!formData.tienPhong)
      newErrors.tienPhong = language === "vi" ? "Vui lòng nhập giá thuê" : "Please enter rent price";

    if (!formData.tienCoc)
      newErrors.tienCoc = language === "vi" ? "Vui lòng nhập tiền cọc" : "Please enter deposit";

    if (formData.ngayBatDau && formData.ngayKetThuc && new Date(formData.ngayKetThuc) <= new Date(formData.ngayBatDau)) {
      newErrors.ngayKetThuc = language === "vi" ? "Ngày kết thúc phải sau ngày bắt đầu" : "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError(language === "vi" ? "Vui lòng điền đầy đủ thông tin" : "Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    try {
      // Tính toán ngày kết thúc
      let computedEnd = "";
      if (durationMonths !== "" && formData.ngayBatDau) {
        const startDate = typeof formData.ngayBatDau === "string"
          ? parseYMD(formData.ngayBatDau)
          : formData.ngayBatDau;
        computedEnd = formatYMD(computeEndDate(startDate, Number(durationMonths)));
      } else if (formData.ngayKetThuc) {
        computedEnd = formatYMD(formData.ngayKetThuc);
      }

      // Xây dựng payload trực tiếp từ state (tránh sai lệch FormData)
      const payload = {
        maTaiKhoan: 1, // ID người quản lý (tạm cứng)
        maKhachThue:
          formData.maKhachThue === "" || formData.maKhachThue == null
            ? undefined
            : Number(formData.maKhachThue),
        maPhong:
          formData.maPhong === "" || formData.maPhong == null
            ? undefined
            : Number(formData.maPhong),
        ngayBatDau: formatYMD(formData.ngayBatDau),
        ngayKetThuc: computedEnd,
        tienPhong: formData.tienPhong ? Number(formData.tienPhong) : 0,
        tienCoc: formData.tienCoc ? Number(formData.tienCoc) : 0,
        dvRac: !!formData.dvRac,
        dvWifi: !!formData.dvWifi,
        dvCap: !!formData.dvCap,
        dvKhac: !!formData.dvKhac,
        trangThai: "hoatDong",
      };

      console.debug("createContract payload:", payload);

      const result = await createContract(payload);

      if (result.status === "success") {
        showSuccess(language === "vi" ? "Thêm hợp đồng thành công" : "Contract added successfully");
        // Reset form
        setFormData({
          maKhachThue: "",
          maPhong: "",
          ngayBatDau: undefined,
          ngayKetThuc: undefined,
          tienPhong: "",
          tienCoc: "",
          dvRac: false,
          dvWifi: false,
          dvCap: false,
          dvKhac: false,
        });
        setDurationMonths("");
        setErrors({});
        setOpen(false);
        // notify parent to refresh list
        try {
          onSuccess?.();
        } catch (err) {
          // swallow errors from parent callback
          console.warn('onSuccess callback error:', err);
        }
      } else {
        showError(result.message || (language === "vi" ? "Thêm hợp đồng thất bại" : "Failed to add contract"));
      }
    } catch (err) {
      console.error(err);
      showError(language === "vi" ? "Có lỗi xảy ra khi thêm hợp đồng" : "Error adding contract");
    } finally {
      setIsCreating(false);
    }
  };


  const handleServiceChange = (services: Record<string, boolean>) => {
    setFormData(prev => ({ ...prev, ...services }))
  }

  const addMonths = (date: Date, months: number) => {
    const d = new Date(date)
    const day = d.getDate()
    d.setMonth(d.getMonth() + months)
    if (d.getDate() < day) d.setDate(0)
    return d
  }

  // compute end date with end-of-month rules described by user
  const computeEndDate = (start: Date, months: number) => {
    // clone
    const s = new Date(start)
    // desired end month = start.month + months
    const targetMonth = s.getMonth() + months
    const targetYear = s.getFullYear() + Math.floor(targetMonth / 12)
    const normalizedMonth = targetMonth % 12

    // check if start date is the last day of its month
    const lastDayOfStartMonth = new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate()
    const isStartLastDay = s.getDate() === lastDayOfStartMonth

    if (isStartLastDay) {
      // end should be last day of (start.month + months)
      const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
      return new Date(targetYear, normalizedMonth, lastDay)
    }

    // otherwise, preserve day-of-month where possible, but if overflow occurs, set to last day
    const day = s.getDate()
    const candidate = new Date(targetYear, normalizedMonth, day)
    if (candidate.getMonth() !== normalizedMonth) {
      // overflowed (e.g., Feb 30) -> set to last day
      const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
      return new Date(targetYear, normalizedMonth, lastDay)
    }
    return candidate
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {language === "vi" ? "Thêm hợp đồng" : "Add Contract"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[640px] lg:min-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-3xl">{language === "vi" ? "Thêm hợp đồng" : "Add New Contract"}</DialogTitle>
          <DialogDescription>
            {language === "vi" ? "Điền thông tin hợp đồng của bạn vào biểu mẫu bên dưới." : "Fill out the form below with your contract information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
            <CardContent className="space-y-4 p-0">
              <h2 className="text-xl font-semibold">{language === "vi" ? "Thông tin hợp đồng" : "Contract Information"}</h2>
              <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="maKhachThue">{language === "vi" ? "Mã khách đại diện" : "Tenant ID"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="maKhachThue"
                    name="maKhachThue"
                    type="number"
                    placeholder={language === "vi" ? "Nhập ID khách thuê" : "Enter tenant ID"}
                    value={formData.maKhachThue as any}
                    onChange={(e) => { setFormData(prev => ({ ...prev, maKhachThue: e.target.value ? Number(e.target.value) : "" })); setErrors(prev => ({ ...prev, maKhachThue: "" })) }}
                  />
                  {errors.maKhachThue && <p className="text-sm text-red-500">{errors.maKhachThue}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maPhong">{language === "vi" ? "Mã phòng" : "Room ID"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="maPhong"
                    name="maPhong"
                    type="number"
                    placeholder={language === "vi" ? "Nhập ID phòng" : "Enter room ID"}
                    value={formData.maPhong as any}
                    onChange={(e) => { setFormData(prev => ({ ...prev, maPhong: e.target.value ? Number(e.target.value) : "" })); setErrors(prev => ({ ...prev, maPhong: "" })) }}
                  />
                  {errors.maPhong && <p className="text-sm text-red-500">{errors.maPhong}</p>}
                </div>
              </div>

              <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="ngayBatDau">{language === "vi" ? "Ngày bắt đầu" : "Start Date"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="ngayBatDau"
                    name="ngayBatDau"
                    type="date"
                    value={formData.ngayBatDau ? formatYMD(formData.ngayBatDau) : ""}
                    onChange={(e) => {
                      const val = e.target.value
                      const d = val ? parseYMD(val) : undefined
                      setFormData(prev => ({ ...prev, ngayBatDau: d }))
                      setErrors(prev => ({ ...prev, ngayBatDau: "" }))
                      if (d && durationMonths !== "" && typeof durationMonths === "number" && durationMonths > 0) {
                        const end = computeEndDate(d, durationMonths as number)
                        setFormData(prev => ({ ...prev, ngayKetThuc: end }))
                      }
                    }}
                  />
                  {errors.ngayBatDau && <p className="text-sm text-red-500">{errors.ngayBatDau}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_months">{language === "vi" ? "Số tháng thuê" : "Duration (months)"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="duration_months"
                    name="duration_months"
                    type="number"
                    min={1}
                    placeholder={language === "vi" ? "Nhập số tháng" : "Enter number of months"}
                    value={durationMonths as any}
                    onChange={(e) => {
                      const raw = e.target.value
                      const months = raw === "" ? "" : Math.max(0, parseInt(raw, 10) || 0)
                      setDurationMonths(months as number | "")
                      setErrors(prev => ({ ...prev, ngayKetThuc: "" }))
                      if (formData.ngayBatDau && months !== "") {
                        const start = typeof formData.ngayBatDau === "string" ? parseYMD(formData.ngayBatDau) : (formData.ngayBatDau as Date)
                        const end = computeEndDate(start, months as number)
                        setFormData(prev => ({ ...prev, ngayKetThuc: end }))
                      } else if (months === "") {
                        setFormData(prev => ({ ...prev, ngayKetThuc: undefined }))
                      }
                    }}
                  />
                  {errors.ngayKetThuc && <p className="text-sm text-red-500">{errors.ngayKetThuc}</p>}
                </div>
              </div>

              <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="ngayKetThuc">{language === "vi" ? "Ngày kết thúc" : "End Date"}</Label>
                  <Input
                    id="ngayKetThuc"
                    name="ngayKetThuc"
                    type="date"
                    value={formData.ngayKetThuc ? formatYMD(formData.ngayKetThuc) : ""}
                    readOnly
                  />
                  {errors.ngayKetThuc && <p className="text-sm text-red-500">{errors.ngayKetThuc}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tienPhong">{language === "vi" ? "Tiền phòng (VND)" : "Room Fee (VND)"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="tienPhong"
                    name="tienPhong"
                    type="number"
                    placeholder={language === "vi" ? "5000000" : "5000000"}
                    value={formData.tienPhong as any}
                    onChange={(e) => { setFormData(prev => ({ ...prev, tienPhong: e.target.value })); setErrors(prev => ({ ...prev, tienPhong: "" })) }}
                  />
                  {errors.tienPhong && <p className="text-sm text-red-500">{errors.tienPhong}</p>}
                </div>
              </div>

              <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="tienCoc">{language === "vi" ? "Tiền cọc (VND)" : "Deposit (VND)"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="tienCoc"
                    name="tienCoc"
                    type="number"
                    placeholder={language === "vi" ? "1000000" : "1000000"}
                    value={formData.tienCoc as any}
                    onChange={(e) => { setFormData(prev => ({ ...prev, tienCoc: e.target.value })); setErrors(prev => ({ ...prev, tienCoc: "" })) }}
                  />
                  {errors.tienCoc && <p className="text-sm text-red-500">{errors.tienCoc}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{language === "vi" ? "Dịch vụ" : "Services"}</Label>
                  <ServiceTable
                    onChange={handleServiceChange}
                    initialValues={{ dvRac: !!formData.dvRac, dvWifi: !!formData.dvWifi, dvCap: !!formData.dvCap, dvKhac: !!formData.dvKhac }}
                  />
                </div>
              </div>
            </CardContent>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>{language === "vi" ? "Hủy" : "Cancel"}</Button>
            </DialogClose>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (language === "vi" ? "Đang tạo..." : "Creating...") : (language === "vi" ? "Thêm hợp đồng" : "Add Contract")}
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      {toast && <Toast {...toast} onClose={removeToast} />}
    </Dialog>
  )
}