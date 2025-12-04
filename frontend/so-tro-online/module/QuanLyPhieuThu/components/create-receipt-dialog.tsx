'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Plus, DollarSign, FileText, User, Search, Calendar } from 'lucide-react'
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
import { createReceipt, ReceiptRequest } from '@/module/QuanLyPhieuThu/api/receipt-api'


import { getAllActiveInvoices } from '@/module/QuanLyHoaDon/api/api-quan-ly-hoa-don'
import { Invoice } from '@/module/QuanLyHoaDon/types/invoice'
import { fetchTenants } from '@/module/QuanLyKhachThue/api/api-tenant'
import { Tenant } from '@/module/QuanLyKhachThue/types/Tenant'

interface CreateReceiptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function CreateReceiptDialog({ 
    open, 
    onOpenChange, 
    onSuccess 
}: CreateReceiptDialogProps) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    
    const [isLoading, setIsLoading] = useState(false)
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("all")
    const [selectedYear, setSelectedYear] = useState("all")
    
    const [formData, setFormData] = useState<ReceiptRequest>({
        maHoaDon: 0,
        maKhachHang: 0,
        soTienThu: 0,
        ghiChu: '',
        trangThai: 'hoatDong'
    })

    // Load invoices and tenants
    useEffect(() => {
        if (open) {
            loadInvoices()
            loadTenants()
        }
    }, [open])

    const loadInvoices = async () => {
        try {
            const result = await getAllActiveInvoices()
            if (result.status === "success" && result.data) {
                // Filter invoices with outstanding debt
                const unpaidInvoices = result.data.filter(invoice => 
                    invoice.tienConNo > 0 && 
                    invoice.trangThai !== "DA_THANH_TOAN"
                )
                setInvoices(unpaidInvoices)
            }
        } catch (error) {
            console.error("Error loading invoices:", error)
            showError(language === "vi" ? "Không thể tải danh sách hóa đơn" : "Failed to load invoices")
        }
    }

    const loadTenants = async () => {
        try {
            const result = await fetchTenants(0, "", "hoatDong")
            if (result.success && result.data?.content) {
                setTenants(result.data.content)
            }
        } catch (error) {
            console.error("Error loading tenants:", error)
            showError(language === "vi" ? "Không thể tải danh sách khách thuê" : "Failed to load tenants")
        }
    }

    const handleInvoiceChange = (invoiceId: string) => {
        const invoice = invoices.find(inv => inv.maHoaDon.toString() === invoiceId)
        if (invoice) {
            setSelectedInvoice(invoice)
            setFormData(prev => ({
                ...prev,
                maHoaDon: invoice.maHoaDon,
                soTienThu: invoice.tienConNo // Default to full outstanding amount
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation
        if (!formData.maHoaDon) {
            showError(language === "vi" ? "Vui lòng chọn hóa đơn" : "Please select an invoice")
            return
        }
        
        if (!formData.maKhachHang) {
            showError(language === "vi" ? "Vui lòng chọn khách thuê" : "Please select a tenant")
            return
        }
        
        if (formData.soTienThu <= 0) {
            showError(language === "vi" ? "Số tiền thu phải lớn hơn 0" : "Amount must be greater than 0")
            return
        }

        if (selectedInvoice && formData.soTienThu > selectedInvoice.tienConNo) {
            showError(language === "vi" ? "Số tiền thu không được vượt quá số tiền còn nợ" : "Amount cannot exceed outstanding debt")
            return
        }

        try {
            setIsLoading(true)
            const result = await createReceipt(formData)
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Tạo phiếu thu thành công" : "Receipt created successfully")
                onSuccess?.()
                resetForm()
            } else {
                showError(result.message || (language === "vi" ? "Tạo phiếu thu thất bại" : "Failed to create receipt"))
            }
        } catch (error) {
            console.error("Error creating receipt:", error)
            showError(language === "vi" ? "Có lỗi khi tạo phiếu thu" : "Error creating receipt")
        } finally {
            setIsLoading(false)
        }
    }

    // Filtered invoices based on search query and filters
    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            // Search by invoice ID/code
            const matchesSearchQuery = !invoiceSearchQuery || 
                String(invoice.maHoaDon || "").toLowerCase().includes(invoiceSearchQuery.toLowerCase())

            // Filter by month
            const matchesMonth = !selectedMonth || selectedMonth === "all" || 
                (invoice.ngayTao && new Date(invoice.ngayTao).getMonth() + 1 === parseInt(selectedMonth))

            // Filter by year
            const matchesYear = !selectedYear || selectedYear === "all" || 
                (invoice.ngayTao && new Date(invoice.ngayTao).getFullYear() === parseInt(selectedYear))

            return matchesSearchQuery && matchesMonth && matchesYear
        })
    }, [invoices, invoiceSearchQuery, selectedMonth, selectedYear])

    const resetForm = () => {
        setFormData({
            maHoaDon: 0,
            maKhachHang: 0,
            soTienThu: 0,
            ghiChu: '',
            trangThai: 'hoatDong'
        })
        setSelectedInvoice(null)
        setInvoiceSearchQuery("")
        setSelectedMonth("all")
        setSelectedYear("all")
    }

    const handleClose = () => {
        resetForm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="min-w-4xl bg-gradient-to-br from-white via-slate-50/30 to-green-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Tạo phiếu thu mới" : "Create New Receipt"}
                    </DialogTitle>
                    {/* <DialogDescription>
                        {language === "vi" 
                            ? "Tìm kiếm và chọn hóa đơn để tạo phiếu thu"
                            : "Search and select invoice to create receipt"}
                    </DialogDescription> */}
                </DialogHeader>

                <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
                    {/* Left Panel - Invoice Search (50% width) */}
                    <div className="flex-1 space-y-4">
                        <div className="border-r-0 lg:border-r border-gray-200 pr-0 lg:pr-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {language === "vi" ? "Tìm kiếm hóa đơn" : "Search Invoices"}
                            </h3>
                            
                            {/* Search by Invoice ID */}
                            <div className="space-y-2 mb-4">
                                <Label className="text-sm font-medium text-gray-700">
                                    {language === "vi" ? "Tìm theo mã hóa đơn" : "Search by Invoice ID"}
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        value={invoiceSearchQuery}
                                        onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                                        placeholder={language === "vi" ? "Nhập mã hóa đơn..." : "Enter invoice ID..."}
                                        className="pl-10 bg-white border-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Month and Year Filters */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        {language === "vi" ? "Tháng" : "Month"}
                                    </Label>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue placeholder={language === "vi" ? "Chọn tháng" : "Select month"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {language === "vi" ? "Tất cả tháng" : "All months"}
                                            </SelectItem>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <SelectItem key={i + 1} value={String(i + 1)}>
                                                    {language === "vi" ? `Tháng ${i + 1}` : `Month ${i + 1}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        {language === "vi" ? "Năm" : "Year"}
                                    </Label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue placeholder={language === "vi" ? "Chọn năm" : "Select year"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {language === "vi" ? "Tất cả năm" : "All years"}
                                            </SelectItem>
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const year = new Date().getFullYear() - 2 + i;
                                                return (
                                                    <SelectItem key={year} value={String(year)}>
                                                        {year}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Invoice List */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    {language === "vi" ? "Danh sách hóa đơn" : "Invoice List"} ({filteredInvoices.length})
                                </Label>
                                <div className="h-[360px] overflow-y-auto border border-gray-200 rounded-lg bg-white">
                                    {filteredInvoices.length > 0 ? (
                                        <div className="space-y-1 p-2">
                                            {filteredInvoices.map((invoice) => (
                                                <div
                                                    key={invoice.maHoaDon}
                                                    onClick={() => {
                                                        setSelectedInvoice(invoice)
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            maHoaDon: invoice.maHoaDon,
                                                            soTienThu: invoice.tienConNo
                                                        }))
                                                    }}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                                        selectedInvoice?.maHoaDon === invoice.maHoaDon
                                                            ? 'border-green-500 bg-green-50 shadow-md'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-4 w-4 text-blue-600" />
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {language === "vi" ? "Hóa đơn" : "Invoice"} #{invoice.maHoaDon}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {invoice.thang}/{invoice.nam}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-orange-600">
                                                                {invoice.tienConNo.toLocaleString("vi-VN")}₫
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {language === "vi" ? "Còn nợ" : "Outstanding"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500">
                                            <div className="text-center">
                                                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm">
                                                    {language === "vi" ? "Không tìm thấy hóa đơn" : "No invoices found"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form Fields (50% width) */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {language === "vi" ? "Thông tin phiếu thu" : "Receipt Information"}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 h-[530px] flex flex-col">
                            <div className="flex-1 space-y-4 overflow-y-auto">
                                {/* Selected Invoice Info */}
                                {selectedInvoice && (
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <h4 className="font-medium text-blue-800 mb-2">
                                            {language === "vi" ? "Hóa đơn đã chọn" : "Selected Invoice"}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-600 font-medium">
                                                    {language === "vi" ? "Mã:" : "ID:"}
                                                </span>
                                                <span className="ml-2">#{selectedInvoice.maHoaDon}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 font-medium">
                                                    {language === "vi" ? "Kỳ:" : "Period:"}
                                                </span>
                                                <span className="ml-2">{selectedInvoice.thang}/{selectedInvoice.nam}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 font-medium">
                                                    {language === "vi" ? "Tổng tiền:" : "Total:"}
                                                </span>
                                                <span className="ml-2 font-semibold">
                                                    {selectedInvoice.tongTien.toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-orange-600 font-medium">
                                                    {language === "vi" ? "Còn nợ:" : "Outstanding:"}
                                                </span>
                                                <span className="ml-2 font-semibold">
                                                    {selectedInvoice.tienConNo.toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tenant Selection */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">
                                        {language === "vi" ? "Chọn khách thuê" : "Select Tenant"} *
                                    </Label>
                                    <Select 
                                        value={formData.maKhachHang.toString()} 
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, maKhachHang: parseInt(value) }))}
                                    >
                                        <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue placeholder={language === "vi" ? "Chọn khách thuê..." : "Select tenant..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tenants.map((tenant) => (
                                                <SelectItem key={tenant.maKhach} value={tenant.maKhach.toString()}>
                                                    <div className="flex items-center gap-3">
                                                        <User className="h-4 w-4 text-purple-600" />
                                                        <div>
                                                            <span className="font-medium">{tenant.hoTen}</span>
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                {tenant.dienThoai}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">
                                        {language === "vi" ? "Số tiền thu" : "Amount Collected"} *
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
                                            className="pl-10 bg-white border-gray-200"
                                            min="0"
                                            step="any"
                                            required
                                        />
                                    </div>
                                    {selectedInvoice && formData.soTienThu > selectedInvoice.tienConNo && (
                                        <p className="text-red-600 text-sm">
                                            {language === "vi" 
                                                ? "Số tiền thu không được vượt quá số tiền còn nợ"
                                                : "Amount cannot exceed outstanding debt"}
                                        </p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">
                                        {language === "vi" ? "Ghi chú" : "Notes"}
                                    </Label>
                                    <Textarea
                                        value={formData.ghiChu}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ghiChu: e.target.value }))}
                                        placeholder={language === "vi" ? "Nhập ghi chú (tùy chọn)..." : "Enter notes (optional)..."}
                                        className="bg-white border-gray-200 min-h-[80px]"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons - Fixed at bottom */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 mt-auto">
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
                                    disabled={isLoading || !selectedInvoice || formData.soTienThu <= 0}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                >
                                    {isLoading 
                                        ? (language === "vi" ? "Đang tạo..." : "Creating...")
                                        : (language === "vi" ? "Tạo phiếu thu" : "Create Receipt")
                                    }
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}