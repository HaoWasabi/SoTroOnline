"use client"

import type React from "react"
import { useState } from "react"
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
import Combobox from "@/module/QuanLyPhong/components/combobox"
import { createInvoice } from "../api/api-quan-ly-hoa-don"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

const months = [
  { label_vietnam_name: "Tháng 1", label_english_name: "January", value: "01" },
  { label_vietnam_name: "Tháng 2", label_english_name: "February", value: "02" },
  { label_vietnam_name: "Tháng 3", label_english_name: "March", value: "03" },
  { label_vietnam_name: "Tháng 4", label_english_name: "April", value: "04" },
  { label_vietnam_name: "Tháng 5", label_english_name: "May", value: "05" },
  { label_vietnam_name: "Tháng 6", label_english_name: "June", value: "06" },
  { label_vietnam_name: "Tháng 7", label_english_name: "July", value: "07" },
  { label_vietnam_name: "Tháng 8", label_english_name: "August", value: "08" },
  { label_vietnam_name: "Tháng 9", label_english_name: "September", value: "09" },
  { label_vietnam_name: "Tháng 10", label_english_name: "October", value: "10" },
  { label_vietnam_name: "Tháng 11", label_english_name: "November", value: "11" },
  { label_vietnam_name: "Tháng 12", label_english_name: "December", value: "12" },
]

type LocalFormState = {
    maKhachThue: string | number | ""
    maHopDongPhong: string | number | ""
    thang: string
    nam: string
    tienPhong?: string
    tienDichVu?: string
    chiTietHoaDons?: any[]
    noiDung?: string
}

export function InvoiceFormAsDialog({ onSuccess }: { onSuccess?: () => void }) {
    const { language } = useLanguageStore()
    const { toast, showError, showSuccess, removeToast } = useToast()
    const [open, setOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<LocalFormState>({
        maKhachThue: "",
        maHopDongPhong: "",
        thang: "",
        nam: "",
        tienPhong: "",
        tienDichVu: "",
        chiTietHoaDons: [],
        noiDung: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.maHopDongPhong) newErrors.maHopDongPhong = language === "vi" ? "Vui lòng chọn hợp đồng" : "Please select contract"
        if (!formData.maKhachThue) newErrors.maKhachThue = language === "vi" ? "Vui lòng chọn khách thuê" : "Please select tenant"
        if (!formData.thang) newErrors.thang = language === "vi" ? "Vui lòng chọn tháng" : "Please select month"
        if (!formData.nam) newErrors.nam = language === "vi" ? "Vui lòng nhập năm" : "Please enter year"
        if (!formData.tienPhong) newErrors.tienPhong = language === "vi" ? "Vui lòng nhập tiền phòng" : "Please enter rent"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            showError(language === "vi" ? "Vui lòng điền đầy đủ thông tin" : "Please fill in all required fields")
            return
        }
        setIsCreating(true)
        try {
        const payload = {
            maKhachThue: Number(formData.maKhachThue),
            maHopDongPhong: Number(formData.maHopDongPhong),
            thang: Number(formData.thang),
            nam: Number(formData.nam),
            tienPhong: Number(formData.tienPhong),
            tienDichVu: Number(formData.tienDichVu || 0),
            chiTietHoaDons: formData.chiTietHoaDons || [],
            noiDung: formData.noiDung || "",
            tongTien: Number(formData.tienPhong) + Number(formData.tienDichVu || 0),
            tienConNo: Number(formData.tienPhong) + Number(formData.tienDichVu || 0),
            ngayTao: new Date().toISOString(),
            capNhatLanCuoi: new Date().toISOString(),
            trangThai: "Pending",
        }
        const result = await createInvoice(payload)
        if (result.status === "success") {
            showSuccess(language === "vi" ? "Thêm hóa đơn thành công" : "Invoice created successfully")
            setFormData({
                maKhachThue: "",
                maHopDongPhong: "",
                thang: "",
                nam: "",
                tienPhong: "",
                tienDichVu: "",
                chiTietHoaDons: [],
                noiDung: "",
            })
            setErrors({})
            setOpen(false)
            onSuccess?.()
        } else {
            showError(result.message || (language === "vi" ? "Thêm hóa đơn thất bại" : "Failed to create invoice"))
        }
        } catch (err) {
            showError(language === "vi" ? "Có lỗi xảy ra khi thêm hóa đơn" : "Error creating invoice")
        } finally {
        setIsCreating(false)
        }
    }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Thêm hóa đơn" : "Add Invoice"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[640px] lg:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{language === "vi" ? "Thêm hóa đơn" : "Add New Invoice"}</DialogTitle>
                    <DialogDescription>
                        {language === "vi" ? "Điền thông tin hóa đơn của bạn vào biểu mẫu bên dưới." : "Fill out the form below with your invoice information."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
                        <CardContent className="space-y-4 p-0">
                            <div className="px-4 space-y-4 sm:grid sm:grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>{language === "vi" ? "Hợp đồng" : "Contract"} <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.maHopDongPhong as any}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maHopDongPhong: e.target.value ? Number(e.target.value) : "" }))}
                                    />
                                    {errors.maHopDongPhong && <p className="text-sm text-red-500">{errors.maHopDongPhong}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>{language === "vi" ? "Khách thuê" : "Tenant"} <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.maKhachThue as any}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maKhachThue: e.target.value ? Number(e.target.value) : "" }))}
                                    />
                                    {errors.maKhachThue && <p className="text-sm text-red-500">{errors.maKhachThue}</p>}
                                </div>
                            </div>

                            <div className="px-4 space-y-4 sm:grid sm:grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>{language === "vi" ? "Tháng" : "Month"} <span className="text-red-500">*</span></Label>
                                    <Combobox
                                        data={months}
                                        no_data_found_english_message="No month found"
                                        no_data_found_vietname_message="Không tìm thấy tháng"
                                    />
                                    {errors.thang && <p className="text-sm text-red-500">{errors.thang}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>{language === "vi" ? "Năm" : "Year"} <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.nam as any}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nam: e.target.value }))}
                                    />
                                    {errors.nam && <p className="text-sm text-red-500">{errors.nam}</p>}
                                </div>
                            </div>

                            <div className="px-4 space-y-4 sm:grid sm:grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>{language === "vi" ? "Tiền phòng" : "Room Fee (VND)"} <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.tienPhong as any}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tienPhong: e.target.value }))}
                                    />
                                    {errors.tienPhong && <p className="text-sm text-red-500">{errors.tienPhong}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>{language === "vi" ? "Tiền dịch vụ" : "Service Fee (VND)"}</Label>
                                    <Input
                                        type="number"
                                        value={formData.tienDichVu as any}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tienDichVu: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="px-4 space-y-2">
                                <Label>{language === "vi" ? "Nội dung" : "Description"}</Label>
                                <Input
                                type="text"
                                value={formData.noiDung}
                                onChange={(e) => setFormData(prev => ({ ...prev, noiDung: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isCreating}>{language === "vi" ? "Hủy" : "Cancel"}</Button>
                        </DialogClose>
                            <Button type="submit" disabled={isCreating}>
                            {isCreating ? (language === "vi" ? "Đang tạo..." : "Creating...") : (language === "vi" ? "Thêm hóa đơn" : "Add Invoice")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Dialog>
    )
}