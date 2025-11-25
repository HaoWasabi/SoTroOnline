'use client'

import React, { useState } from 'react'
import { FileText, AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguageStore } from '@/zustand/language-tranlator'
import { useToast } from '@/hook/useToast'
import { generateReconciliationReport, ReconciliationReport } from '@/module/QuanLyPhieuThu/api/receipt-api'

interface ReconciliationReportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ReconciliationReportDialog({ 
    open, 
    onOpenChange
}: ReconciliationReportDialogProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    
    const [isLoading, setIsLoading] = useState(false)
    const [report, setReport] = useState<ReconciliationReport | null>(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            showError(language === "vi" ? "Vui lòng chọn ngày bắt đầu và kết thúc" : "Please select start and end dates")
            return
        }

        if (new Date(startDate) > new Date(endDate)) {
            showError(language === "vi" ? "Ngày bắt đầu không được sau ngày kết thúc" : "Start date cannot be after end date")
            return
        }

        try {
            setIsLoading(true)
            const result = await generateReconciliationReport(startDate, endDate)
            
            if (result.status === "success" && result.data) {
                setReport(result.data)
                showSuccess(language === "vi" ? "Tạo báo cáo đối soát thành công" : "Reconciliation report generated successfully")
            } else {
                showError(result.message || (language === "vi" ? "Tạo báo cáo thất bại" : "Failed to generate report"))
            }
        } catch (error) {
            console.error("Error generating reconciliation report:", error)
            showError(language === "vi" ? "Có lỗi khi tạo báo cáo đối soát" : "Error generating reconciliation report")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setReport(null)
        setStartDate('')
        setEndDate('')
        onOpenChange(false)
    }

    const getReconciliationStatus = (status: string) => {
        switch (status) {
            case "balanced":
                return {
                    color: "bg-green-100 text-green-700",
                    label: language === "vi" ? "Cân bằng" : "Balanced",
                    icon: CheckCircle2
                }
            case "surplus":
                return {
                    color: "bg-blue-100 text-blue-700",
                    label: language === "vi" ? "Thặng dư" : "Surplus",
                    icon: TrendingUp
                }
            case "deficit":
                return {
                    color: "bg-red-100 text-red-700",
                    label: language === "vi" ? "Thiếu hụt" : "Deficit",
                    icon: TrendingDown
                }
            default:
                return {
                    color: "bg-gray-100 text-gray-700",
                    label: language === "vi" ? "Không xác định" : "Unknown",
                    icon: AlertCircle
                }
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl bg-gradient-to-br from-white via-slate-50/30 to-purple-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Báo cáo đối soát" : "Reconciliation Report"}
                    </DialogTitle>
                    <DialogDescription>
                        {language === "vi" 
                            ? "So sánh tổng hóa đơn phát hành với tổng phiếu thu trong kỳ"
                            : "Compare total invoices issued with total receipts collected"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Date Range Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                                {language === "vi" ? "Từ ngày" : "From Date"}
                            </Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-white border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                                {language === "vi" ? "Đến ngày" : "To Date"}
                            </Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-white border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerateReport}
                        disabled={isLoading || !startDate || !endDate}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        {isLoading 
                            ? (language === "vi" ? "Đang tạo báo cáo..." : "Generating report...")
                            : (language === "vi" ? "Tạo báo cáo đối soát" : "Generate Reconciliation Report")
                        }
                    </Button>

                    {/* Report Results */}
                    {report && (
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="text-center">
                                {(() => {
                                    const statusInfo = getReconciliationStatus(report.reconciliationStatus)
                                    const StatusIcon = statusInfo.icon
                                    return (
                                        <Badge className={`text-lg px-6 py-2 ${statusInfo.color} border-0 flex items-center gap-2 justify-center w-fit mx-auto`}>
                                            <StatusIcon className="h-5 w-5" />
                                            {statusInfo.label}
                                        </Badge>
                                    )
                                })()}
                            </div>

                            {/* Financial Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-blue-600 mb-2">
                                                {language === "vi" ? "Tổng hóa đơn" : "Total Invoices"}
                                            </p>
                                            <p className="text-2xl font-bold text-blue-700">
                                                {report.totalInvoiceAmount.toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-green-600 mb-2">
                                                {language === "vi" ? "Tổng phiếu thu" : "Total Receipts"}
                                            </p>
                                            <p className="text-2xl font-bold text-green-700">
                                                {report.totalReceiptAmount.toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={`border-2 ${report.difference === 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : report.difference > 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'}`}>
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                                                report.difference === 0 
                                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                                    : report.difference > 0 
                                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                        : 'bg-gradient-to-br from-red-500 to-rose-600'
                                            }`}>
                                                {report.difference === 0 ? (
                                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                                ) : report.difference > 0 ? (
                                                    <TrendingUp className="h-6 w-6 text-white" />
                                                ) : (
                                                    <TrendingDown className="h-6 w-6 text-white" />
                                                )}
                                            </div>
                                            <p className={`text-sm font-medium mb-2 ${
                                                report.difference === 0 
                                                    ? 'text-green-600' 
                                                    : report.difference > 0 
                                                        ? 'text-blue-600'
                                                        : 'text-red-600'
                                            }`}>
                                                {language === "vi" ? "Chênh lệch" : "Difference"}
                                            </p>
                                            <p className={`text-2xl font-bold ${
                                                report.difference === 0 
                                                    ? 'text-green-700' 
                                                    : report.difference > 0 
                                                        ? 'text-blue-700'
                                                        : 'text-red-700'
                                            }`}>
                                                {report.difference > 0 ? '+' : ''}{report.difference.toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary */}
                            <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
                                <CardContent className="p-6">
                                    <h4 className="font-semibold text-gray-700 mb-3">
                                        {language === "vi" ? "Tóm tắt đối soát" : "Reconciliation Summary"}
                                    </h4>
                                    <div className="text-sm text-gray-600">
                                        {report.difference === 0 ? (
                                            <p>
                                                {language === "vi" 
                                                    ? "Tài khoản cân bằng hoàn hảo. Tổng hóa đơn phát hành bằng tổng phiếu thu."
                                                    : "Perfect balance. Total invoices issued equals total receipts collected."}
                                            </p>
                                        ) : report.difference > 0 ? (
                                            <p>
                                                {language === "vi" 
                                                    ? `Có thặng dư ${Math.abs(report.difference).toLocaleString("vi-VN")}₫. Tổng phiếu thu lớn hơn tổng hóa đơn.`
                                                    : `Surplus of ${Math.abs(report.difference).toLocaleString("vi-VN")}₫. Total receipts exceed total invoices.`}
                                            </p>
                                        ) : (
                                            <p>
                                                {language === "vi" 
                                                    ? `Có thiếu hụt ${Math.abs(report.difference).toLocaleString("vi-VN")}₫. Tổng hóa đơn lớn hơn tổng phiếu thu.`
                                                    : `Deficit of ${Math.abs(report.difference).toLocaleString("vi-VN")}₫. Total invoices exceed total receipts.`}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}