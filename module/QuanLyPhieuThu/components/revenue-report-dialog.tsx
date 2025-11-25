'use client'

import React, { useState } from 'react'
import { TrendingUp, Calendar, Download } from 'lucide-react'
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
import { useLanguageStore } from '@/zustand/language-tranlator'
import { useToast } from '@/hook/useToast'
import { generateRevenueReport, RevenueReport } from '@/module/QuanLyPhieuThu/api/receipt-api'

interface RevenueReportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function RevenueReportDialog({ 
    open, 
    onOpenChange
}: RevenueReportDialogProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    
    const [isLoading, setIsLoading] = useState(false)
    const [report, setReport] = useState<RevenueReport | null>(null)
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
            const result = await generateRevenueReport(startDate, endDate)
            
            if (result.status === "success" && result.data) {
                setReport(result.data)
                showSuccess(language === "vi" ? "Tạo báo cáo thành công" : "Report generated successfully")
            } else {
                showError(result.message || (language === "vi" ? "Tạo báo cáo thất bại" : "Failed to generate report"))
            }
        } catch (error) {
            console.error("Error generating revenue report:", error)
            showError(language === "vi" ? "Có lỗi khi tạo báo cáo" : "Error generating report")
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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Báo cáo doanh thu" : "Revenue Report"}
                    </DialogTitle>
                    <DialogDescription>
                        {language === "vi" 
                            ? "Xem báo cáo doanh thu từ phiếu thu theo khoảng thời gian"
                            : "View revenue report from receipts by time period"}
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
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {isLoading 
                            ? (language === "vi" ? "Đang tạo báo cáo..." : "Generating report...")
                            : (language === "vi" ? "Tạo báo cáo" : "Generate Report")
                        }
                    </Button>

                    {/* Report Results */}
                    {report && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {language === "vi" ? "Kết quả báo cáo" : "Report Results"}
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    {language === "vi" ? "Xuất Excel" : "Export Excel"}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-green-600">
                                                {language === "vi" ? "Tổng doanh thu" : "Total Revenue"}
                                            </p>
                                            <p className="text-2xl font-bold text-green-700">
                                                {report.totalRevenue.toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-blue-600">
                                                {language === "vi" ? "Số phiếu thu" : "Receipt Count"}
                                            </p>
                                            <p className="text-2xl font-bold text-blue-700">
                                                {report.receiptCount}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-purple-600">
                                                {language === "vi" ? "Trung bình/phiếu" : "Average/Receipt"}
                                            </p>
                                            <p className="text-2xl font-bold text-purple-700">
                                                {report.averageAmount.toLocaleString("vi-VN")}₫
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                                    <CardContent className="p-4">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-orange-600">
                                                {language === "vi" ? "Kỳ báo cáo" : "Period"}
                                            </p>
                                            <p className="text-sm font-bold text-orange-700">
                                                {report.period}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}