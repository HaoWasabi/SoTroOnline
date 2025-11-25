"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteInvoice, printInvoice } from "../api/api-quan-ly-hoa-don"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Calendar, DollarSign, Download, Eye, Trash2, FileText, Ban, MoreHorizontal} from "lucide-react"
import { useCallback, useState } from "react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import type { Invoice } from "../types/invoice"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { useRouter } from "next/navigation"
import InvoiceDetailDialog from "./invoice-detail-dialog"
import InvoiceCancellationDialog from "./invoice-cancellation-dialog"

interface InvoiceCardProps {
  invoice: Invoice
  onDelete?: () => void
}

export default function InvoiceCardComponent({ invoice, onDelete }: InvoiceCardProps) {
  const { language } = useLanguageStore()
  const { toast, showSuccess, showError, removeToast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // --- map trạng thái sang màu badge ---
  const getStatusColor = useCallback((status?: string) => {
    switch (status) {
      case "DA_THANH_TOAN":
      case "daThanhToan":
      case "hoatDong":
        return "default"
      case "CON_NO":
      case "choThanhToan":
        return "secondary"
      case "quaHan":
      case "DA_XOA":
      case "daXoa":
        return "destructive"
      default:
        return "outline"
    }
  }, [])

  // --- map trạng thái sang nhãn hiển thị ---
  const getStatusLabel = (status?: string) => {
    if (!status) return ""
    if (language === "vi") {
      switch (status) {
        case "hoatDong":
          return "Đang hoạt động"
        case "DA_THANH_TOAN":
        case "daThanhToan":
          return "Đã thanh toán"
        case "CON_NO":
        case "choThanhToan":
          return "Còn nợ"
        case "quaHan":
          return "Quá hạn"
        case "DA_XOA":
        case "daXoa":
          return "Đã xóa"
        default:
          return status
      }
    } else {
      switch (status) {
        case "hoatDong":
        case "DA_THANH_TOAN":
        case "daThanhToan":
          return "Paid"
        case "CON_NO":
        case "choThanhToan":
          return "Pending"
        case "quaHan":
          return "Overdue"
        case "DA_XOA":
        case "daXoa":
          return "Deleted"
        default:
          return status
      }
    }
  }

  const handleDelete = async () => {
    if (!invoice.maHoaDon) {
      showError(language === "vi" 
        ? "Không thể xóa: Thiếu ID hóa đơn" : 
        "Cannot delete: missing invoice ID")
      return
    }

    const confirmMsg =
      language === "vi"
        ? "Bạn có chắc muốn xóa hóa đơn này không?"
        : "Are you sure you want to delete this invoice?"
    if (!confirm(confirmMsg)) return

    try {
      setIsDeleting(true)
      const res = await deleteInvoice(Number(invoice.maHoaDon))
      if (res.status === "success") {
        showSuccess(language === "vi" ? "Xóa hóa đơn thành công" : "Invoice deleted successfully")
        onDelete?.()
        router.refresh()
      } else {
        showError(res.message || (language === "vi" ? "Xóa thất bại" : "Delete failed"))
      }
    } catch (err) {
      console.error("Error deleting invoice:", err)
      showError(language === "vi" ? "Có lỗi khi xóa hóa đơn" : "Error deleting invoice")
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePrintPDF = async () => {
    if (!invoice.maHoaDon) {
      showError(language === "vi" 
        ? "Không thể tải: Thiếu ID hóa đơn" : 
        "Cannot download: missing invoice ID")
      return
    }

    try {
      await printInvoice(Number(invoice.maHoaDon))
      showSuccess(language === "vi" ? "Tải file PDF thành công" : "PDF downloaded successfully")
    } catch (err) {
      console.error("Error downloading PDF:", err)
      showError(language === "vi" ? "Có lỗi khi tải file PDF" : "Error downloading PDF")
    }
  }

  return (
    <>
      <Card className="w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  {language === "vi" ? "Hóa đơn #" : "Invoice #"} {invoice.maHoaDon}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {language === "vi" ? "Tháng" : "Month"} {invoice.thang}/{invoice.nam}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center">
              <Badge 
                variant={getStatusColor(invoice.trangThai)}
                className={`px-3 py-1 text-xs font-semibold shadow-lg ${
                  invoice.trangThai === "DA_THANH_TOAN" || invoice.trangThai === "daThanhToan" || invoice.trangThai === "hoatDong"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-green-200"
                    : invoice.trangThai === "CON_NO" || invoice.trangThai === "choThanhToan"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-amber-200"
                    : invoice.trangThai === "quaHan" || invoice.trangThai === "DA_XOA" || invoice.trangThai === "daXoa"
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-red-200"
                    : "bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0"
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/80"></div>
                  {getStatusLabel(invoice.trangThai)}
                </div>
              </Badge>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <h4 className="font-bold text-lg text-gray-900">
                {language === "vi" ? "Thông tin tài chính" : "Financial Summary"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">
                    {language === "vi" ? "Tiền phòng" : "Room Fee"}
                  </span>
                </div>
                <div className="text-lg font-bold text-emerald-800">
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
                <div className="text-lg font-bold text-purple-800">
                  {invoice.tienDichVu.toLocaleString("vi-VN")} ₫
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    {language === "vi" ? "Tổng tiền" : "Total Amount"}
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {invoice.tongTien.toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
              <h4 className="font-bold text-lg text-gray-900">
                {language === "vi" ? "Thông tin thời gian" : "Date Information"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-600 font-medium">
                    {language === "vi" ? "Ngày tạo" : "Created At"}
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
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {language === "vi" ? "Hành động" : "Actions"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* View Details */}
                <InvoiceDetailDialog invoiceId={invoice.maHoaDon}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-medium transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Xem chi tiết" : "View Details"}
                  </Button>
                </InvoiceDetailDialog>

                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
                    >
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      {language === "vi" ? "Hành động" : "Actions"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <DropdownMenuLabel className="text-gray-600 font-semibold">
                      {language === "vi" ? "Tùy chọn" : "Options"}
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem 
                      onClick={handlePrintPDF}
                      className="rounded-lg hover:bg-blue-50 text-blue-700 font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {language === "vi" ? "Tải file PDF" : "Download PDF"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Invoice Cancellation */}
                    {(invoice.trangThai !== "DA_XOA" && invoice.trangThai !== "daXoa") && (
                      <InvoiceCancellationDialog invoice={invoice} onSuccess={onDelete}>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className="rounded-lg hover:bg-red-50 text-red-700 font-medium"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {language === "vi" ? "Hủy hóa đơn" : "Cancel Invoice"}
                        </DropdownMenuItem>
                      </InvoiceCancellationDialog>
                    )}
                    
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="rounded-lg hover:bg-red-50 text-red-700 font-medium"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting 
                        ? (language === "vi" ? "Đang xóa..." : "Deleting...")
                        : (language === "vi" ? "Xóa vĩnh viễn" : "Delete Permanently")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={removeToast}
        />
      )}
    </>
  )
}