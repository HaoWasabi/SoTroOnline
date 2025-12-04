import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    CheckCircle, 
    Clock, 
    AlertTriangle, 
    XCircle, 
    Calendar,
    TrendingUp,
    BarChart3,
    Filter,
    Search,
    RefreshCw,
    Bell
} from "lucide-react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { getAllActiveInvoices } from "../api/api-quan-ly-hoa-don"
import type { Invoice } from "../types/invoice"

interface InvoiceStats {
    total: number
    paid: number
    pending: number
    overdue: number
    deleted: number
    totalRevenue: number
    totalDebt: number
}

interface MonthlyData {
    month: string
    paid: number
    pending: number
    overdue: number
    revenue: number
}

interface OverdueInvoice {
    maHoaDon: number
    maHopDongPhong: number
    tenPhong?: string
    tenKhachThue?: string
    tienConNo: number
    thang: number
    nam: number
    monthsOverdue: number
    urgencyLevel: "low" | "medium" | "high" | "critical"
}

export default function InvoiceStatusTracking() {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
    const [stats, setStats] = useState<InvoiceStats>({
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        deleted: 0,
        totalRevenue: 0,
        totalDebt: 0
    })
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
    const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedMonth, setSelectedMonth] = useState<string>("all-months")
    const [activeTab, setActiveTab] = useState("overview")

    const calculateStats = (invoiceList: Invoice[]): InvoiceStats => {
        const stats = invoiceList.reduce((acc, invoice) => {
            acc.total++
            
            switch (invoice.trangThai) {
                case "DA_THANH_TOAN":
                case "daThanhToan":
                    acc.paid++
                    acc.totalRevenue += invoice.tongTien
                    break
                case "CON_NO":
                case "choThanhToan":
                    acc.pending++
                    acc.totalDebt += invoice.tienConNo
                    break
                case "quaHan":
                    acc.overdue++
                    acc.totalDebt += invoice.tienConNo
                    break
                case "DA_XOA":
                case "daXoa":
                    acc.deleted++
                    break
            }
            
            return acc
        }, {
            total: 0,
            paid: 0,
            pending: 0,
            overdue: 0,
            deleted: 0,
            totalRevenue: 0,
            totalDebt: 0
        })

        return stats
    }

    const calculateMonthlyData = (invoiceList: Invoice[]): MonthlyData[] => {
        const monthlyMap = new Map<string, MonthlyData>()
        
        invoiceList.forEach(invoice => {
            const key = `${invoice.nam}-${invoice.thang.toString().padStart(2, '0')}`
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, {
                    month: key,
                    paid: 0,
                    pending: 0,
                    overdue: 0,
                    revenue: 0
                })
            }
            
            const data = monthlyMap.get(key)!
            switch (invoice.trangThai) {
                case "DA_THANH_TOAN":
                case "daThanhToan":
                    data.paid++
                    data.revenue += invoice.tongTien
                    break
                case "CON_NO":
                case "choThanhToan":
                    data.pending++
                    break
                case "quaHan":
                    data.overdue++
                    break
            }
        })
        
        return Array.from(monthlyMap.values())
            .sort((a, b) => b.month.localeCompare(a.month))
            .slice(0, 12) // Last 12 months
    }

    const calculateOverdueInvoices = (invoiceList: Invoice[]): OverdueInvoice[] => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()
        
        return invoiceList
            .filter(invoice => 
                (invoice.trangThai === "CON_NO" || invoice.trangThai === "quaHan") && 
                invoice.tienConNo > 0
            )
            .map(invoice => {
                const monthsDiff = (currentYear - invoice.nam) * 12 + (currentMonth - invoice.thang)
                let urgencyLevel: "low" | "medium" | "high" | "critical" = "low"
                
                if (monthsDiff > 3) urgencyLevel = "critical"
                else if (monthsDiff > 2) urgencyLevel = "high" 
                else if (monthsDiff > 1) urgencyLevel = "medium"
                
                return {
                    maHoaDon: invoice.maHoaDon,
                    maHopDongPhong: invoice.maHopDongPhong,
                    tenPhong: invoice.tenPhong,
                    tenKhachThue: invoice.tenKhachThue,
                    tienConNo: invoice.tienConNo,
                    thang: invoice.thang,
                    nam: invoice.nam,
                    monthsOverdue: Math.max(0, monthsDiff),
                    urgencyLevel
                }
            })
            .sort((a, b) => b.monthsOverdue - a.monthsOverdue)
    }

    const loadInvoiceData = async () => {
        setIsLoading(true)
        try {
            const result = await getAllActiveInvoices()
            if (result.status === "success" && result.data) {
                setInvoices(result.data)
                setFilteredInvoices(result.data)
                setStats(calculateStats(result.data))
                setMonthlyData(calculateMonthlyData(result.data))
                setOverdueInvoices(calculateOverdueInvoices(result.data))
            } else {
                showError(result.message || (language === "vi" ? "Không thể tải dữ liệu hóa đơn" : "Failed to load invoice data"))
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi tải dữ liệu" : "Error loading data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadInvoiceData()
        }
    }, [isOpen])

    useEffect(() => {
        let filtered = invoices

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(invoice => 
                (invoice.tenPhong && invoice.tenPhong.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (invoice.tenKhachThue && invoice.tenKhachThue.toLowerCase().includes(searchTerm.toLowerCase())) ||
                invoice.maHoaDon.toString().includes(searchTerm) ||
                invoice.maHopDongPhong.toString().includes(searchTerm)
            )
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(invoice => {
                switch (statusFilter) {
                    case "paid":
                        return invoice.trangThai === "DA_THANH_TOAN" || invoice.trangThai === "daThanhToan"
                    case "pending":
                        return invoice.trangThai === "CON_NO" || invoice.trangThai === "choThanhToan"
                    case "overdue":
                        return invoice.trangThai === "quaHan"
                    case "deleted":
                        return invoice.trangThai === "DA_XOA" || invoice.trangThai === "daXoa"
                    default:
                        return true
                }
            })
        }

        // Apply month filter
        if (selectedMonth && selectedMonth !== "all-months") {
            const [year, month] = selectedMonth.split("-")
            filtered = filtered.filter(invoice => 
                invoice.nam.toString() === year && invoice.thang.toString().padStart(2, '0') === month
            )
        }

        setFilteredInvoices(filtered)
    }, [searchTerm, statusFilter, selectedMonth, invoices])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DA_THANH_TOAN":
            case "daThanhToan":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "CON_NO":
            case "choThanhToan":
                return <Clock className="h-4 w-4 text-yellow-600" />
            case "quaHan":
                return <AlertTriangle className="h-4 w-4 text-red-600" />
            case "DA_XOA":
            case "daXoa":
                return <XCircle className="h-4 w-4 text-gray-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DA_THANH_TOAN":
            case "daThanhToan":
                return "bg-green-100 text-green-700"
            case "CON_NO":
            case "choThanhToan":
                return "bg-yellow-100 text-yellow-700"
            case "quaHan":
                return "bg-red-100 text-red-700"
            case "DA_XOA":
            case "daXoa":
                return "bg-gray-100 text-gray-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "critical":
                return "bg-red-100 text-red-700 border-red-300"
            case "high":
                return "bg-orange-100 text-orange-700 border-orange-300"
            case "medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-300"
            default:
                return "bg-blue-100 text-blue-700 border-blue-300"
        }
    }

    // Generate month options for filter
    const monthOptions = []
    for (let i = 0; i < 12; i++) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        monthOptions.push({
            value: `${year}-${month}`,
            label: `${language === "vi" ? "Tháng" : "Month"} ${month}/${year}`
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-blue-200 font-medium transition-all duration-200 rounded-xl">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Theo dõi trạng thái" : "Track Status"}
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm border-0 rounded-2xl shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                        <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                        </div>
                        {language === "vi" ? "Theo dõi trạng thái hóa đơn" : "Invoice Status Tracking"}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                {language === "vi" ? "Đang tải dữ liệu..." : "Loading data..."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">{language === "vi" ? "Tổng quan" : "Overview"}</TabsTrigger>
                            <TabsTrigger value="details">{language === "vi" ? "Chi tiết" : "Details"}</TabsTrigger>
                            <TabsTrigger value="alerts">{language === "vi" ? "Cảnh báo" : "Alerts"}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-slate-50/30 backdrop-blur-sm shadow-md shadow-gray-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <BarChart3 className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800 mb-1">{stats.total}</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{language === "vi" ? "Tổng cộng" : "Total"}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-green-50 to-emerald-50/30 backdrop-blur-sm shadow-md shadow-green-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-2xl font-bold text-green-700 mb-1">{stats.paid}</p>
                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">{language === "vi" ? "Đã TT" : "Paid"}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-yellow-50 to-amber-50/30 backdrop-blur-sm shadow-md shadow-yellow-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <Clock className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-2xl font-bold text-yellow-700 mb-1">{stats.pending}</p>
                                        <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">{language === "vi" ? "Chờ TT" : "Pending"}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-red-50 to-rose-50/30 backdrop-blur-sm shadow-md shadow-red-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <AlertTriangle className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-2xl font-bold text-red-700 mb-1">{stats.overdue}</p>
                                        <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">{language === "vi" ? "Quá hạn" : "Overdue"}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-gray-50/30 backdrop-blur-sm shadow-md shadow-slate-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <XCircle className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-700 mb-1">{stats.deleted}</p>
                                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{language === "vi" ? "Đã xóa" : "Deleted"}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-emerald-50 to-green-50/30 backdrop-blur-sm shadow-md shadow-emerald-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-lg font-bold text-emerald-700 mb-1">{stats.totalRevenue.toLocaleString("vi-VN")}₫</p>
                                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{language === "vi" ? "Doanh thu" : "Revenue"}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-orange-50 to-amber-50/30 backdrop-blur-sm shadow-md shadow-orange-100/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                            <AlertTriangle className="h-6 w-6 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/20 to-transparent"></div>
                                        </div>
                                        <p className="text-lg font-bold text-orange-700 mb-1">{stats.totalDebt.toLocaleString("vi-VN")}₫</p>
                                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">{language === "vi" ? "Công nợ" : "Debt"}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Monthly Trend */}
                            <Card className="hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm shadow-lg shadow-blue-100/20">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
                                        <div className="relative h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Calendar className="h-5 w-5 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                                        </div>
                                        {language === "vi" ? "Xu hướng 12 tháng gần đây" : "12-Month Trend"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        {monthlyData.map((data, index) => (
                                            <div key={data.month} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                                        <div className="font-semibold text-gray-800">{data.month}</div>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            <span className="text-green-600 font-medium">{language === "vi" ? "TT:" : "Paid:"} {data.paid}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                            <span className="text-yellow-600 font-medium">{language === "vi" ? "Chờ:" : "Pending:"} {data.pending}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                            <span className="text-red-600 font-medium">{language === "vi" ? "QH:" : "Overdue:"} {data.overdue}</span>
                                                        </div>
                                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md">
                                                            {data.revenue.toLocaleString("vi-VN")}₫
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-6">
                            {/* Search and Filters */}
                            <div className="flex gap-4 items-center p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder={language === "vi" ? "Tìm kiếm hóa đơn..." : "Search invoices..."}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 h-12 border-0 bg-white rounded-xl shadow-sm focus:shadow-md transition-all duration-200 font-medium"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-48 h-12 border-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{language === "vi" ? "Tất cả trạng thái" : "All Status"}</SelectItem>
                                        <SelectItem value="paid">{language === "vi" ? "Đã thanh toán" : "Paid"}</SelectItem>
                                        <SelectItem value="pending">{language === "vi" ? "Chờ thanh toán" : "Pending"}</SelectItem>
                                        <SelectItem value="overdue">{language === "vi" ? "Quá hạn" : "Overdue"}</SelectItem>
                                        <SelectItem value="deleted">{language === "vi" ? "Đã xóa" : "Deleted"}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-48 h-12 border-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium">
                                        <SelectValue placeholder={language === "vi" ? "Tất cả tháng" : "All months"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-months">{language === "vi" ? "Tất cả tháng" : "All months"}</SelectItem>
                                        {monthOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button 
                                    onClick={loadInvoiceData} 
                                    className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Invoice List */}
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {filteredInvoices.map((invoice) => (
                                    <Card key={invoice.maHoaDon} className="hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-gray-50/30 backdrop-blur-sm shadow-md shadow-gray-100/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                        {getStatusIcon(invoice.trangThai)}
                                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg text-gray-900 mb-1">
                                                            {language === "vi" ? "Hóa đơn" : "Invoice"} #{invoice.maHoaDon}
                                                        </p>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            {invoice.thang}/{invoice.nam} • {invoice.tenPhong || `Contract #${invoice.maHopDongPhong}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="font-bold text-xl text-gray-900 mb-1">
                                                            {invoice.tongTien.toLocaleString("vi-VN")}₫
                                                        </p>
                                                        {invoice.tienConNo > 0 && (
                                                            <p className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                                                                {language === "vi" ? "Nợ:" : "Debt:"} {invoice.tienConNo.toLocaleString("vi-VN")}₫
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Badge className={`text-xs font-semibold border-0 px-3 py-2 rounded-xl flex items-center gap-1 shadow-md ${getStatusColor(invoice.trangThai)}`}>
                                                        <div className="w-2 h-2 rounded-full bg-current opacity-80"></div>
                                                        {invoice.trangThai}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                
                                {filteredInvoices.length === 0 && (
                                    <Card className="border-0 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 shadow-md">
                                        <CardContent className="p-12 text-center">
                                            <div className="relative h-16 w-16 bg-gradient-to-br from-gray-400 to-slate-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                                <Search className="h-8 w-8 text-white" />
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-300/20 to-transparent"></div>
                                            </div>
                                            <p className="text-gray-600 font-medium">
                                                {language === "vi" ? "Không tìm thấy hóa đơn nào" : "No invoices found"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="alerts" className="space-y-6">
                            <Card className="hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-red-50 to-rose-50/30 backdrop-blur-sm shadow-lg shadow-red-100/20">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-lg font-bold text-red-700">
                                        <div className="relative h-10 w-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Bell className="h-5 w-5 text-white" />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/20 to-transparent"></div>
                                        </div>
                                        {language === "vi" ? "Hóa đơn cần chú ý" : "Invoices Requiring Attention"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {overdueInvoices.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="relative h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                                <CheckCircle className="h-8 w-8 text-white" />
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 to-transparent"></div>
                                            </div>
                                            <p className="text-green-600 font-semibold text-lg">
                                                {language === "vi" ? "Tất cả hóa đơn đều được thanh toán đúng hạn!" : "All invoices are paid on time!"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {overdueInvoices.map((invoice) => (
                                                <Card key={invoice.maHoaDon} className={`border-l-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200 rounded-xl ${getUrgencyColor(invoice.urgencyLevel)}`}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-bold text-lg text-gray-900 mb-1">
                                                                    {language === "vi" ? "Hóa đơn" : "Invoice"} #{invoice.maHoaDon}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    {invoice.tenPhong || `Contract #${invoice.maHopDongPhong}`} • {invoice.tenKhachThue}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className={`text-xs font-semibold border px-2 py-1 rounded-lg ${getUrgencyColor(invoice.urgencyLevel)}`}>
                                                                        {invoice.monthsOverdue} {language === "vi" ? "tháng" : "months"}
                                                                    </Badge>
                                                                    <span className="text-sm text-gray-500">
                                                                        {language === "vi" ? "Kỳ:" : "Period:"} {invoice.thang}/{invoice.nam}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-xl text-gray-900 mb-1">
                                                                    {invoice.tienConNo.toLocaleString("vi-VN")}₫
                                                                </p>
                                                                <p className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                                                                    {language === "vi" ? "Quá hạn" : "Overdue"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <Button 
                        onClick={() => setIsOpen(false)}
                        className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium px-8"
                    >
                        {language === "vi" ? "Đóng" : "Close"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}