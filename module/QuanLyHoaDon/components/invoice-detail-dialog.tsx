"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Calendar, FileText, Download, Loader2, DollarSign, X } from "lucide-react"
import { getActiveInvoice, printInvoice } from "../api/api-quan-ly-hoa-don"
import type { Invoice } from "../types/invoice"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"

interface InvoiceDetailDialogProps {
    invoiceId: number
    children: React.ReactNode
}

export default function InvoiceDetailDialog({ invoiceId, children }: InvoiceDetailDialogProps) {
    const { language } = useLanguageStore()
    const { showError, showSuccess } = useToast()

    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    // Fetch invoice details when dialog opens
    useEffect(() => {
        if (open && invoiceId) {
            fetchInvoice()
        }
    }, [open, invoiceId])

    const fetchInvoice = async () => {
        setLoading(true)
        try {
            const res = await getActiveInvoice(invoiceId)
            if (res.status === "success" && res.data) {
                setInvoice(res.data)
            } else {
                showError(language === "vi" ? "Không tìm thấy hóa đơn" : "Invoice not found")
            }
        } catch (error) {
            console.error('Error fetching invoice:', error)
            showError(language === "vi" ? "Lỗi khi tải dữ liệu" : "Error loading data")
        } finally {
            setLoading(false)
        }
    }

    const handlePrintPDF = async () => {
        if (!invoice?.maHoaDon) return

        try {
            await printInvoice(invoice.maHoaDon)
            showSuccess(language === "vi" ? "Tải file PDF thành công" : "PDF downloaded successfully")
        } catch (err) {
            console.error("Error downloading PDF:", err)
            showError(language === "vi" ? "Có lỗi khi tải file PDF" : "Error downloading PDF")
        }
    }

    // Get status badge styling
    const getStatusBadge = () => {
        if (!invoice?.trangThai) return null

        const status = invoice.trangThai
        let badgeClass = ""
        let statusText = ""

        if (language === "vi") {
            switch (status) {
                case "hoatDong":
                case "DA_THANH_TOAN":
                case "daThanhToan":
                    badgeClass = "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                    statusText = "Đã thanh toán"
                    break
                case "CON_NO":
                case "choThanhToan":
                    badgeClass = "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    statusText = "Còn nợ"
                    break
                case "quaHan":
                    badgeClass = "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                    statusText = "Quá hạn"
                    break
                default:
                    badgeClass = "bg-gradient-to-r from-gray-400 to-slate-500 text-white"
                    statusText = status
            }
        } else {
            switch (status) {
                case "hoatDong":
                case "DA_THANH_TOAN":
                case "daThanhToan":
                    badgeClass = "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                    statusText = "Paid"
                    break
                case "CON_NO":
                case "choThanhToan":
                    badgeClass = "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    statusText = "Pending"
                    break
                case "quaHan":
                    badgeClass = "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                    statusText = "Overdue"
                    break
                default:
                    badgeClass = "bg-gradient-to-r from-gray-400 to-slate-500 text-white"
                    statusText = status
            }
        }

        return (
            <Badge className={`px-3 py-1 text-xs font-semibold shadow-lg border-0 ${badgeClass}`}>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    {statusText}
                </div>
            </Badge>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {language === "vi" ? "Chi tiết hóa đơn" : "Invoice Details"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 text-base leading-relaxed">
                                    {language === "vi" 
                                        ? "Xem thông tin chi tiết và quản lý hóa đơn."
                                        : "View detailed information and manage invoice."
                                    }
                                </DialogDescription>
                            </div>
                        </div>
                        {invoice && getStatusBadge()}
                    </div>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                        <p className="text-gray-600 font-medium">
                            {language === "vi" ? "Đang tải thông tin hóa đơn..." : "Loading invoice details..."}
                        </p>
                    </div>
                ) : invoice ? (
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card className="border-0 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                    {language === "vi" ? "Thông tin cơ bản" : "Basic Information"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            <span className="text-blue-600 font-medium">
                                                {language === "vi" ? "Mã hóa đơn" : "Invoice ID"}
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold text-blue-800">
                                            {invoice.maHoaDon}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Calendar className="h-4 w-4 text-purple-600" />
                                            <span className="text-purple-600 font-medium">
                                                {language === "vi" ? "Tháng/Năm" : "Month/Year"}
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold text-purple-800">
                                            {invoice.thang}/{invoice.nam}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <FileText className="h-4 w-4 text-slate-600" />
                                            <span className="text-slate-600 font-medium">
                                                {language === "vi" ? "Mã hợp đồng" : "Contract ID"}
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold text-slate-800">
                                            {invoice.maHopDongPhong}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Information */}
                        <Card className="border-0 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                    {language === "vi" ? "Thông tin tài chính" : "Financial Details"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <DollarSign className="h-4 w-4 text-emerald-600" />
                                            <span className="text-emerald-600 font-medium">
                                                {language === "vi" ? "Tiền phòng" : "Room Fee"}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-emerald-800">
                                            {invoice.tienPhong.toLocaleString("vi-VN")} ₫
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <DollarSign className="h-4 w-4 text-purple-600" />
                                            <span className="text-purple-600 font-medium">
                                                {language === "vi" ? "Tiền dịch vụ" : "Service Fee"}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-purple-800">
                                            {invoice.tienDichVu.toLocaleString("vi-VN")} ₫
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <DollarSign className="h-4 w-4 text-blue-600" />
                                            <span className="text-blue-600 font-medium">
                                                {language === "vi" ? "Tổng tiền" : "Total Amount"}
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-800">
                                            {invoice.tongTien.toLocaleString("vi-VN")} ₫
                                        </div>
                                    </div>
                                </div>

                                {invoice.tienConNo !== undefined && invoice.tienConNo > 0 && (
                                    <div className="mt-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <DollarSign className="h-4 w-4 text-red-600" />
                                            <span className="text-red-600 font-medium">
                                                {language === "vi" ? "Tiền còn nợ" : "Outstanding Amount"}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-red-800">
                                            {invoice.tienConNo.toLocaleString("vi-VN")} ₫
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card className="border-0 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
                                    {language === "vi" ? "Thông tin bổ sung" : "Additional Information"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Calendar className="h-4 w-4 text-amber-600" />
                                            <span className="text-amber-600 font-medium">
                                                {language === "vi" ? "Ngày tạo" : "Created Date"}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-amber-800">
                                            {invoice.ngayTao}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Calendar className="h-4 w-4 text-teal-600" />
                                            <span className="text-teal-600 font-medium">
                                                {language === "vi" ? "Cập nhật lần cuối" : "Last Updated"}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-teal-800">
                                            {invoice.capNhatLanCuoi}
                                        </div>
                                    </div>
                                </div>

                                {invoice.noiDung && (
                                    <div className="mt-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <FileText className="h-4 w-4 text-gray-600" />
                                            <span className="text-gray-600 font-medium">
                                                {language === "vi" ? "Ghi chú" : "Notes"}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-800">
                                            {invoice.noiDung}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="border-0 rounded-2xl bg-gradient-to-r from-slate-50 to-gray-50 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
                                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            {language === "vi" ? "Hành động" : "Actions"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handlePrintPDF}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg font-medium transition-all duration-200"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Tải PDF" : "Download PDF"}
                                        </Button>
                                        
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                className="border-2 border-gray-300 hover:border-gray-400 rounded-xl font-medium transition-all duration-200"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                {language === "vi" ? "Đóng" : "Close"}
                                            </Button>
                                        </DialogClose>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-gray-600 font-medium">
                            {language === "vi" ? "Không tìm thấy hóa đơn" : "Invoice not found"}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}