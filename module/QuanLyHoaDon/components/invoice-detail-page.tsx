"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, Loader2, FileText } from "lucide-react"
import { getActiveInvoice, printInvoice, getAllActiveReceipts, /* createReceipt, */ deleteReceipt } from "../api/api-quan-ly-hoa-don"
import type { Invoice, InvoiceDetails } from "../types/invoice"
import type { Receipt } from "../types/receipt"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { ReceiptFormAsDialog } from "./receipt-form-adding"


interface InvoiceDetailPageProps {
  id: string
}

export default function InvoiceDetailPage({ id }: InvoiceDetailPageProps) {
    const router = useRouter()
    const { language } = useLanguageStore()
    const { toast, showError, showSuccess, removeToast } = useToast()

    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)

    const maHoaDon = Number(id)

    // fetch invoice
    const fetchInvoice = async () => {
        setLoading(true)
        try {
        const res = await getActiveInvoice(maHoaDon)
        if (res.status === "success" && res.data) {
            setInvoice(res.data)
        } else {
            showError(language === "vi" ? "Không tìm thấy hóa đơn" : "Invoice not found")
        }
        } catch (error) {
        showError(language === "vi" ? "Lỗi khi tải dữ liệu" : "Error loading data")
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        if (maHoaDon) fetchInvoice()
    }, [maHoaDon, language])

  // receipts state & helpers
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [receiptsLoading, setReceiptsLoading] = useState(false)

    const loadReceipts = async () => {
        setReceiptsLoading(true)
        try {
            const res = await getAllActiveReceipts()
            if (res.status === "success" && Array.isArray(res.data)) {
                const filtered = res.data.filter((r) => Number(r.maHoaDon) === Number(maHoaDon))
                setReceipts(filtered)
            } else {
                setReceipts([])
            }
        } catch (err) {
            setReceipts([])
        } finally {
            setReceiptsLoading(false)
        }
    }

    useEffect(() => {
        if (maHoaDon) loadReceipts()
    }, [maHoaDon])

    const getStatusColor = (status?: string) => {
        switch (status) {
        case "DA_THANH_TOAN":
        case "daThanhToan":
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
    }

    const getStatusLabel = (status?: string) => {
        if (language === "vi") {
        switch (status) {
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
            return status || ""
        }
        } else {
            switch (status) {
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
                return status || ""
            }
        }
    }

    const handleDownload = async () => {
        try {
            await printInvoice(maHoaDon)
            showSuccess(language === "vi" ? "Đang tải file PDF..." : "Downloading PDF...")
        } catch (err) {
            showError(language === "vi" ? "Không thể tải hóa đơn" : "Failed to download invoice")
        }
    }

    const handleDeleteReceipt = async (id?: number) => {
        if (!id) return
        const confirmMsg = language === "vi" ? "Bạn có chắc muốn xóa phiếu thu này không?" : "Are you sure you want to delete this receipt?"
        if (!confirm(confirmMsg)) return
        try {
            const res = await deleteReceipt(Number(id))
            if (res.status === "success") {
                showSuccess(language === "vi" ? "Xóa phiếu thu thành công" : "Receipt deleted")
                await loadReceipts()
                await fetchInvoice()
            } else {
                showError(res.message || (language === "vi" ? "Xóa thất bại" : "Delete failed"))
            }
        } catch (err) {
            showError(language === "vi" ? "Lỗi khi xóa phiếu thu" : "Error deleting receipt")
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] text-gray-600">
                <FileText className="h-12 w-12 mb-4 text-gray-400" />
                <p>{language === "vi" ? "Không tìm thấy hóa đơn." : "Invoice not found."}</p>
                <Button className="mt-4" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Quay lại" : "Back"}
                </Button>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* --- Header --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Quay lại" : "Back"}
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {language === "vi" ? "Chi tiết hóa đơn #" : "Invoice Detail #"} {invoice.maHoaDon}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(invoice.trangThai)}>
                        {getStatusLabel(invoice.trangThai)}
                    </Badge>
                    <Button variant="outline" onClick={handleDownload}>
                        <FileText className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Tải PDF" : "Download PDF"}
                    </Button>
                </div>
            </div>

            {/* --- Thông tin hóa đơn --- */}
            <Card>
                <CardHeader>
                    <CardTitle>{language === "vi" ? "Thông tin hóa đơn" : "Invoice Information"}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">{language === "vi" ? "Tháng/Năm" : "Month/Year"}</span>
                        <p className="font-medium">{invoice.thang}/{invoice.nam}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">{language === "vi" ? "Tiền phòng" : "Room Fee"}</span>
                        <p className="font-semibold text-green-600">{invoice.tienPhong.toLocaleString("vi-VN")} ₫</p>
                    </div>
                    <div>
                        <span className="text-gray-500">{language === "vi" ? "Tiền dịch vụ" : "Service Fee"}</span>
                        <p className="font-semibold text-green-600">{invoice.tienDichVu.toLocaleString("vi-VN")} ₫</p>
                    </div>
                    <div>
                        <span className="text-gray-500">{language === "vi" ? "Tổng tiền" : "Total"}</span>
                        <p className="font-bold text-blue-600">{invoice.tongTien.toLocaleString("vi-VN")} ₫</p>
                    </div>
                    <div>
                        <span className="text-gray-500">{language === "vi" ? "Còn nợ" : "Debt"}</span>
                        <p className="font-bold text-red-600">{invoice.tienConNo.toLocaleString("vi-VN")} ₫</p>
                    </div>
                        <div>
                            <span className="text-gray-500">{language === "vi" ? "Ngày tạo" : "Created At"}</span>
                            <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{invoice.ngayTao}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-500">{language === "vi" ? "Cập nhật lần cuối" : "Last Updated"}</span>
                            <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{invoice.capNhatLanCuoi}</span>
                            </div>
                        </div>
                </CardContent>
            </Card>

            {/* --- Chi tiết dịch vụ --- */}
            <Card>
                <CardHeader>
                    <CardTitle>{language === "vi" ? "Chi tiết hóa đơn" : "Invoice Details"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {invoice.chiTietHoaDons && invoice.chiTietHoaDons.length > 0 ? (
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">{language === "vi" ? "Tên dịch vụ" : "Service Name"}</th>
                            <th className="p-3 text-center">{language === "vi" ? "Số lượng" : "Quantity"}</th>
                            <th className="p-3 text-center">{language === "vi" ? "Đơn giá" : "Unit Price"}</th>
                            <th className="p-3 text-center">{language === "vi" ? "Thành tiền" : "Amount"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.chiTietHoaDons.map((d: InvoiceDetails, index: number) => (
                            <tr key={d.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{d.tenDichVu}</td>
                                <td className="p-3 text-center">{d.donGia.toLocaleString("vi-VN")} ₫</td>
                                <td className="p-3 text-center">{d.soLuong}</td>
                                <td className="p-3 text-center font-semibold text-blue-600">
                                {d.thanhTien.toLocaleString("vi-VN")} ₫
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 italic">
                        {language === "vi" ? "Không có chi tiết dịch vụ nào." : "No service details available."}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* --- Danh sách phiếu thu --- */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>{language === "vi" ? "Phiếu thu" : "Receipts"}</CardTitle>
                    <div className="flex items-center gap-2">
                        <ReceiptFormAsDialog maHoaDon={maHoaDon} onSuccess={async () => { await loadReceipts(); await fetchInvoice(); }} />
                    </div>
                </CardHeader>
                <CardContent>
                    {receiptsLoading ? (
                        <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                        </div>
                    ) : receipts && receipts.length > 0 ? (
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">{language === "vi" ? "Số tiền" : "Amount"}</th>
                            <th className="p-3 text-left">{language === "vi" ? "Ghi chú" : "Note"}</th>
                            <th className="p-3 text-left">{language === "vi" ? "Ngày thu" : "Date"}</th>
                            <th className="p-3 text-center">{language === "vi" ? "Hành động" : "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((r, idx) => (
                            <tr key={r.maPhieuThu} className="border-t hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3">{r.soTienThu.toLocaleString("vi-VN")} ₫</td>
                                <td className="p-3">{r.ghiChu || "-"}</td>
                                <td className="p-3">{r.ngayThu || r.capNhatLanCuoi || "-"}</td>
                                <td className="p-3 text-center">
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteReceipt(r.maPhieuThu)}>
                                    {language === "vi" ? "Xóa" : "Delete"}
                                </Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 italic">{language === "vi" ? "Không có phiếu thu." : "No receipts."}</p>
                    )}
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
        </div>
    )
}