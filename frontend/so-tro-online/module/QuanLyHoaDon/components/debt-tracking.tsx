import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, DollarSign, Calendar, User, Home, Search, Filter, TrendingUp, CreditCard, Clock, Target } from "lucide-react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { getAllActiveInvoices } from "../api/api-quan-ly-hoa-don"
import { getContractTenants, getContractById } from "@/module/QuanLyHopDongPhong/api/api-quan-ly-hop-dong"
import { fetchTenants } from "@/module/QuanLyKhachThue/api/api-tenant"
import type { Invoice } from "../types/invoice"

interface DebtInfo {
    maHoaDon: number
    maHopDongPhong: number
    tenPhong?: string
    tenKhachThue?: string
    tienConNo: number
    thang: number
    nam: number
    ngayTao: string
    trangThai: string
    isOverdue: boolean
    monthsOverdue: number
}

interface DebtSummary {
    totalDebt: number
    totalInvoices: number
    overdueInvoices: number
    overdueDebt: number
    oldestDebt: DebtInfo | null
}

export default function DebtTracking() {
    const { language } = useLanguageStore()
    const { showError } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [debtInfo, setDebtInfo] = useState<DebtInfo[]>([])
    const [filteredDebts, setFilteredDebts] = useState<DebtInfo[]>([])
    const [debtSummary, setDebtSummary] = useState<DebtSummary>({
        totalDebt: 0,
        totalInvoices: 0,
        overdueInvoices: 0,
        overdueDebt: 0,
        oldestDebt: null
    })
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<"all" | "overdue" | "recent">("all")
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5) // Show 5 debt items per page
    
    // State for tenant name mapping
    const [tenantNames, setTenantNames] = useState<Record<number, string>>({})

    const calculateDebtInfo = (invoices: Invoice[]): { debts: DebtInfo[], summary: DebtSummary } => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()
        
        const debtsWithInfo: DebtInfo[] = invoices
            .filter(invoice => {
                // Include invoices with outstanding debt amount and debt-related statuses
                const hasDebt = invoice.tienConNo > 0
                const isDebtStatus = invoice.trangThai === "CON_NO" || 
                                   invoice.trangThai === "choThanhToan" || 
                                   invoice.trangThai === "quaHan" ||
                                   invoice.trangThai === "overdue" ||
                                   invoice.trangThai === "pending" ||
                                   (invoice.trangThai !== "DA_THANH_TOAN" && 
                                    invoice.trangThai !== "daThanhToan" && 
                                    invoice.trangThai !== "DA_XOA" && 
                                    invoice.trangThai !== "daXoa" &&
                                    invoice.trangThai !== "CANCELLED" &&
                                    invoice.trangThai !== "cancelled")
                
                return hasDebt && isDebtStatus
            })
            .map(invoice => {
                // Calculate months overdue
                const invoiceDate = new Date(invoice.nam, invoice.thang - 1, 1)
                const monthsDiff = (currentYear - invoice.nam) * 12 + (currentMonth - invoice.thang)
                const isOverdue = monthsDiff > 1 // More than 1 month overdue
                
                return {
                    maHoaDon: invoice.maHoaDon,
                    maHopDongPhong: invoice.maHopDongPhong,
                    tenPhong: invoice.tenPhong,
                    tenKhachThue: invoice.tenKhachThue,
                    tienConNo: invoice.tienConNo,
                    thang: invoice.thang,
                    nam: invoice.nam,
                    ngayTao: invoice.ngayTao,
                    trangThai: invoice.trangThai,
                    isOverdue,
                    monthsOverdue: Math.max(0, monthsDiff)
                }
            })
            .sort((a, b) => b.monthsOverdue - a.monthsOverdue) // Sort by most overdue first

        const summary: DebtSummary = {
            totalDebt: debtsWithInfo.reduce((sum, debt) => sum + debt.tienConNo, 0),
            totalInvoices: debtsWithInfo.length,
            overdueInvoices: debtsWithInfo.filter(debt => debt.isOverdue).length,
            overdueDebt: debtsWithInfo.filter(debt => debt.isOverdue).reduce((sum, debt) => sum + debt.tienConNo, 0),
            oldestDebt: debtsWithInfo.length > 0 ? debtsWithInfo[0] : null
        }

        return { debts: debtsWithInfo, summary }
    }

    const fetchTenantNames = async (contractIds: number[]): Promise<Record<number, string>> => {
        const tenantMap: Record<number, string> = {}
        
        // Fetch tenant names for each contract using multiple approaches
        await Promise.all(
            contractIds.map(async (contractId) => {
                try {
                    console.log(`Fetching tenants for contract ${contractId}...`)
                    
                    // Approach 1: Try getContractTenants first
                    let tenantNames: string[] = []
                    
                    const contractTenantsResult = await getContractTenants(contractId)
                    console.log(`Contract ${contractId} tenants result:`, contractTenantsResult)
                    
                    if (contractTenantsResult.status === "success" && contractTenantsResult.data && contractTenantsResult.data.length > 0) {
                        console.log(`Contract ${contractId} tenants data:`, contractTenantsResult.data)
                        
                        tenantNames = contractTenantsResult.data
                            .map((tenant: any) => {
                                console.log(`Processing tenant:`, tenant)
                                // Try various field names that might contain the tenant name
                                const name = tenant.hoTen || 
                                           tenant.tenKhachThue || 
                                           tenant.name || 
                                           tenant.ten || 
                                           tenant.fullName || 
                                           tenant.tenKhach ||
                                           tenant.khachThue?.hoTen ||
                                           tenant.khachThue?.ten
                                
                                console.log(`Extracted name: "${name}" from tenant:`, tenant)
                                return name
                            })
                            .filter(Boolean)
                    }
                    
                    // Approach 2: If no tenants found, try getting contract details and then fetch tenant by ID
                    if (tenantNames.length === 0) {
                        console.log(`No tenants from contract tenants API, trying contract details for ${contractId}...`)
                        
                        const contractResult = await getContractById(contractId)
                        console.log(`Contract ${contractId} details result:`, contractResult)
                        
                        if (contractResult.status === "success" && contractResult.data) {
                            const contract = contractResult.data
                            console.log(`Contract ${contractId} details:`, contract)
                            
                            // Try to get tenant information from contract data
                            if (contract.maKhachDaiDien) {
                                console.log(`Found maKhachDaiDien: ${contract.maKhachDaiDien}, fetching tenant details...`)
                                
                                try {
                                    // Try to fetch tenant by ID from tenant API
                                    const tenantResult = await fetchTenants(0, "", "hoatDong")
                                    console.log(`Tenants API result:`, tenantResult)
                                    
                                    if (tenantResult.success && tenantResult.data && tenantResult.data.content) {
                                        const matchingTenant = tenantResult.data.content.find(
                                            (tenant: any) => tenant.maKhach === contract.maKhachDaiDien || 
                                                           tenant.id === contract.maKhachDaiDien ||
                                                           tenant.maKhachThue === contract.maKhachDaiDien
                                        )
                                        
                                        if (matchingTenant) {
                                            console.log(`Found matching tenant:`, matchingTenant)
                                            const name = matchingTenant.hoTen
                                            if (name) {
                                                tenantNames.push(name)
                                            }
                                        }
                                    }
                                } catch (tenantApiError) {
                                    console.log(`Error fetching from tenant API:`, tenantApiError)
                                }
                            }
                            
                            // Also check if contract has any nested tenant data
                            if (contract.tenants && contract.tenants.length > 0) {
                                console.log(`Found tenants in contract data:`, contract.tenants)
                                const contractTenantNames = contract.tenants
                                    .map((tenant: any) => tenant.hoTen || tenant.ten || tenant.name)
                                    .filter(Boolean)
                                tenantNames.push(...contractTenantNames)
                            }
                        }
                    }
                    
                    console.log(`Final tenant names for contract ${contractId}:`, tenantNames)
                    
                    if (tenantNames.length > 0) {
                        tenantMap[contractId] = tenantNames.join(", ")
                    } else {
                        // If still no names found, use the contract ID as fallback
                        tenantMap[contractId] = `Contract #${contractId}`
                        console.log(`No tenant names found for contract ${contractId}, using fallback`)
                    }
                    
                } catch (error) {
                    console.error(`Error fetching tenants for contract ${contractId}:`, error)
                    tenantMap[contractId] = language === "vi" ? "Lỗi tải dữ liệu" : "Error loading data"
                }
            })
        )
        
        console.log("Final tenant mapping:", tenantMap)
        return tenantMap
    }

    const loadDebtInfo = async () => {
        setIsLoading(true)
        try {
            const result = await getAllActiveInvoices()
            if (result.status === "success" && result.data) {
                const { debts, summary } = calculateDebtInfo(result.data)
                setDebtInfo(debts)
                setFilteredDebts(debts)
                setDebtSummary(summary)
                
                // Fetch tenant names for all unique contract IDs
                const uniqueContractIds = [...new Set(debts.map(debt => debt.maHopDongPhong))]
                if (uniqueContractIds.length > 0) {
                    const tenantMap = await fetchTenantNames(uniqueContractIds)
                    setTenantNames(tenantMap)
                }
            } else {
                showError(result.message || (language === "vi" ? "Không thể tải thông tin công nợ" : "Failed to load debt information"))
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi tải thông tin công nợ" : "Error loading debt information")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadDebtInfo()
        }
    }, [isOpen])

    useEffect(() => {
        let filtered = debtInfo

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(debt => {
                const tenantName = tenantNames[debt.maHopDongPhong] || debt.tenKhachThue
                return (
                    (debt.tenPhong && debt.tenPhong.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (tenantName && tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    debt.maHoaDon.toString().includes(searchTerm) ||
                    debt.maHopDongPhong.toString().includes(searchTerm)
                )
            })
        }

        // Apply type filter
        switch (filterType) {
            case "overdue":
                filtered = filtered.filter(debt => debt.isOverdue)
                break
            case "recent":
                filtered = filtered.filter(debt => !debt.isOverdue)
                break
            default:
                // "all" - no additional filtering
                break
        }

        setFilteredDebts(filtered)
        // Reset to first page when filters change
        setCurrentPage(1)
    }, [searchTerm, filterType, debtInfo, tenantNames])

    const getOverdueLevel = (monthsOverdue: number) => {
        if (monthsOverdue <= 1) return { level: "current", color: "bg-green-100 text-green-700", label: language === "vi" ? "Hiện tại" : "Current" }
        if (monthsOverdue <= 2) return { level: "warning", color: "bg-yellow-100 text-yellow-700", label: language === "vi" ? "Cảnh báo" : "Warning" }
        if (monthsOverdue <= 3) return { level: "danger", color: "bg-orange-100 text-orange-700", label: language === "vi" ? "Nguy hiểm" : "Danger" }
        return { level: "critical", color: "bg-red-100 text-red-700", label: language === "vi" ? "Nghiêm trọng" : "Critical" }
    }

    // Pagination calculations
    const totalPages = Math.ceil(filteredDebts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPageDebts = filteredDebts.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-200 font-medium transition-all duration-200 rounded-xl">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Kiểm tra công nợ" : "Check Outstanding Debt"}
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50/30 to-orange-50/20 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Theo dõi công nợ" : "Debt Tracking Dashboard"}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20"></div>
                            </div>
                            <p className="text-gray-600 font-medium">
                                {language === "vi" ? "Đang phân tích công nợ..." : "Analyzing debt information..."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-gradient-to-br from-red-50 via-red-50 to-rose-100 border-red-100 shadow-xl shadow-red-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6 text-center">
                                    <div className="relative h-14 w-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                        <DollarSign className="h-7 w-7 text-white" />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-400/20 to-transparent"></div>
                                    </div>
                                    <p className="text-2xl font-bold text-red-700 mb-1">
                                        {debtSummary.totalDebt.toLocaleString("vi-VN")}₫
                                    </p>
                                    <p className="text-sm text-red-600 font-medium uppercase tracking-wider">
                                        {language === "vi" ? "Tổng công nợ" : "Total Debt"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-50 via-orange-50 to-amber-100 border-orange-100 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6 text-center">
                                    <div className="relative h-14 w-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                        <Clock className="h-7 w-7 text-white" />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/20 to-transparent"></div>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-700 mb-1">
                                        {debtSummary.overdueDebt.toLocaleString("vi-VN")}₫
                                    </p>
                                    <p className="text-sm text-orange-600 font-medium uppercase tracking-wider">
                                        {language === "vi" ? "Nợ quá hạn" : "Overdue Debt"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 border-blue-100 shadow-xl shadow-blue-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6 text-center">
                                    <div className="relative h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                        <CreditCard className="h-7 w-7 text-white" />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700 mb-1">{debtSummary.totalInvoices}</p>
                                    <p className="text-sm text-blue-600 font-medium uppercase tracking-wider">
                                        {language === "vi" ? "HĐ có nợ" : "Invoices w/ Debt"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 border-purple-100 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6 text-center">
                                    <div className="relative h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                        <Target className="h-7 w-7 text-white" />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-transparent"></div>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-700 mb-1">{debtSummary.overdueInvoices}</p>
                                    <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                                        {language === "vi" ? "HĐ quá hạn" : "Overdue Invoices"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Critical Debt Alert */}
                        {debtSummary.oldestDebt && debtSummary.oldestDebt.monthsOverdue > 2 && (
                            <Card className="bg-gradient-to-r from-red-50 via-red-50 to-rose-50 border-red-200 shadow-xl shadow-red-100/50 rounded-2xl overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                            <AlertTriangle className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-lg font-bold text-red-800 mb-2">
                                                        {language === "vi" ? "🚨 Cảnh báo: Công nợ nghiêm trọng!" : "🚨 Warning: Critical Debt Alert!"}
                                                    </p>
                                                    <p className="text-sm text-red-700">
                                                        {language === "vi" 
                                                            ? `Hóa đơn #${debtSummary.oldestDebt.maHoaDon} đã quá hạn ${debtSummary.oldestDebt.monthsOverdue} tháng`
                                                            : `Invoice #${debtSummary.oldestDebt.maHoaDon} overdue for ${debtSummary.oldestDebt.monthsOverdue} months`}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-red-600">
                                                        {debtSummary.oldestDebt.tienConNo.toLocaleString("vi-VN")}₫
                                                    </p>
                                                    <Badge className="bg-red-100 text-red-700 border-red-200 mt-1">
                                                        {language === "vi" ? "Ưu tiên cao" : "High Priority"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Enhanced Search and Filter */}
                        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            placeholder={language === "vi" ? "🔍 Tìm kiếm theo phòng, khách thuê, mã hóa đơn..." : "🔍 Search by room, tenant, invoice ID..."}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-200 bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        {[
                                            { value: "all", label: language === "vi" ? "Tất cả" : "All", icon: "📊" },
                                            { value: "overdue", label: language === "vi" ? "Quá hạn" : "Overdue", icon: "⚠️" },
                                            { value: "recent", label: language === "vi" ? "Gần đây" : "Recent", icon: "🕐" }
                                        ].map(filter => (
                                            <Button
                                                key={filter.value}
                                                variant={filterType === filter.value ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setFilterType(filter.value as any)}
                                                className={`rounded-xl transition-all duration-200 ${
                                                    filterType === filter.value 
                                                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200" 
                                                        : "hover:bg-orange-50 hover:border-orange-300"
                                                }`}
                                            >
                                                <span className="mr-1">{filter.icon}</span>
                                                {filter.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Modern Debt List with Pagination */}
                        <div className="space-y-6">
                            {/* Pagination Info Header */}
                            {filteredDebts.length > 0 && (
                                <div className="flex items-center justify-between text-sm text-gray-600 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse"></div>
                                        <span className="font-medium">
                                            {language === "vi" 
                                                ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredDebts.length)} của ${filteredDebts.length} công nợ`
                                                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredDebts.length)} of ${filteredDebts.length} debts`}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {language === "vi" ? `Trang ${currentPage}/${totalPages}` : `Page ${currentPage}/${totalPages}`}
                                    </div>
                                </div>
                            )}
                            
                            {/* Debt List */}
                            <div className="space-y-4 min-h-[400px]">
                                {filteredDebts.length === 0 ? (
                                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-2xl">
                                        <CardContent className="p-8 text-center">
                                            <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <TrendingUp className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="text-green-600">
                                                {searchTerm || filterType !== "all" ? (
                                                    <p className="text-lg font-semibold mb-2">
                                                        {language === "vi" ? "🔍 Không tìm thấy kết quả" : "🔍 No matching results"}
                                                    </p>
                                                ) : (
                                                    <p className="text-lg font-semibold mb-2">
                                                        {language === "vi" ? "🎉 Tuyệt vời! Không có công nợ" : "🎉 Excellent! No outstanding debts"}
                                                    </p>
                                                )}
                                                <p className="text-sm text-green-500">
                                                    {language === "vi" ? "Tình hình tài chính ổn định" : "Financial situation is stable"}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    currentPageDebts.map((debt, index) => {
                                        const overdueLevel = getOverdueLevel(debt.monthsOverdue)
                                        return (
                                            <Card 
                                                key={debt.maHoaDon} 
                                                className={`hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-gray-50/30 backdrop-blur-sm ${
                                                    debt.isOverdue ? 'border-l-4 border-l-red-500 shadow-xl shadow-red-100/50' : 'shadow-lg shadow-gray-100/50'
                                                }`}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                                                            {/* Invoice Info */}
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                    <CreditCard className="h-6 w-6 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 text-lg">
                                                                        {language === "vi" ? "Hóa đơn" : "Invoice"} #{debt.maHoaDon}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 font-medium">
                                                                        📅 {debt.thang}/{debt.nam}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Room Info */}
                                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Home className="h-4 w-4 text-blue-600" />
                                                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                                                        {language === "vi" ? "Phòng" : "Room"}
                                                                    </span>
                                                                </div>
                                                                <p className="font-bold text-blue-800 text-sm">
                                                                    {debt.tenPhong || `Contract #${debt.maHopDongPhong}`}
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Tenant Info */}
                                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <User className="h-4 w-4 text-purple-600" />
                                                                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                                                                        {language === "vi" ? "Khách thuê" : "Tenant"}
                                                                    </span>
                                                                </div>
                                                                <p className="font-bold text-purple-800 text-sm">
                                                                    {tenantNames[debt.maHopDongPhong] || debt.tenKhachThue || (language === "vi" ? "Đang tải..." : "Loading...")}
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Amount & Status */}
                                                            <div className="text-right">
                                                                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100 mb-3">
                                                                    <p className="text-sm text-red-600 font-medium mb-1 uppercase tracking-wider">
                                                                        {language === "vi" ? "Số tiền nợ" : "Amount Due"}
                                                                    </p>
                                                                    <p className="text-2xl font-bold text-red-700">
                                                                        {debt.tienConNo.toLocaleString("vi-VN")}₫
                                                                    </p>
                                                                </div>
                                                                <Badge className={`text-xs px-3 py-1 font-semibold shadow-sm ${overdueLevel.color} border-0`}>
                                                                    {overdueLevel.label} ({debt.monthsOverdue} {language === "vi" ? "tháng" : "months"})
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })
                                )}
                            </div>

                            {/* Modern Pagination Controls */}
                            {filteredDebts.length > itemsPerPage && (
                                <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            {/* Items per page info */}
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    {language === "vi" 
                                                        ? `${itemsPerPage} mục mỗi trang`
                                                        : `${itemsPerPage} items per page`}
                                                </span>
                                            </div>

                                            {/* Pagination buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Previous button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="rounded-xl hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50"
                                                >
                                                    ←
                                                </Button>

                                                {/* Page numbers */}
                                                <div className="flex gap-1">
                                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                        let pageNum: number;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = currentPage - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                                                                    currentPage === pageNum
                                                                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                                                                        : "hover:bg-orange-50 hover:border-orange-300"
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Next button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="rounded-xl hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50"
                                                >
                                                    →
                                                </Button>
                                            </div>

                                            {/* Quick navigation */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600">
                                                    {language === "vi" ? "Đi tới:" : "Go to:"}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={currentPage === 1}
                                                    className="text-xs px-2 py-1 rounded-lg hover:bg-orange-50 disabled:opacity-50"
                                                >
                                                    {language === "vi" ? "Đầu" : "First"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handlePageChange(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="text-xs px-2 py-1 rounded-lg hover:bg-orange-50 disabled:opacity-50"
                                                >
                                                    {language === "vi" ? "Cuối" : "Last"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button onClick={loadDebtInfo} variant="outline" className="flex-1">
                                {language === "vi" ? "Làm mới" : "Refresh"}
                            </Button>
                            <Button onClick={() => setIsOpen(false)} className="flex-1">
                                {language === "vi" ? "Đóng" : "Close"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}