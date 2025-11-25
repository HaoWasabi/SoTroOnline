'use client'

import React from 'react'
import { Eye, DollarSign, FileText, User, Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useLanguageStore } from '@/zustand/language-tranlator'
import { Receipt } from '../types/Receipt'


interface ReceiptDetailDialogProps {
    receipt: Receipt
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ReceiptDetailDialog({ 
    receipt,
    open, 
    onOpenChange
}: ReceiptDetailDialogProps) {
    const { language } = useLanguageStore()

    // Format date with time
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString(language === "vi" ? "vi-VN" : "en-US")
    }

    // Get status info
    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "da_xoa":
            case "cancelled":
                return {
                    color: "bg-red-100 text-red-700",
                    label: language === "vi" ? "Đã hủy" : "Cancelled"
                }
            default:
                return {
                    color: "bg-green-100 text-green-700",
                    label: language === "vi" ? "Hoạt động" : "Active"
                }
        }
    }

    const statusInfo = getStatusInfo(receipt.trangThai)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Eye className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Chi tiết phiếu thu" : "Receipt Details"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header with Receipt ID and Status */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {language === "vi" ? "Phiếu thu" : "Receipt"} #{receipt.maPhieuThu}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-1 mt-1">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(receipt.ngayThu)}
                            </p>
                        </div>
                        <Badge className={`text-sm font-semibold ${statusInfo.color} border-0`}>
                            {statusInfo.label}
                        </Badge>
                    </div>

                    {/* Amount Highlight */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <DollarSign className="h-6 w-6 text-green-600" />
                            <span className="text-lg font-semibold text-green-600">
                                {language === "vi" ? "Số tiền đã thu" : "Amount Collected"}
                            </span>
                        </div>
                        <p className="text-4xl font-bold text-green-700">
                            {receipt.soTienThu.toLocaleString("vi-VN")}₫
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Invoice Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-blue-700">
                                    {language === "vi" ? "Thông tin hóa đơn" : "Invoice Information"}
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-blue-600 font-medium">
                                        {language === "vi" ? "Mã hóa đơn:" : "Invoice ID:"}
                                    </span>
                                    <p className="text-lg font-bold text-blue-800">#{receipt.maHoaDon}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tenant Information */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-purple-700">
                                    {language === "vi" ? "Thông tin khách thuê" : "Tenant Information"}
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-purple-600 font-medium">
                                        {language === "vi" ? "Mã khách thuê:" : "Tenant ID:"}
                                    </span>
                                    <p className="text-lg font-bold text-purple-800">#{receipt.maKhachThue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {receipt.ghiChu && (
                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-5 border border-gray-100">
                            <h4 className="font-semibold text-gray-700 mb-3">
                                {language === "vi" ? "Ghi chú" : "Notes"}
                            </h4>
                            <p className="text-gray-600 leading-relaxed">{receipt.ghiChu}</p>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {language === "vi" ? "Thời gian" : "Timestamps"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 font-medium">
                                    {language === "vi" ? "Ngày thu:" : "Collection Date:"}
                                </span>
                                <p className="font-semibold text-gray-800">
                                    {formatDateTime(receipt.ngayThu)}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 font-medium">
                                    {language === "vi" ? "Cập nhật cuối:" : "Last Updated:"}
                                </span>
                                <p className="font-semibold text-gray-800">
                                    {formatDateTime(receipt.capNhatLanCuoi)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}