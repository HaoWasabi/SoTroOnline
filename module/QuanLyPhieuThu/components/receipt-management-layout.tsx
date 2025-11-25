'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, DollarSign, TrendingUp, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguageStore } from '@/zustand/language-tranlator'
import { useToast } from '@/hook/useToast'
import { useAuthGuard } from '@/hook/useAuthGuard'
import ReceiptCard from '@/module/QuanLyPhieuThu/components/receipt-card'
import CreateReceiptDialog from '@/module/QuanLyPhieuThu/components/create-receipt-dialog'
import AutoReceiptDialog from '@/module/QuanLyPhieuThu/components/auto-receipt-dialog'
import RevenueReportDialog from '@/module/QuanLyPhieuThu/components/revenue-report-dialog'
import ReconciliationReportDialog from '@/module/QuanLyPhieuThu/components/reconciliation-report-dialog'
import { getAllActiveReceipts } from '@/module/QuanLyPhieuThu/api/receipt-api'

import { Receipt } from '../types/Receipt'
import { Toast } from '@/components/toast'

interface ReceiptSummary {
    totalReceipts: number
    totalAmount: number
    monthlyRevenue: number
    pendingReceipts: number
}

export default function ReceiptManagementLayout() {
    const { language } = useLanguageStore()
    const { toast, showSuccess, showError, removeToast } = useToast()
    const { isAuthenticated, user } = useAuthGuard()
    
    // State management
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "cancelled">("all")
    const [summary, setSummary] = useState<ReceiptSummary>({
        totalReceipts: 0,
        totalAmount: 0,
        monthlyRevenue: 0,
        pendingReceipts: 0
    })
    
    // Dialog states
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showAutoReceiptDialog, setShowAutoReceiptDialog] = useState(false)
    const [showRevenueDialog, setShowRevenueDialog] = useState(false)
    const [showReconciliationDialog, setShowReconciliationDialog] = useState(false)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    // Load receipts and calculate summary
    const loadReceipts = async () => {
        setIsLoading(true)
        setHasError(false)
        try {
            const result = await getAllActiveReceipts()
            
            if (result.status === "success" && result.data && Array.isArray(result.data)) {
                setReceipts(result.data)
                setFilteredReceipts(result.data)
                calculateSummary(result.data)
                setHasError(false) // Success, even if empty array
            } else {
                // Handle API error response
                const errorMessage = result.message || (language === "vi" ? "Không thể tải danh sách phiếu thu" : "Failed to load receipts")
                showError(errorMessage)
                console.error("API Error:", errorMessage)
                
                // Set empty data to prevent further errors
                setReceipts([])
                setFilteredReceipts([])
                calculateSummary([])
                setHasError(true) // Mark as error
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Network Error loading receipts:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            
            // Show user-friendly error message
            if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
                showError(language === "vi" ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." : "Session expired. Please login again.")
            } else if (errorMessage.includes("404")) {
                showError(language === "vi" ? "Không tìm thấy dịch vụ phiếu thu" : "Receipt service not found")
            } else if (errorMessage.includes("500")) {
                showError(language === "vi" ? "Lỗi máy chủ nội bộ" : "Internal server error")
            } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
                showError(language === "vi" ? "Không thể kết nối đến máy chủ" : "Unable to connect to server")
            } else {
                showError(language === "vi" ? "Lỗi khi tải danh sách phiếu thu" : "Error loading receipts")
            }
            
            // Set empty data to prevent further errors
            setReceipts([])
            setFilteredReceipts([])
            calculateSummary([])
            setHasError(true) // Mark as error
        } finally {
            setIsLoading(false)
        }
    }

    const calculateSummary = (receiptList: Receipt[]) => {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        
        const totalAmount = receiptList.reduce((sum, receipt) => sum + receipt.soTienThu, 0)
        const monthlyRevenue = receiptList
            .filter(receipt => {
                const receiptDate = new Date(receipt.ngayThu)
                return receiptDate.getMonth() + 1 === currentMonth && receiptDate.getFullYear() === currentYear
            })
            .reduce((sum, receipt) => sum + receipt.soTienThu, 0)
        
        const pendingReceipts = receiptList.filter(receipt => 
            receipt.trangThai !== "DA_XOA" && receipt.trangThai !== "CANCELLED"
        ).length

        setSummary({
            totalReceipts: receiptList.length,
            totalAmount,
            monthlyRevenue,
            pendingReceipts
        })
    }

    // Filter and search logic
    useEffect(() => {
        let filtered = receipts

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(receipt => 
                receipt.maPhieuThu.toString().includes(searchTerm) ||
                receipt.maHoaDon.toString().includes(searchTerm) ||
                receipt.maKhachThue.toString().includes(searchTerm) ||
                (receipt.ghiChu && receipt.ghiChu.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Apply status filter
        switch (filterStatus) {
            case "active":
                filtered = filtered.filter(receipt => 
                    receipt.trangThai !== "DA_XOA" && receipt.trangThai !== "CANCELLED"
                )
                break
            case "cancelled":
                filtered = filtered.filter(receipt => 
                    receipt.trangThai === "DA_XOA" || receipt.trangThai === "CANCELLED"
                )
                break
            default:
                // "all" - no additional filtering
                break
        }

        setFilteredReceipts(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [searchTerm, filterStatus, receipts])

    // Pagination calculations
    const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPageReceipts = filteredReceipts.slice(startIndex, endIndex)

    // Load data on mount
    useEffect(() => {
        loadReceipts()
    }, [])

    const handleReceiptCreated = () => {
        loadReceipts()
        setShowCreateDialog(false)
        setShowAutoReceiptDialog(false)
        showSuccess(language === "vi" ? "Tạo phiếu thu thành công" : "Receipt created successfully")
    }

    const handleReceiptUpdated = () => {
        loadReceipts()
        showSuccess(language === "vi" ? "Cập nhật phiếu thu thành công" : "Receipt updated successfully")
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">{language === "vi" ? "Đang tải..." : "Loading..."}</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state only if there was an actual error
    if (!isLoading && hasError) {
        return (
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            {language === "vi" ? "Quản lý phiếu thu" : "Receipt Management"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {language === "vi" 
                                ? "Ghi nhận và theo dõi các phiếu thu từ khách thuê" 
                                : "Record and track receipts from tenants"}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button 
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {language === "vi" ? "Tạo phiếu thu" : "Create Receipt"}
                        </Button>
                        <Button 
                            onClick={loadReceipts}
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            {language === "vi" ? "Thử lại" : "Retry"}
                        </Button>
                    </div>
                </div>

                {/* Error State */}
                <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                    <CardContent className="p-12 text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-900 mb-2">
                            {language === "vi" ? "Không thể tải dữ liệu phiếu thu" : "Unable to load receipt data"}
                        </h3>
                        <p className="text-red-700 mb-4">
                            {language === "vi" 
                                ? "Vui lòng kiểm tra kết nối mạng và thử lại"
                                : "Please check your network connection and try again"}
                        </p>
                        <Button 
                            onClick={loadReceipts}
                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700"
                        >
                            {language === "vi" ? "Thử lại" : "Retry"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Toast */}
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

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        {language === "vi" ? "Quản lý phiếu thu" : "Receipt Management"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {language === "vi" 
                            ? "Ghi nhận và theo dõi các phiếu thu từ khách thuê" 
                            : "Record and track receipts from tenants"}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button 
                        onClick={() => setShowRevenueDialog(true)}
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Báo cáo doanh thu" : "Revenue Report"}
                    </Button>
                    <Button 
                        onClick={() => setShowReconciliationDialog(true)}
                        variant="outline"
                        className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Đối soát" : "Reconciliation"}
                    </Button>
                    <Button 
                        onClick={() => setShowAutoReceiptDialog(true)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Thu tự động" : "Auto Receipt"}
                    </Button>
                    <Button 
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {language === "vi" ? "Tạo phiếu thu" : "Create Receipt"}
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">
                                    {language === "vi" ? "Tổng phiếu thu" : "Total Receipts"}
                                </p>
                                <p className="text-2xl font-bold text-blue-700">{summary.totalReceipts}</p>
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">
                                    {language === "vi" ? "Tổng thu" : "Total Amount"}
                                </p>
                                <p className="text-2xl font-bold text-green-700">
                                    {summary.totalAmount.toLocaleString("vi-VN")}₫
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">
                                    {language === "vi" ? "Doanh thu tháng" : "Monthly Revenue"}
                                </p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {summary.monthlyRevenue.toLocaleString("vi-VN")}₫
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">
                                    {language === "vi" ? "Đang xử lý" : "Active Receipts"}
                                </p>
                                <p className="text-2xl font-bold text-orange-700">{summary.pendingReceipts}</p>
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder={language === "vi" ? "Tìm kiếm phiếu thu..." : "Search receipts..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            {[
                                { value: "all", label: language === "vi" ? "Tất cả" : "All" },
                                { value: "active", label: language === "vi" ? "Hoạt động" : "Active" },
                                { value: "cancelled", label: language === "vi" ? "Đã hủy" : "Cancelled" }
                            ].map(filter => (
                                <Button
                                    key={filter.value}
                                    variant={filterStatus === filter.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilterStatus(filter.value as any)}
                                    className={filterStatus === filter.value ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Receipt List */}
            <div className="space-y-4">
                {/* Pagination Info */}
                {filteredReceipts.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            {language === "vi" 
                                ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredReceipts.length)} của ${filteredReceipts.length} phiếu thu`
                                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredReceipts.length)} of ${filteredReceipts.length} receipts`}
                        </span>
                        {totalPages > 1 && (
                            <span>{language === "vi" ? `Trang ${currentPage}/${totalPages}` : `Page ${currentPage}/${totalPages}`}</span>
                        )}
                    </div>
                )}

                {/* Receipt Cards Grid */}
                {currentPageReceipts.length === 0 ? (
                    <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                        <CardContent className="p-12 text-center">
                            <div className="h-16 w-16 bg-gradient-to-br from-gray-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {language === "vi" ? "Không tìm thấy phiếu thu" : "No receipts found"}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || filterStatus !== "all"
                                    ? (language === "vi" ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" : "Try changing filters or search terms")
                                    : (language === "vi" ? "Chưa có phiếu thu nào được tạo" : "No receipts have been created yet")
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentPageReceipts.map((receipt, index) => (
                            <ReceiptCard
                                key={receipt.maPhieuThu}
                                receipt={receipt}
                                onUpdate={handleReceiptUpdated}
                                animationDelay={index * 100}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            ←
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 5) {
                                if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={currentPage === pageNum ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            →
                        </Button>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <CreateReceiptDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onSuccess={handleReceiptCreated}
            />
            
            <AutoReceiptDialog
                open={showAutoReceiptDialog}
                onOpenChange={setShowAutoReceiptDialog}
                onSuccess={handleReceiptCreated}
            />
            
            <RevenueReportDialog
                open={showRevenueDialog}
                onOpenChange={setShowRevenueDialog}
            />
            
            <ReconciliationReportDialog
                open={showReconciliationDialog}
                onOpenChange={setShowReconciliationDialog}
            />

            {/* Toast */}
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