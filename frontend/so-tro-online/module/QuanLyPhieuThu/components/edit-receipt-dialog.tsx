'use client'

import React, { useState } from 'react'
import { Edit, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useLanguageStore } from '@/zustand/language-tranlator'
import { useToast } from '@/hook/useToast'
import { updateReceipt } from '@/module/QuanLyPhieuThu/api/receipt-api'
import { Receipt } from '@/module/QuanLyPhieuThu/types/receipt'

interface EditReceiptDialogProps {
    receipt: Receipt
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function EditReceiptDialog({ 
    receipt,
    open, 
    onOpenChange, 
    onSuccess 
}: EditReceiptDialogProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    
    const [isLoading, setIsLoading] = useState(false)
    const [notes, setNotes] = useState(receipt.ghiChu || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            setIsLoading(true)
            const result = await updateReceipt(receipt.maPhieuThu, {
                ghiChu: notes
            })
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Cập nhật phiếu thu thành công" : "Receipt updated successfully")
                onSuccess?.()
            } else {
                showError(result.message || (language === "vi" ? "Cập nhật thất bại" : "Update failed"))
            }
        } catch (error) {
            console.error("Error updating receipt:", error)
            showError(language === "vi" ? "Có lỗi khi cập nhật phiếu thu" : "Error updating receipt")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg bg-gradient-to-br from-white via-slate-50/30 to-yellow-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-xl font-bold flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        <div className="h-8 w-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Edit className="h-4 w-4 text-white" />
                        </div>
                        {language === "vi" ? "Chỉnh sửa phiếu thu" : "Edit Receipt"}
                    </DialogTitle>
                    <DialogDescription>
                        {language === "vi" 
                            ? `Chỉnh sửa ghi chú cho phiếu thu #${receipt.maPhieuThu}`
                            : `Edit notes for receipt #${receipt.maPhieuThu}`}
                    </DialogDescription>
                </DialogHeader>

                {/* Receipt Info */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600 font-medium">
                                {language === "vi" ? "Mã phiếu thu:" : "Receipt ID:"}
                            </span>
                            <span className="ml-2 font-semibold">#{receipt.maPhieuThu}</span>
                        </div>
                        <div>
                            <span className="text-gray-600 font-medium">
                                {language === "vi" ? "Số tiền:" : "Amount:"}
                            </span>
                            <span className="ml-2 font-semibold text-green-600">
                                {receipt.soTienThu.toLocaleString("vi-VN")}₫
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600 font-medium">
                                {language === "vi" ? "Hóa đơn:" : "Invoice:"}
                            </span>
                            <span className="ml-2 font-semibold">#{receipt.maHoaDon}</span>
                        </div>
                        <div>
                            <span className="text-gray-600 font-medium">
                                {language === "vi" ? "Ngày thu:" : "Date:"}
                            </span>
                            <span className="ml-2 font-semibold">
                                {new Date(receipt.ngayThu).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Notes */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                            {language === "vi" ? "Ghi chú" : "Notes"}
                        </Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={language === "vi" ? "Nhập ghi chú..." : "Enter notes..."}
                            className="bg-white border-gray-200 min-h-[120px]"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {language === "vi" ? "Hủy" : "Cancel"}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                        >
                            {isLoading 
                                ? (language === "vi" ? "Đang cập nhật..." : "Updating...")
                                : (language === "vi" ? "Cập nhật" : "Update")
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}