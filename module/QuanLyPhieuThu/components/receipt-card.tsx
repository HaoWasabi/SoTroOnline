'use client'

import React, { useState } from 'react'
import { 
    DollarSign, 
    FileText, 
    User, 
    Calendar, 
    Edit, 
    Trash2, 
    Download, 
    Eye,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from '@/components/ui/dialog'
import { useLanguageStore } from '@/zustand/language-tranlator'
import { useToast } from '@/hook/useToast'

import { deleteReceipt, printReceipt } from '@/module/QuanLyPhieuThu/api/receipt-api'
import EditReceiptDialog from './edit-receipt-dialog'
import ReceiptDetailDialog from './receipt-detail-dialog'
import { Receipt } from '../types/Receipt'

interface ReceiptCardProps {
    receipt: Receipt
    onUpdate?: () => void
    onDelete?: () => void
    animationDelay?: number
}

export default function ReceiptCard({ 
    receipt, 
    onUpdate, 
    onDelete, 
    animationDelay = 0 
}: ReceiptCardProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState(false)

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")
    }

    // Get status color and label
    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "da_xoa":
            case "cancelled":
                return {
                    color: "bg-red-100 text-red-700",
                    label: language === "vi" ? "Đã hủy" : "Cancelled",
                    icon: AlertTriangle
                }
            default:
                return {
                    color: "bg-green-100 text-green-700",
                    label: language === "vi" ? "Hoạt động" : "Active",
                    icon: CheckCircle2
                }
        }
    }

    const statusInfo = getStatusInfo(receipt.trangThai)

    // Handle delete
    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const result = await deleteReceipt(receipt.maPhieuThu)
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Xóa phiếu thu thành công" : "Receipt deleted successfully")
                onDelete?.()
                setShowDeleteDialog(false)
            } else {
                showError(result.message || (language === "vi" ? "Xóa thất bại" : "Delete failed"))
            }
        } catch (error) {
            console.error("Error deleting receipt:", error)
            showError(language === "vi" ? "Có lỗi khi xóa phiếu thu" : "Error deleting receipt")
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle download
    const handleDownload = async () => {
        try {
            setIsDownloading(true)
            const result = await printReceipt(receipt.maPhieuThu)
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Tải xuống thành công" : "Downloaded successfully")
            } else {
                showError(result.message || (language === "vi" ? "Tải xuống thất bại" : "Download failed"))
            }
        } catch (error) {
            console.error("Error downloading receipt:", error)
            showError(language === "vi" ? "Có lỗi khi tải xuống" : "Error downloading")
        } finally {
            setIsDownloading(false)
        }
    }

    const isCancelled = receipt.trangThai === "DA_XOA" || receipt.trangThai === "CANCELLED"

    return (
        <>
            <Card 
                className={`hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-gray-50/30 backdrop-blur-sm ${
                    isCancelled ? 'opacity-75 border-l-4 border-l-red-300' : 'shadow-lg shadow-gray-100/50'
                }`}
                style={{ animationDelay: `${animationDelay}ms` }}
            >
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Header with Receipt ID and Status */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {language === "vi" ? "Phiếu thu" : "Receipt"} #{receipt.maPhieuThu}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(receipt.ngayThu)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={`text-xs font-semibold ${statusInfo.color} border-0 flex items-center gap-1`}>
                                    <statusInfo.icon className="h-3 w-3" />
                                    {statusInfo.label}
                                </Badge>
                            </div>
                        </div>

                        {/* Amount Display */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <div className="text-center">
                                <p className="text-sm font-medium text-green-600 mb-1">
                                    {language === "vi" ? "Số tiền thu" : "Amount Collected"}
                                </p>
                                <p className="text-3xl font-bold text-green-700">
                                    {receipt.soTienThu.toLocaleString("vi-VN")}₫
                                </p>
                            </div>
                        </div>

                        {/* Invoice and Tenant Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                        {language === "vi" ? "Hóa đơn" : "Invoice"}
                                    </span>
                                </div>
                                <p className="font-bold text-blue-800">#{receipt.maHoaDon}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                                        {language === "vi" ? "Khách thuê" : "Tenant"}
                                    </span>
                                </div>
                                <p className="font-bold text-purple-800">ID: {receipt.maKhachThue}</p>
                            </div>
                        </div>

                        {/* Notes */}
                        {receipt.ghiChu && (
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {language === "vi" ? "Ghi chú" : "Notes"}
                                </p>
                                <p className="text-sm text-gray-700">{receipt.ghiChu}</p>
                            </div>
                        )}

                        {/* Last Update */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                                {language === "vi" ? "Cập nhật cuối" : "Last updated"}: {formatDate(receipt.capNhatLanCuoi)}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowDetailDialog(true)}
                                className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                {language === "vi" ? "Xem" : "View"}
                            </Button>
                            
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex-1 hover:bg-green-50 hover:border-green-300"
                            >
                                <Download className="h-4 w-4 mr-1" />
                                {isDownloading 
                                    ? (language === "vi" ? "Đang tải..." : "Downloading...")
                                    : (language === "vi" ? "Tải" : "Download")
                                }
                            </Button>

                            {!isCancelled && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowEditDialog(true)}
                                        className="hover:bg-yellow-50 hover:border-yellow-300"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="hover:bg-red-50 hover:border-red-300 text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            {language === "vi" ? "Xác nhận xóa" : "Confirm Delete"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "vi" 
                                ? `Bạn có chắc muốn xóa phiếu thu #${receipt.maPhieuThu}? Hành động này không thể hoàn tác.`
                                : `Are you sure you want to delete receipt #${receipt.maPhieuThu}? This action cannot be undone.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            {language === "vi" ? "Hủy" : "Cancel"}
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting 
                                ? (language === "vi" ? "Đang xóa..." : "Deleting...")
                                : (language === "vi" ? "Xóa" : "Delete")
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <EditReceiptDialog
                receipt={receipt}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                onSuccess={() => {
                    onUpdate?.()
                    setShowEditDialog(false)
                }}
            />

            {/* Detail Dialog */}
            <ReceiptDetailDialog
                receipt={receipt}
                open={showDetailDialog}
                onOpenChange={setShowDetailDialog}
            />
        </>
    )
}