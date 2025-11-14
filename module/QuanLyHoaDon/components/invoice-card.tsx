"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteInvoice } from "../api/api-quan-ly-hoa-don"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, DollarSign, Download, Eye, Trash2, FileText} from "lucide-react"
import { useCallback, useState } from "react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import type { Invoice } from "../types/invoice"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { useRouter } from "next/navigation"

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

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              {/* --- Left side --- */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === "vi" ? "Hóa đơn #" : "Invoice #"} {invoice.maHoaDon}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "vi" ? "Tháng" : "Month"} {invoice.thang}/{invoice.nam}
                  </p>
                </div>
              </div>

              {/* --- Badge trạng thái --- */}
              <Badge variant={getStatusColor(invoice.trangThai)}>
                {getStatusLabel(invoice.trangThai)}
              </Badge>
            </div>

            {/* --- Grid thông tin hóa đơn --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-500">{language === "vi" ? "Tiền phòng" : "Room Fee"}</span>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-green-600">
                    {invoice.tienPhong.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">{language === "vi" ? "Tiền dịch vụ" : "Service Fee"}</span>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-green-600">
                    {invoice.tienDichVu.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">{language === "vi" ? "Tổng tiền" : "Total Amount"}</span>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-bold text-blue-600">
                    {invoice.tongTien.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* --- Ngày tạo & cập nhật --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-500">{language === "vi" ? "Ngày tạo" : "Created At"}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{invoice.ngayTao}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">{language === "vi" ? "Cập nhật lần cuối" : "Last Updated"}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{invoice.capNhatLanCuoi}</span>
                </div>
              </div>
            </div>

            {/* --- Hành động --- */}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => router.push(`/invoices/${invoice.maHoaDon}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {language === "vi" ? "Xem chi tiết" : "View Details"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Tải xuống" : "Download"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{language === "vi" ? "Tùy chọn" : "Options"}</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Tải file PDF" : "Download PDF"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting
                  ? language === "vi"
                    ? "Đang xóa..."
                    : "Deleting..."
                  : language === "vi"
                    ? "Xóa"
                    : "Delete"}
              </Button>
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