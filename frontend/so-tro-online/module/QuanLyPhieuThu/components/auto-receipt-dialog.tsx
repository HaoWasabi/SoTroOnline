'use client'

import React, { useState, useEffect } from 'react'
import { Clock, DollarSign, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useLanguageStore } from '@/zustand/language-tranlator'
import { useToast } from '@/hook/useToast'
import { createAutoReceipt, AutoReceiptRequest } from '@/module/QuanLyPhieuThu/api/receipt-api'
import { getAllActiveContracts } from '@/module/QuanLyHopDongPhong/api/api-quan-ly-hop-dong'
import { Contract } from '@/module/QuanLyHopDongPhong/types/contract'

interface AutoReceiptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function AutoReceiptDialog({ 
    open, 
    onOpenChange, 
    onSuccess 
}: AutoReceiptDialogProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    
    const [isLoading, setIsLoading] = useState(false)
    const [contracts, setContracts] = useState<Contract[]>([])
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
    
    const [formData, setFormData] = useState<AutoReceiptRequest>({
        maHopDongPhong: 0,
        soTienThu: 0
    })

    // Load active contracts
    useEffect(() => {
        if (open) {
            loadContracts()
        }
    }, [open])

    const loadContracts = async () => {
        try {
            const result = await getAllActiveContracts()
            if (result.status === "success" && result.data) {
                setContracts(result.data)
            }
        } catch (error) {
            console.error("Error loading contracts:", error)
            showError(language === "vi" ? "Không thể tải danh sách hợp đồng" : "Failed to load contracts")
        }
    }

    const handleContractChange = (contractId: string) => {
        const contract = contracts.find(c => c.maHopDongPhong.toString() === contractId)
        if (contract) {
            setSelectedContract(contract)
            setFormData(prev => ({
                ...prev,
                maHopDongPhong: typeof contract.maHopDongPhong === 'string' ? parseInt(contract.maHopDongPhong) : contract.maHopDongPhong
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation
        if (!formData.maHopDongPhong) {
            showError(language === "vi" ? "Vui lòng chọn hợp đồng" : "Please select a contract")
            return
        }
        
        if (formData.soTienThu <= 0) {
            showError(language === "vi" ? "Số tiền thu phải lớn hơn 0" : "Amount must be greater than 0")
            return
        }

        try {
            setIsLoading(true)
            const result = await createAutoReceipt(formData)
            
            if (result.status === "success") {
                const receiptCount = result.data?.length || 0
                showSuccess(
                    language === "vi" 
                        ? `Thu tự động thành công! Đã tạo ${receiptCount} phiếu thu`
                        : `Auto receipt successful! Created ${receiptCount} receipts`
                )
                onSuccess?.()
                resetForm()
            } else {
                showError(result.message || (language === "vi" ? "Thu tự động thất bại" : "Auto receipt failed"))
            }
        } catch (error) {
            console.error("Error creating auto receipt:", error)
            showError(language === "vi" ? "Có lỗi khi thu tự động" : "Error creating auto receipt")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            maHopDongPhong: 0,
            soTienThu: 0
        })
        setSelectedContract(null)
    }

    const handleClose = () => {
        resetForm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-slate-50/30 to-orange-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Thu tiền tự động" : "Auto Receipt Collection"}
                    </DialogTitle>
                    <DialogDescription>
                        {language === "vi" 
                            ? "Tự động phân bổ số tiền thu vào các hóa đơn có nợ của hợp đồng"
                            : "Automatically allocate payment amount to outstanding invoices of the contract"}
                    </DialogDescription>
                </DialogHeader>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                            <p className="font-semibold mb-1">
                                {language === "vi" ? "Cách thức hoạt động:" : "How it works:"}
                            </p>
                            <ul className="space-y-1 text-xs">
                                <li>• {language === "vi" ? "Hệ thống sẽ tìm tất cả hóa đơn còn nợ của hợp đồng" : "System finds all outstanding invoices for the contract"}</li>
                                <li>• {language === "vi" ? "Phân bổ tiền theo thứ tự hóa đơn cũ nhất trước" : "Allocates money starting from oldest invoices first"}</li>
                                <li>• {language === "vi" ? "Tự động tạo phiếu thu cho từng hóa đơn được thanh toán" : "Automatically creates receipts for each paid invoice"}</li>
                                <li>• {language === "vi" ? "Cập nhật trạng thái hóa đơn khi thanh toán đủ" : "Updates invoice status when fully paid"}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contract Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                            {language === "vi" ? "Chọn hợp đồng" : "Select Contract"} *
                        </Label>
                        <Select value={formData.maHopDongPhong.toString()} onValueChange={handleContractChange}>
                            <SelectTrigger className="bg-white border-gray-200">
                                <SelectValue placeholder={language === "vi" ? "Chọn hợp đồng..." : "Select contract..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {contracts.map((contract) => (
                                    <SelectItem key={contract.maHopDongPhong} value={contract.maHopDongPhong.toString()}>
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <span className="font-medium">
                                                    {contract.tenPhong || `Phòng ${contract.maPhong || contract.maHopDongPhong}`} - {contract.tenants?.[0]?.hoTen || 'Chưa có thông tin khách'}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {language === "vi" ? "HĐ" : "Contract"} #{contract.maHopDongPhong}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {selectedContract && (
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div className="text-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-green-600 font-medium">
                                            {language === "vi" ? "Hợp đồng đã chọn:" : "Selected Contract:"}
                                        </span>
                                        <span className="font-semibold text-green-700">
                                            #{selectedContract.maHopDongPhong}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-green-600 font-medium">
                                                {language === "vi" ? "Phòng:" : "Room:"}
                                            </span>
                                            <span className="ml-2">{selectedContract.tenPhong || `Phòng ${selectedContract.maPhong || selectedContract.maHopDongPhong}`}</span>
                                        </div>
                                        <div>
                                            <span className="text-green-600 font-medium">
                                                {language === "vi" ? "Khách thuê:" : "Tenant:"}
                                            </span>
                                            <span className="ml-2">{selectedContract.tenants?.[0]?.hoTen || 'Chưa có thông tin'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Amount */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                            {language === "vi" ? "Số tiền khách nộp" : "Payment Amount"} *
                        </Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="number"
                                value={formData.soTienThu || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    soTienThu: parseFloat(e.target.value) || 0 
                                }))}
                                placeholder="0"
                                className="pl-10 bg-white border-gray-200 text-lg font-semibold"
                                min="0"
                                step="1000"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            {language === "vi" 
                                ? "Nhập tổng số tiền khách thuê đã nộp"
                                : "Enter the total amount tenant has paid"}
                        </p>
                    </div>

                    {/* Warning */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-orange-700">
                                <p className="font-semibold mb-1">
                                    {language === "vi" ? "Lưu ý quan trọng:" : "Important Note:"}
                                </p>
                                <p className="text-xs">
                                    {language === "vi" 
                                        ? "Hệ thống sẽ kiểm tra và báo lỗi nếu số tiền vượt quá tổng nợ. Các phiếu thu sẽ được tạo tự động và không thể hoàn tác."
                                        : "System will validate and error if amount exceeds total debt. Receipts will be auto-created and cannot be undone."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {language === "vi" ? "Hủy" : "Cancel"}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !selectedContract || formData.soTienThu <= 0}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                            {isLoading 
                                ? (language === "vi" ? "Đang xử lý..." : "Processing...")
                                : (language === "vi" ? "Thu tự động" : "Auto Collect")
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}