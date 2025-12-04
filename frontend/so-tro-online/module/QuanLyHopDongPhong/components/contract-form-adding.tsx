"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { TenantSelectionTable } from "./tenant-selection-table"
import { RoomSelectionDialog, type AvailableRoom } from "./room-selection-dialog"
import { createContract, getAllActiveTenants } from "../api/api-quan-ly-hop-dong"
import { getAvailableRoomsForContract } from "@/module/QuanLyPhong/api/api-quan-ly-phong"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

type LocalFormState = {
  selectedTenantIds: number[]
  mainTenantId: number | null
  selectedRoom: AvailableRoom | null
  maximumTenants?: number
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
      selectedTenantIds: [],
      mainTenantId: null,
      selectedRoom: null,
      maximumTenants: 4, // Default maximum 4 tenants
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
  const [availableTenants, setAvailableTenants] = useState<any[]>([])
  const [loadingTenants, setLoadingTenants] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)

  // Load active tenants and available rooms when dialog opens
  useEffect(() => {
    const loadData = async () => {
      if (!open) return
      
      // Load tenants
      setLoadingTenants(true)
      try {
        const tenantResult = await getAllActiveTenants()
        if (tenantResult.status === 'success' && tenantResult.data) {
          setAvailableTenants(tenantResult.data)
        } else {
          showError(language === "vi" ? "Không thể tải danh sách khách thuê" : "Failed to load tenants")
        }
      } catch (error) {
        showError(language === "vi" ? "Lỗi khi tải danh sách khách thuê" : "Error loading tenants")
      } finally {
        setLoadingTenants(false)
      }

      // Load available rooms
      setLoadingRooms(true)
      try {
        const roomResult = await getAvailableRoomsForContract()
        if (roomResult.status === 'success' && roomResult.data) {
          setAvailableRooms(roomResult.data)
        } else {
          showError(language === "vi" ? "Không thể tải danh sách phòng trống" : "Failed to load available rooms")
        }
      } catch (error) {
        showError(language === "vi" ? "Lỗi khi tải danh sách phòng" : "Error loading rooms")
      } finally {
        setLoadingRooms(false)
      }
    }
    
    loadData()
  }, [open, showError, language])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.selectedTenantIds.length === 0)
      newErrors.tenants = language === "vi" ? "Vui lòng chọn ít nhất một khách thuê" : "Please select at least one tenant";

    const maxTenants = formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4;
    if (formData.selectedTenantIds.length > maxTenants)
      newErrors.tenants = language === "vi" 
        ? `Số lượng khách thuê đã chọn (${formData.selectedTenantIds.length}) vượt quá giới hạn tối đa của phòng (${maxTenants}). Vui lòng giảm số lượng hoặc chọn phòng khác.`
        : `Selected tenant count (${formData.selectedTenantIds.length}) exceeds room maximum limit (${maxTenants}). Please reduce count or select different room.`;

    if (formData.selectedTenantIds.length > 1 && !formData.mainTenantId)
      newErrors.mainTenant = language === "vi" ? "Vui lòng chỉ định khách thuê đại diện" : "Please designate a main tenant";

    if (!formData.selectedRoom)
      newErrors.selectedRoom = language === "vi" ? "Vui lòng chọn phòng" : "Please select a room";

    if (!formData.ngayBatDau)
      newErrors.ngayBatDau = language === "vi" ? "Vui lòng chọn ngày bắt đầu" : "Please select start date";

    const durationMissing = durationMonths === "" || (typeof durationMonths === "number" && durationMonths <= 0);
    if (durationMissing && !formData.ngayKetThuc)
      newErrors.ngayKetThuc = language === "vi" ? "Vui lòng nhập thời hạn hợp đồng" : "Please enter contract duration";

    if (!formData.tienPhong)
      newErrors.tienPhong = language === "vi" ? "Vui lòng chọn phòng để tự động lấy giá thuê" : "Please select a room to auto-populate rent price";

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

      // Xây dựng payload với tất cả thông tin về tenants
      const mainTenantId = formData.mainTenantId || formData.selectedTenantIds[0];
      const additionalTenants = formData.selectedTenantIds.filter(id => id !== mainTenantId);
      const roomMaxTenants = formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4;
      
      const payload = {
        maTaiKhoan: 1, // ID người quản lý (tạm cứng) - backend expects maTaiKhoan, not maQuanLy
        maKhachThue: mainTenantId, // Main tenant (representative)
        additionalTenantIds: additionalTenants, // Other tenants
        maximumTenants: roomMaxTenants, // Use room's maximum tenant limit
        maPhong: formData.selectedRoom?.maPhong,
        ngayBatDau: formatYMD(formData.ngayBatDau),
        ngayKetThuc: computedEnd,
        tienPhong: formData.tienPhong ? Number(formData.tienPhong) : 0,
        tienCoc: formData.tienCoc ? Number(formData.tienCoc) : 0,
        dvRac: !!formData.dvRac,
        dvWifi: !!formData.dvWifi,
        dvCap: !!formData.dvCap,
        dvKhac: !!formData.dvKhac,
        trangThai: "hoatDong"
      };

      console.debug("=== CONTRACT CREATION PAYLOAD ===");
      console.debug("Main tenant ID:", mainTenantId);
      console.debug("Additional tenants:", additionalTenants);
      console.debug("Total tenants:", formData.selectedTenantIds.length);
      console.debug("Room maximum tenants:", roomMaxTenants);
      console.debug("Selected room:", formData.selectedRoom);
      console.debug("Full payload:", payload);

      const result = await createContract(payload);

      if (result.status === "success") {
        showSuccess(language === "vi" ? "Thêm hợp đồng thành công" : "Contract added successfully");
        // Reset form
        setFormData({
          selectedTenantIds: [],
          mainTenantId: null,
          selectedRoom: null,
          maximumTenants: 4,
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
      console.error("Full create contract error:", err);
      console.error("Error response:", (err as any).response?.data);
      console.error("Error status:", (err as any).response?.status);
      console.error("Error message:", (err as any).message);
      
      const errorMessage = (err as any).response?.data?.message || (err as any).message || "Error adding contract";
      showError(language === "vi" ? errorMessage : errorMessage);
    } finally {
      setIsCreating(false);
    }
  };


  const handleServiceChange = (services: Record<string, boolean>) => {
    setFormData(prev => ({ ...prev, ...services }))
  }

  const handleTenantsChange = (tenantIds: number[]) => {
    // Get maximum tenants from selected room or default to 4
    const maxTenants = formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4
    
    // Check maximum tenant limit - only prevent if exceeding, allow equal
    if (tenantIds.length > maxTenants) {
      showError(language === "vi" 
        ? `Không thể chọn quá ${maxTenants} khách thuê. Hiện đã chọn ${tenantIds.length}.`
        : `Cannot select more than ${maxTenants} tenants. Currently selected ${tenantIds.length}.`)
      return
    }
    
    setFormData(prev => ({ 
      ...prev, 
      selectedTenantIds: tenantIds,
      mainTenantId: tenantIds.length === 1 ? tenantIds[0] : prev.mainTenantId
    }))
    setErrors(prev => ({ 
      ...prev, 
      tenants: "", 
      mainTenant: "" 
    }))
  }

  const handleMainTenantChange = (tenantId: number) => {
    setFormData(prev => ({ 
      ...prev, 
      mainTenantId: tenantId
    }))
    setErrors(prev => ({ 
      ...prev, 
      mainTenant: "" 
    }))
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
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          {language === "vi" ? "Thêm hợp đồng" : "Add Contract"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[900px] lg:min-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            {language === "vi" ? "Thêm hợp đồng mới" : "Add New Contract"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            {language === "vi" ? "Điền thông tin hợp đồng của bạn vào biểu mẫu bên dưới." : "Fill out the form below with your contract information."}
          </DialogDescription>
        </DialogHeader>
        <form id="contract-form" onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="space-y-6">
            {/* Tenant Management Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-blue-700">
                  {language === "vi" ? "Quản lý khách thuê" : "Tenant Management"}
                </h3>
              </div>
              
              {/* Tenant Selection Section */}
              <div className="space-y-6 bg-white rounded-lg p-4 border border-blue-100">
                {/* Maximum Tenant Display (Auto from Room) */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-blue-700">{language === "vi" ? "Số lượng khách thuê tối đa" : "Maximum Tenants"}</Label>
                  <div className="flex items-center gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2 min-w-24">
                      <span className="text-blue-800 font-bold text-lg">
                        {formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4}
                      </span>
                    </div>
                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                      {language === "vi" 
                        ? `Đã chọn: ${formData.selectedTenantIds.length}/${formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4}`
                        : `Selected: ${formData.selectedTenantIds.length}/${formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4}`
                      }
                    </span>
                    {formData.selectedRoom ? (
                      <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                        {language === "vi" ? "Tự động từ phòng" : "Auto from room"}
                      </span>
                    ) : (
                      <span className="text-sm text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                        {language === "vi" ? "Chọn phòng trước" : "Select room first"}
                      </span>
                    )}
                    {formData.selectedTenantIds.length >= (formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4) && (
                      <span className="text-sm text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                        {language === "vi" ? "Đã đạt giới hạn" : "Limit reached"}
                      </span>
                    )}
                  </div>
                
              
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-blue-700">{language === "vi" ? "Khách thuê" : "Tenants"} <span className="text-red-500">*</span></Label>
                  <div className="bg-gray-50 p-4 rounded-md border border-blue-200">
                    <TenantSelectionTable
                      tenants={availableTenants}
                      selectedTenants={formData.selectedTenantIds}
                      onTenantsChange={handleTenantsChange}
                      loading={loadingTenants}
                      maxSelection={formData.selectedRoom ? (formData.selectedRoom.soLuongKhachToiDa || 4) : 4}
                      showMainTenant={formData.selectedTenantIds.length > 1}
                      mainTenantId={formData.mainTenantId || undefined}
                      onMainTenantChange={handleMainTenantChange}
                    />
                  </div>
                  {errors.tenants && <p className="text-sm text-red-500 mt-1">{errors.tenants}</p>}
                  {errors.mainTenant && <p className="text-sm text-red-500 mt-1">{errors.mainTenant}</p>}
                </div>
              </div>
            </div>

            {/* Room Selection Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🏠</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">
                  {language === "vi" ? "Lựa chọn phòng" : "Room Selection"}
                </h3>
              </div>
              <div className="space-y-6 bg-white rounded-lg p-4 border border-emerald-100">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-emerald-700">{language === "vi" ? "Phòng trống" : "Available Room"} <span className="text-red-500">*</span></Label>
                  <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200">
                    <RoomSelectionDialog
                      availableRooms={availableRooms}
                      selectedRoom={formData.selectedRoom}
                      onRoomSelect={(room) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          selectedRoom: room,
                          tienPhong: room?.giaThueCoBan?.toString() || "", // Auto-populate room cost
                          maximumTenants: room?.soLuongKhachToiDa || 4 // Auto-populate max tenants from room
                        }))
                        setErrors(prev => ({ ...prev, selectedRoom: "", tienPhong: "" }))
                      }}
                      loading={loadingRooms}
                      disabled={loadingRooms}
                    />
                  </div>
                  {errors.selectedRoom && <p className="text-sm text-red-500 mt-1">{errors.selectedRoom}</p>}
                </div>
              </div>
            </div>

            {/* Contract Duration Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-700">
                  {language === "vi" ? "Thời hạn hợp đồng" : "Contract Duration"}
                </h3>
              </div>
              <div className="space-y-6 bg-white rounded-lg p-4 border border-purple-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ngayBatDau" className="text-sm font-semibold text-purple-700">{language === "vi" ? "Ngày bắt đầu" : "Start Date"} <span className="text-red-500">*</span></Label>
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
                      className="font-medium border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {errors.ngayBatDau && <p className="text-sm text-red-500 mt-1">{errors.ngayBatDau}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="duration_months" className="text-sm font-semibold text-purple-700">{language === "vi" ? "Số tháng thuê" : "Duration (months)"} <span className="text-red-500">*</span></Label>
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
                      className="font-medium border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {errors.ngayKetThuc && <p className="text-sm text-red-500 mt-1">{errors.ngayKetThuc}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="ngayKetThuc" className="text-sm font-semibold">{language === "vi" ? "Ngày kết thúc" : "End Date"}</Label>
                    <Input
                      id="ngayKetThuc"
                      name="ngayKetThuc"
                      type="date"
                      value={formData.ngayKetThuc ? formatYMD(formData.ngayKetThuc) : ""}
                      readOnly
                      className="bg-gray-100 font-medium"
                    />
                    {errors.ngayKetThuc && <p className="text-sm text-red-500 mt-1">{errors.ngayKetThuc}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="tienPhong" className="text-sm font-semibold text-amber-700">{language === "vi" ? "Tiền phòng (VND)" : "Room Fee (VND)"} <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="tienPhong"
                        name="tienPhong"
                        type="number"
                        placeholder={language === "vi" ? "Chọn phòng để hiển thị giá" : "Select room to display price"}
                        value={formData.tienPhong as any}
                        readOnly
                        className="font-medium border-amber-200 bg-amber-50 cursor-not-allowed text-amber-800"
                      />
                      {formData.selectedRoom && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                          {language === "vi" ? "Tự động" : "Auto"}
                        </div>
                      )}
                    </div>
                    {!formData.selectedRoom && (
                      <p className="text-sm text-amber-600 mt-1">
                        {language === "vi" ? "Giá phòng sẽ tự động hiển thị khi bạn chọn phòng" : "Room price will be automatically displayed when you select a room"}
                      </p>
                    )}
                    {errors.tienPhong && <p className="text-sm text-red-500 mt-1">{errors.tienPhong}</p>}
                  </div>
                </div>
              </div>

            {/* Financial Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">
                  {language === "vi" ? "Tiền cọc & Dịch vụ" : "Deposit & Services"}
                </h3>
              </div>
              <div className="space-y-6 bg-white rounded-lg p-4 border border-emerald-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="tienCoc" className="text-sm font-semibold text-emerald-700">{language === "vi" ? "Tiền cọc (VND)" : "Deposit (VND)"} <span className="text-red-500">*</span></Label>
                    <Input
                      id="tienCoc"
                      name="tienCoc"
                      type="number"
                      placeholder={language === "vi" ? "1000000" : "1000000"}
                      value={formData.tienCoc as any}
                      onChange={(e) => { setFormData(prev => ({ ...prev, tienCoc: e.target.value })); setErrors(prev => ({ ...prev, tienCoc: "" })) }}
                      className="font-medium border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.tienCoc && <p className="text-sm text-red-500 mt-1">{errors.tienCoc}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-emerald-700">{language === "vi" ? "Dịch vụ bao gồm" : "Included Services"}</Label>
                    <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200">
                      <ServiceTable
                        onChange={handleServiceChange}
                        initialValues={{ dvRac: !!formData.dvRac, dvWifi: !!formData.dvWifi, dvCap: !!formData.dvCap, dvKhac: !!formData.dvKhac }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </form>
        
        <DialogFooter className="border-t border-gray-100 pt-6 mt-6 backdrop-blur-sm">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              disabled={loading}
              className="hover:bg-gray-50 border-gray-300"
            >
              {language === "vi" ? "Hủy" : "Cancel"}
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isCreating}
            className="min-w-32 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            form="contract-form"
          >
            {isCreating ? (language === "vi" ? "Đang tạo..." : "Creating...") : (language === "vi" ? "Tạo hợp đồng" : "Create Contract")}
          </Button>
        </DialogFooter>
      </DialogContent>
      {toast && <Toast {...toast} onClose={removeToast} />}
    </Dialog>
  )
}