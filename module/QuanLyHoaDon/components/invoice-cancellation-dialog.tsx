import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter 
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Ban, DollarSign, Calendar, FileText, Loader2 } from "lucide-react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { deleteInvoice } from "../api/api-quan-ly-hoa-don"
import type { Invoice } from "../types/invoice"

interface InvoiceCancellationDialogProps {
    invoice: Invoice
    onSuccess?: () => void
    children: React.ReactNode
}

interface CancellationForm {
    reason: string
    adminPassword: string
    notes: string
}

export default function InvoiceCancellationDialog({ invoice, onSuccess, children }: InvoiceCancellationDialogProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [step, setStep] = useState(1) // 1: Confirm, 2: Enter details, 3: Success
    const [form, setForm] = useState<CancellationForm>({
        reason: "",
        adminPassword: "",
        notes: ""
    })
    const [errors, setErrors] = useState<Partial<CancellationForm>>({})

    const cancellationReasons = [
        { value: "duplicate", label: language === "vi" ? "Hóa đơn trùng lặp" : "Duplicate invoice" },
        { value: "error", label: language === "vi" ? "Lỗi trong tính toán" : "Calculation error" },
        { value: "tenant_moved", label: language === "vi" ? "Khách thuê đã chuyển đi" : "Tenant moved out" },
        { value: "contract_cancelled", label: language === "vi" ? "Hợp đồng đã hủy" : "Contract cancelled" },
        { value: "admin_request", label: language === "vi" ? "Yêu cầu từ ban quản lý" : "Management request" },
        { value: "other", label: language === "vi" ? "Lý do khác" : "Other reason" }
    ]

    const validateForm = (): boolean => {
        const newErrors: Partial<CancellationForm> = {}

        if (!form.reason.trim()) {
            newErrors.reason = language === "vi" ? "Vui lòng chọn lý do hủy" : "Please select cancellation reason"
        }

        if (!form.adminPassword.trim()) {
            newErrors.adminPassword = language === "vi" ? "Vui lòng nhập mật khẩu quản lý" : "Please enter admin password"
        } else if (form.adminPassword.length < 6) {
            newErrors.adminPassword = language === "vi" ? "Mật khẩu phải có ít nhất 6 ký tự" : "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCancel = async () => {
        if (!validateForm()) {
            showError(language === "vi" ? "Vui lòng kiểm tra thông tin đã nhập" : "Please check the entered information")
            return
        }

        setIsCancelling(true)
        try {
            const result = await deleteInvoice(invoice.maHoaDon)
            if (result.status === "success") {
                setStep(3)
                showSuccess(language === "vi" ? "Hủy hóa đơn thành công" : "Invoice cancelled successfully")
                onSuccess?.()
            } else {
                showError(result.message || (language === "vi" ? "Không thể hủy hóa đơn" : "Failed to cancel invoice"))
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi hủy hóa đơn" : "Error cancelling invoice")
        } finally {
            setIsCancelling(false)
        }
    }

    const resetDialog = () => {
        setStep(1)
        setForm({
            reason: "",
            adminPassword: "",
            notes: ""
        })
        setErrors({})
    }

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(resetDialog, 300) // Reset after animation
    }

    const canCancel = invoice.trangThai !== "DA_XOA" && invoice.trangThai !== "daXoa"

    if (!canCancel) {
        return <>{children}</>
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                        <Ban className="h-5 w-5" />
                        {language === "vi" ? "Hủy hóa đơn" : "Cancel Invoice"}
                    </DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-6">
                        {/* Invoice Information */}
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-red-800">
                                        {language === "vi" ? "Thông tin hóa đơn" : "Invoice Information"}
                                    </h3>
                                    <Badge variant="destructive">
                                        {language === "vi" ? "SẼ BỊ HỦY" : "TO BE CANCELLED"}
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-red-700">{language === "vi" ? "Mã hóa đơn:" : "Invoice ID:"}</span>
                                        <span className="ml-2">#{invoice.maHoaDon}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-red-700">{language === "vi" ? "Kỳ thanh toán:" : "Period:"}</span>
                                        <span className="ml-2">{invoice.thang}/{invoice.nam}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-red-700">{language === "vi" ? "Tổng tiền:" : "Total:"}</span>
                                        <span className="ml-2 font-semibold">{invoice.tongTien.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-red-700">{language === "vi" ? "Tiền còn nợ:" : "Outstanding:"}</span>
                                        <span className="ml-2 font-semibold">{invoice.tienConNo.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        <Card className="bg-yellow-50 border-yellow-300">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-yellow-800">
                                            {language === "vi" ? "Cảnh báo quan trọng:" : "Important Warning:"}
                                        </h4>
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            <li>• {language === "vi" ? "Hành động này không thể hoàn tác" : "This action cannot be undone"}</li>
                                            <li>• {language === "vi" ? "Hóa đơn sẽ bị đánh dấu là đã hủy" : "Invoice will be marked as cancelled"}</li>
                                            <li>• {language === "vi" ? "Thông tin thanh toán sẽ bị xóa" : "Payment information will be removed"}</li>
                                            <li>• {language === "vi" ? "Cần quyền quản trị để thực hiện" : "Admin privileges required"}</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={handleClose}>
                                {language === "vi" ? "Hủy bỏ" : "Cancel"}
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => setStep(2)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {language === "vi" ? "Tiếp tục hủy" : "Continue Cancellation"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">
                                    {language === "vi" ? "Lý do hủy hóa đơn" : "Cancellation Reason"} <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {cancellationReasons.map((reason) => (
                                        <Button
                                            key={reason.value}
                                            variant={form.reason === reason.value ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setForm(prev => ({ ...prev, reason: reason.value }))}
                                        >
                                            {reason.label}
                                        </Button>
                                    ))}
                                </div>
                                {errors.reason && <p className="text-sm text-red-600">{errors.reason}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin-password" className="text-sm font-semibold">
                                    {language === "vi" ? "Mật khẩu quản lý" : "Admin Password"} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin-password"
                                    type="password"
                                    value={form.adminPassword}
                                    onChange={(e) => setForm(prev => ({ ...prev, adminPassword: e.target.value }))}
                                    placeholder={language === "vi" ? "Nhập mật khẩu quản lý..." : "Enter admin password..."}
                                    className={errors.adminPassword ? "border-red-300" : ""}
                                />
                                {errors.adminPassword && <p className="text-sm text-red-600">{errors.adminPassword}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold">
                                    {language === "vi" ? "Ghi chú (tùy chọn)" : "Notes (Optional)"}
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={form.notes}
                                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder={language === "vi" ? "Thêm ghi chú về việc hủy hóa đơn..." : "Add notes about the cancellation..."}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                {language === "vi" ? "Quay lại" : "Back"}
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isCancelling ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {language === "vi" ? "Đang hủy..." : "Cancelling..."}
                                    </>
                                ) : (
                                    <>
                                        <Ban className="h-4 w-4 mr-2" />
                                        {language === "vi" ? "Xác nhận hủy" : "Confirm Cancellation"}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 text-center">
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Ban className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {language === "vi" ? "Đã hủy thành công!" : "Successfully Cancelled!"}
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    {language === "vi" 
                                        ? `Hóa đơn #${invoice.maHoaDon} đã được hủy`
                                        : `Invoice #${invoice.maHoaDon} has been cancelled`}
                                </p>
                            </div>
                        </div>

                        <Card className="bg-gray-50">
                            <CardContent className="p-4">
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>{language === "vi" ? "Lý do:" : "Reason:"}</span>
                                        <span className="font-medium">
                                            {cancellationReasons.find(r => r.value === form.reason)?.label || form.reason}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{language === "vi" ? "Thời gian:" : "Time:"}</span>
                                        <span className="font-medium">{new Date().toLocaleString()}</span>
                                    </div>
                                    {form.notes && (
                                        <div className="pt-2 border-t">
                                            <span className="font-medium">{language === "vi" ? "Ghi chú:" : "Notes:"}</span>
                                            <p className="mt-1">{form.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <DialogFooter>
                            <Button onClick={handleClose} className="w-full">
                                {language === "vi" ? "Hoàn thành" : "Done"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}