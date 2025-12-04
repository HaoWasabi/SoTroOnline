"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { updateContract } from "../api/api-quan-ly-hop-dong"
import { Contract } from "../types/contract"
import { CalendarDays, AlertTriangle, Calendar } from "lucide-react"

interface ContractRenewalDialogProps {
    contract: Contract
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate?: () => void
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date | string): string {
    if (!date) return ""
    const d = typeof date === "string" ? new Date(date) : date
    if (isNaN(d.getTime())) return ""
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Helper function to add months to a date
function addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
}

// Helper function to check if contract is expired
function isContractExpired(endDate: string | Date | null | undefined): boolean {
    if (!endDate) return false
    
    try {
        const end = typeof endDate === "string" ? new Date(endDate) : endDate
        
        // Check if the date is valid
        if (isNaN(end.getTime())) return false
        
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to start of day
        
        // Reset end date time to end of day for fair comparison
        const endOfDay = new Date(end)
        endOfDay.setHours(23, 59, 59, 999)
        
        return endOfDay < today
    } catch (error) {
        console.error("Error parsing contract end date:", error)
        return false
    }
}

// Helper function to check if contract is expiring soon (within 30 days)
function isContractExpiringSoon(endDate: string | Date | null | undefined): boolean {
    if (!endDate) return false
    
    try {
        const end = typeof endDate === "string" ? new Date(endDate) : endDate
        
        // Check if the date is valid
        if (isNaN(end.getTime())) return false
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const thirtyDaysFromNow = new Date(today)
        thirtyDaysFromNow.setDate(today.getDate() + 30)
        
        // Reset end date time to end of day
        const endOfDay = new Date(end)
        endOfDay.setHours(23, 59, 59, 999)
        
        return endOfDay >= today && endOfDay <= thirtyDaysFromNow
    } catch (error) {
        console.error("Error parsing contract end date for expiring soon check:", error)
        return false
    }
}

export default function ContractRenewalDialog({ 
    contract, 
    open, 
    onOpenChange, 
    onUpdate 
}: ContractRenewalDialogProps) {
    const { language } = useLanguageStore()
    const { toast, showSuccess, showError, removeToast } = useToast()
    
    const [isRenewing, setIsRenewing] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [newStartDate, setNewStartDate] = useState("")
    const [newEndDate, setNewEndDate] = useState("")
    const [durationMonths, setDurationMonths] = useState<number>(12)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const isExpired = contract.ngayKetThuc ? isContractExpired(contract.ngayKetThuc) : false
    const isExpiringSoon = contract.ngayKetThuc ? isContractExpiringSoon(contract.ngayKetThuc) : false

    useEffect(() => {
        if (open) {
            // Set default start date to current contract end date + 1 day, or today if expired
            const currentEndDate = contract.ngayKetThuc ? new Date(contract.ngayKetThuc) : new Date()
            const defaultStartDate = new Date(currentEndDate)
            
            if (isExpired) {
                // If expired, start from today
                defaultStartDate.setTime(Date.now())
            } else {
                // If not expired, start from the day after current end date
                defaultStartDate.setDate(currentEndDate.getDate() + 1)
            }
            
            setNewStartDate(formatDate(defaultStartDate))
            
            // Calculate default end date (12 months from start date)
            const defaultEndDate = addMonths(defaultStartDate, durationMonths)
            setNewEndDate(formatDate(defaultEndDate))
            
            setErrors({})
        }
    }, [open, contract.ngayKetThuc, durationMonths, isExpired])

    const handleDurationChange = (months: number) => {
        setDurationMonths(months)
        if (newStartDate) {
            const startDate = new Date(newStartDate)
            const endDate = addMonths(startDate, months)
            setNewEndDate(formatDate(endDate))
        }
        setErrors(prev => ({ ...prev, duration: "" }))
    }

    const handleStartDateChange = (dateString: string) => {
        setNewStartDate(dateString)
        if (dateString && durationMonths) {
            const startDate = new Date(dateString)
            const endDate = addMonths(startDate, durationMonths)
            setNewEndDate(formatDate(endDate))
        }
        setErrors(prev => ({ ...prev, startDate: "", endDate: "" }))
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!newStartDate) {
            newErrors.startDate = language === "vi" ? "Vui lòng chọn ngày bắt đầu" : "Please select start date"
        }

        if (!newEndDate) {
            newErrors.endDate = language === "vi" ? "Vui lòng chọn ngày kết thúc" : "Please select end date"
        }

        if (newStartDate && newEndDate) {
            const start = new Date(newStartDate)
            const end = new Date(newEndDate)
            
            if (end <= start) {
                newErrors.endDate = language === "vi" ? "Ngày kết thúc phải sau ngày bắt đầu" : "End date must be after start date"
            }

            // Check if start date is reasonable (not too far in the past for expired contracts)
            if (isExpired) {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (start < today) {
                    newErrors.startDate = language === "vi" ? "Ngày bắt đầu không thể trong quá khứ" : "Start date cannot be in the past"
                }
            }
        }

        if (durationMonths < 1 || durationMonths > 60) {
            newErrors.duration = language === "vi" ? "Thời hạn hợp đồng phải từ 1 đến 60 tháng" : "Contract duration must be between 1 and 60 months"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRenewal = async () => {
        if (!validateForm()) {
            showError(language === "vi" ? "Vui lòng kiểm tra lại thông tin" : "Please check the information")
            return
        }

        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể gia hạn: Thiếu ID hợp đồng" : "Cannot renew: Missing contract ID")
            return
        }

        try {
            setIsRenewing(true)
            
            const renewalData = {
                ngayBatDau: newStartDate,
                ngayKetThuc: newEndDate,
                trangThai: "hoatDong"
            }

            const contractId = typeof contract.maHopDongPhong === "number" 
                ? contract.maHopDongPhong 
                : parseInt(String(contract.maHopDongPhong))
            
            const result = await updateContract(Number(contractId), renewalData)
            
            console.log("Contract renewal result:", result) // Debug log
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Gia hạn hợp đồng thành công" : "Contract renewed successfully")
                onOpenChange(false)
                onUpdate?.()
            } else {
                const errorMessage = result.message || (language === "vi" ? "Gia hạn thất bại" : "Renewal failed")
                console.error("Contract renewal failed:", errorMessage)
                showError(errorMessage)
            }
        } catch (error) {
            console.error("Error renewing contract:", error)
            showError(language === "vi" ? "Có lỗi xảy ra khi gia hạn hợp đồng" : "Error renewing contract")
        } finally {
            setIsRenewing(false)
        }
    }

    const handleCancellation = async () => {
        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể hủy: Thiếu ID hợp đồng" : "Cannot cancel: Missing contract ID")
            return
        }

        const confirmMessage = language === "vi" 
            ? "Bạn có chắc chắn muốn hủy hợp đồng này không? Hành động này không thể hoàn tác."
            : "Are you sure you want to cancel this contract? This action cannot be undone."

        if (!confirm(confirmMessage)) {
            return
        }

        try {
            setIsCancelling(true)
            
            const cancellationData = {
                trangThai: "daXoa"
            }

            const contractId = typeof contract.maHopDongPhong === "number" 
                ? contract.maHopDongPhong 
                : parseInt(String(contract.maHopDongPhong))
            
            const result = await updateContract(Number(contractId), cancellationData)
            
            console.log("Contract cancellation result:", result) // Debug log
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Hủy hợp đồng thành công" : "Contract cancelled successfully")
                onOpenChange(false)
                onUpdate?.()
            } else {
                const errorMessage = result.message || (language === "vi" ? "Hủy hợp đồng thất bại" : "Contract cancellation failed")
                console.error("Contract cancellation failed:", errorMessage)
                showError(errorMessage)
            }
        } catch (error) {
            console.error("Error cancelling contract:", error)
            showError(language === "vi" ? "Có lỗi xảy ra khi hủy hợp đồng" : "Error cancelling contract")
        } finally {
            setIsCancelling(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="min-w-[90vw] max-w-7xl h-[90vh] max-h-[900px] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 backdrop-blur-sm overflow-y-auto">
                    <DialogHeader className="space-y-3 pb-4 border-b border-gray-100 flex-shrink-0">
                        <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <CalendarDays className="h-6 w-6 text-white" />
                            </div>
                            {language === "vi" ? "Gia hạn hợp đồng" : "Contract Renewal"}
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600 ml-12">
                            {language === "vi" 
                                ? `Gia hạn hợp đồng #${contract.maHopDongPhong} với điều khoản mới`
                                : `Renew contract #${contract.maHopDongPhong} with new terms`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        {/* Expiration Warning */}
                        {(isExpired || isExpiringSoon) && (
                            <div className={`mb-6 p-4 rounded-2xl border-0 shadow-lg ${
                                isExpired 
                                    ? 'bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 shadow-red-100' 
                                    : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-amber-100'
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl shadow-md flex-shrink-0 ${
                                        isExpired 
                                            ? 'bg-gradient-to-br from-red-500 to-rose-600' 
                                            : 'bg-gradient-to-br from-amber-500 to-orange-600'
                                    }`}>
                                        <AlertTriangle className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-base mb-1 ${
                                            isExpired ? 'text-red-800' : 'text-amber-800'
                                        }`}>
                                            {isExpired 
                                                ? (language === "vi" ? "⚠️ Hợp đồng đã hết hạn" : "⚠️ Contract Expired")
                                                : (language === "vi" ? "🔔 Hợp đồng sắp hết hạn" : "🔔 Contract Expiring Soon")
                                            }
                                        </h4>
                                        <p className={`text-xs leading-relaxed ${
                                            isExpired ? 'text-red-700' : 'text-amber-700'
                                        }`}>
                                            {language === "vi" 
                                                ? `Ngày kết thúc: ${contract.ngayKetThuc ? formatDate(new Date(contract.ngayKetThuc)) : "N/A"}. Vui lòng gia hạn hoặc hủy hợp đồng để tiếp tục quản lý.`
                                                : `End date: ${contract.ngayKetThuc ? formatDate(new Date(contract.ngayKetThuc)) : "N/A"}. Please renew or cancel the contract to continue management.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Left Column - Current Contract Info */}
                            <div className="col-span-5">
                                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                        <h4 className="font-bold text-base text-gray-900">
                                            {language === "vi" ? "Thông tin hợp đồng hiện tại" : "Current Contract Information"}
                                        </h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{language === "vi" ? "Ngày bắt đầu" : "Start Date"}</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{contract.ngayBatDau ? formatDate(new Date(contract.ngayBatDau)) : "N/A"}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4 text-purple-600" />
                                                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{language === "vi" ? "Ngày kết thúc" : "End Date"}</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{contract.ngayKetThuc ? formatDate(new Date(contract.ngayKetThuc)) : "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - New Contract Terms */}
                            <div className="col-span-7">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                        <h4 className="font-bold text-base text-gray-900">
                                            {language === "vi" ? "Điều khoản hợp đồng mới" : "New Contract Terms"}
                                        </h4>
                                    </div>
                                    
                                    {/* Duration Selection */}
                                    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
                                        <Label className="text-sm font-semibold text-gray-900 block mb-3">{language === "vi" ? "Thời hạn hợp đồng" : "Contract Duration"}</Label>
                                        <div className="flex gap-2 flex-wrap mb-3">
                                            {[6, 12, 18, 24, 36].map((months) => (
                                                <Button
                                                    key={months}
                                                    type="button"
                                                    variant={durationMonths === months ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleDurationChange(months)}
                                                    className={`rounded-lg font-medium transition-all duration-200 text-xs px-3 py-2 ${
                                                        durationMonths === months 
                                                            ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-md" 
                                                            : "border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700"
                                                    }`}
                                                >
                                                    {months} {language === "vi" ? "tháng" : "months"}
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="1"
                                                max="60"
                                                value={durationMonths}
                                                onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
                                                className="w-16 h-8 rounded-lg border border-emerald-200 focus:border-emerald-400 text-center text-xs font-medium"
                                                placeholder="Custom"
                                            />
                                            <span className="text-xs text-gray-600">{language === "vi" ? "tháng" : "months"}</span>
                                        </div>
                                        {errors.duration && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mt-2">{errors.duration}</p>}
                                    </div>

                                    {/* Date Inputs */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                                            <Label htmlFor="newStartDate" className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-2">
                                                <Calendar className="h-3 w-3" />
                                                {language === "vi" ? "Ngày bắt đầu mới" : "New Start Date"}
                                            </Label>
                                            <Input
                                                id="newStartDate"
                                                type="date"
                                                value={newStartDate}
                                                onChange={(e) => handleStartDateChange(e.target.value)}
                                                className={`rounded-lg border font-medium text-xs ${
                                                    errors.startDate 
                                                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                                                        : "border-blue-200 focus:border-blue-400 bg-blue-50/30"
                                                }`}
                                            />
                                            {errors.startDate && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mt-2">{errors.startDate}</p>}
                                        </div>
                                        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
                                            <Label htmlFor="newEndDate" className="text-sm font-semibold text-purple-700 flex items-center gap-2 mb-2">
                                                <Calendar className="h-3 w-3" />
                                                {language === "vi" ? "Ngày kết thúc mới" : "New End Date"}
                                            </Label>
                                            <Input
                                                id="newEndDate"
                                                type="date"
                                                value={newEndDate}
                                                onChange={(e) => setNewEndDate(e.target.value)}
                                                className={`rounded-lg border font-medium text-xs ${
                                                    errors.endDate 
                                                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                                                        : "border-purple-200 focus:border-purple-400 bg-purple-50/30"
                                                }`}
                                            />
                                            {errors.endDate && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mt-2">{errors.endDate}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={isRenewing || isCancelling}
                            className="rounded-xl px-5 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 text-sm"
                        >
                            {language === "vi" ? "Đóng" : "Close"}
                        </Button>
                        
                        {(isExpired || isExpiringSoon) && (
                            <Button 
                                variant="destructive"
                                onClick={handleCancellation}
                                disabled={isRenewing || isCancelling}
                                className="rounded-xl px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium shadow-lg shadow-red-200 transition-all duration-200 text-sm"
                            >
                                {isCancelling 
                                    ? (language === "vi" ? "Đang hủy..." : "Cancelling...")
                                    : (language === "vi" ? "Hủy hợp đồng" : "Cancel Contract")
                                }
                            </Button>
                        )}
                        
                        <Button 
                            onClick={handleRenewal}
                            disabled={isRenewing || isCancelling}
                            className="rounded-xl px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium shadow-lg shadow-emerald-200 transition-all duration-200 text-sm"
                        >
                            {isRenewing 
                                ? (language === "vi" ? "Đang gia hạn..." : "Renewing...")
                                : (language === "vi" ? "Gia hạn hợp đồng" : "Renew Contract")
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {toast && <Toast {...toast} onClose={removeToast} />}
        </>
    )
}