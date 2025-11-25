import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
    TrendingUp,
    TrendingDown, 
    DollarSign, 
    Calendar as CalendarLucide,
    BarChart3,
    PieChart,
    Download,
    Filter,
    RefreshCw,
    Target,
    AlertCircle,
    CheckCircle,
    Clock,
    CalendarIcon,
    ChevronDown
} from "lucide-react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { getAllActiveInvoices } from "../api/api-quan-ly-hoa-don"
import type { Invoice } from "../types/invoice"

interface RevenueData {
    period: string
    totalRevenue: number
    paidRevenue: number
    pendingRevenue: number
    overdueRevenue: number
    invoiceCount: number
    avgInvoiceValue: number
    collectionRate: number
}

interface DailyRevenue {
    date: string
    revenue: number
    invoices: number
}

interface MonthlyRevenue {
    month: string
    year: number
    revenue: number
    growth: number
}

interface RoomRevenue {
    roomId: string
    roomName: string
    revenue: number
    invoiceCount: number
    avgRevenue: number
}

interface RevenueMetrics {
    totalRevenue: number
    monthlyGrowth: number
    collectionRate: number
    avgDaysToPayment: number
    topPerformingMonth: string
    totalOutstanding: number
}

export default function RevenueReporting() {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")
    const [isLoading, setIsLoading] = useState(false)
    
    // Data states
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([])
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
    const [roomRevenue, setRoomRevenue] = useState<RoomRevenue[]>([])
    const [metrics, setMetrics] = useState<RevenueMetrics>({
        totalRevenue: 0,
        monthlyGrowth: 0,
        collectionRate: 0,
        avgDaysToPayment: 0,
        topPerformingMonth: "",
        totalOutstanding: 0
    })
    
    // Filters
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [periodType, setPeriodType] = useState<'daily' | 'monthly' | 'yearly'>('monthly')
    const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary')

    const calculateRevenueMetrics = (invoiceList: Invoice[]): RevenueMetrics => {
        const paidInvoices = invoiceList.filter(inv => inv.trangThai === "DA_THANH_TOAN" || inv.trangThai === "daThanhToan")
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.tongTien, 0)
        const totalOutstanding = invoiceList
            .filter(inv => inv.trangThai === "CON_NO" || inv.trangThai === "quaHan")
            .reduce((sum, inv) => sum + inv.tienConNo, 0)
        
        const collectionRate = invoiceList.length > 0 
            ? (paidInvoices.length / invoiceList.length) * 100 
            : 0

        // Calculate monthly data for growth
        const monthlyMap = new Map<string, number>()
        paidInvoices.forEach(invoice => {
            const key = `${invoice.nam}-${invoice.thang.toString().padStart(2, '0')}`
            monthlyMap.set(key, (monthlyMap.get(key) || 0) + invoice.tongTien)
        })
        
        const monthlyData = Array.from(monthlyMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([period, revenue]) => ({ period, revenue }))
        
        const monthlyGrowth = monthlyData.length >= 2 
            ? ((monthlyData[monthlyData.length - 1].revenue - monthlyData[monthlyData.length - 2].revenue) / monthlyData[monthlyData.length - 2].revenue) * 100
            : 0

        const topPerformingMonth = monthlyData.length > 0 
            ? monthlyData.reduce((max, curr) => curr.revenue > max.revenue ? curr : max).period
            : ""

        return {
            totalRevenue,
            monthlyGrowth,
            collectionRate,
            avgDaysToPayment: 15, // Placeholder - would need payment date data
            topPerformingMonth,
            totalOutstanding
        }
    }

    const calculateDailyRevenue = (invoiceList: Invoice[]): DailyRevenue[] => {
        const dailyMap = new Map<string, { revenue: number, invoices: number }>()
        
        invoiceList
            .filter(inv => inv.trangThai === "DA_THANH_TOAN" || inv.trangThai === "daThanhToan")
            .forEach(invoice => {
                const date = invoice.ngayTao.split('T')[0] // Assuming ISO date format
                const current = dailyMap.get(date) || { revenue: 0, invoices: 0 }
                dailyMap.set(date, {
                    revenue: current.revenue + invoice.tongTien,
                    invoices: current.invoices + 1
                })
            })
        
        return Array.from(dailyMap.entries())
            .map(([date, data]) => ({
                date,
                revenue: data.revenue,
                invoices: data.invoices
            }))
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 30) // Last 30 days
    }

    const calculateMonthlyRevenue = (invoiceList: Invoice[]): MonthlyRevenue[] => {
        const monthlyMap = new Map<string, number>()
        
        invoiceList
            .filter(inv => inv.trangThai === "DA_THANH_TOAN" || inv.trangThai === "daThanhToan")
            .forEach(invoice => {
                const key = `${invoice.nam}-${invoice.thang.toString().padStart(2, '0')}`
                monthlyMap.set(key, (monthlyMap.get(key) || 0) + invoice.tongTien)
            })
        
        const sortedData = Array.from(monthlyMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([period, revenue], index, arr) => {
                const [year, month] = period.split('-')
                const growth = index > 0 
                    ? ((revenue - arr[index - 1][1]) / arr[index - 1][1]) * 100
                    : 0
                
                return {
                    month: period,
                    year: parseInt(year),
                    revenue,
                    growth
                }
            })
        
        return sortedData.slice(-12) // Last 12 months
    }

    const calculateRoomRevenue = (invoiceList: Invoice[]): RoomRevenue[] => {
        const roomMap = new Map<string, { revenue: number, count: number, name: string }>()
        
        invoiceList
            .filter(inv => inv.trangThai === "DA_THANH_TOAN" || inv.trangThai === "daThanhToan")
            .forEach(invoice => {
                const roomId = invoice.maHopDongPhong.toString()
                const roomName = invoice.tenPhong || `Contract #${invoice.maHopDongPhong}`
                const current = roomMap.get(roomId) || { revenue: 0, count: 0, name: roomName }
                
                roomMap.set(roomId, {
                    revenue: current.revenue + invoice.tongTien,
                    count: current.count + 1,
                    name: roomName
                })
            })
        
        return Array.from(roomMap.entries())
            .map(([roomId, data]) => ({
                roomId,
                roomName: data.name,
                revenue: data.revenue,
                invoiceCount: data.count,
                avgRevenue: data.count > 0 ? data.revenue / data.count : 0
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 20) // Top 20 rooms
    }

    const loadRevenueData = async () => {
        setIsLoading(true)
        try {
            const result = await getAllActiveInvoices()
            if (result.status === "success" && result.data) {
                let filteredInvoices = result.data
                
                // Apply date filters if set
                if (startDate || endDate) {
                    filteredInvoices = result.data.filter(invoice => {
                        const invoiceDate = new Date(invoice.ngayTao)
                        if (startDate && invoiceDate < startDate) return false
                        if (endDate && invoiceDate > endDate) return false
                        return true
                    })
                }
                
                setInvoices(filteredInvoices)
                setMetrics(calculateRevenueMetrics(filteredInvoices))
                setDailyRevenue(calculateDailyRevenue(filteredInvoices))
                setMonthlyRevenue(calculateMonthlyRevenue(filteredInvoices))
                setRoomRevenue(calculateRoomRevenue(filteredInvoices))
                
            } else {
                showError(result.message || (language === "vi" ? "Không thể tải dữ liệu doanh thu" : "Failed to load revenue data"))
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi tải dữ liệu" : "Error loading data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadRevenueData()
        }
    }, [isOpen])

    const exportReport = () => {
        const reportData = {
            metrics,
            dailyRevenue,
            monthlyRevenue,
            roomRevenue,
            generatedAt: new Date().toISOString()
        }
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `revenue-report-${new Date().toISOString().split('T')[0]}.json`
        link.click()
        URL.revokeObjectURL(url)
        
        showSuccess(language === "vi" ? "Đã xuất báo cáo" : "Report exported successfully")
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN") + "₫"
    }

    const formatPercentage = (value: number) => {
        return (value >= 0 ? "+" : "") + value.toFixed(1) + "%"
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg shadow-green-200 font-medium transition-all duration-200 rounded-xl">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Báo cáo doanh thu" : "Revenue Report"}
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {language === "vi" ? "Báo cáo doanh thu" : "Revenue Report"}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                {language === "vi" ? "Đang tải dữ liệu doanh thu..." : "Loading revenue data..."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Filters */}
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <Filter className="h-5 w-5" />
                                    {language === "vi" ? "Bộ lọc" : "Filters"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>{language === "vi" ? "Từ ngày:" : "From Date:"}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {startDate ? startDate.toLocaleDateString() : (language === "vi" ? "Chọn ngày bắt đầu" : "Select start date")}
                                                    <CalendarIcon className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{language === "vi" ? "Đến ngày:" : "To Date:"}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {endDate ? endDate.toLocaleDateString() : (language === "vi" ? "Chọn ngày kết thúc" : "Select end date")}
                                                    <CalendarIcon className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{language === "vi" ? "Kỳ báo cáo:" : "Period Type:"}</Label>
                                        <Select value={periodType} onValueChange={(value) => setPeriodType(value as any)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">{language === "vi" ? "Hàng ngày" : "Daily"}</SelectItem>
                                                <SelectItem value="monthly">{language === "vi" ? "Hàng tháng" : "Monthly"}</SelectItem>
                                                <SelectItem value="yearly">{language === "vi" ? "Hàng năm" : "Yearly"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <Button onClick={loadRevenueData} size="sm">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Làm mới" : "Refresh"}
                                        </Button>
                                        <Button onClick={exportReport} variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Xuất" : "Export"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">{language === "vi" ? "Tổng quan" : "Overview"}</TabsTrigger>
                                <TabsTrigger value="trends">{language === "vi" ? "Xu hướng" : "Trends"}</TabsTrigger>
                                <TabsTrigger value="rooms">{language === "vi" ? "Theo phòng" : "By Room"}</TabsTrigger>
                                <TabsTrigger value="analysis">{language === "vi" ? "Phân tích" : "Analysis"}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                        <CardContent className="p-4 text-center">
                                            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-green-700">{formatCurrency(metrics.totalRevenue)}</p>
                                            <p className="text-xs text-green-600">{language === "vi" ? "Tổng doanh thu" : "Total Revenue"}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                        <CardContent className="p-4 text-center">
                                            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-blue-700">{formatPercentage(metrics.monthlyGrowth)}</p>
                                            <p className="text-xs text-blue-600">{language === "vi" ? "Tăng trưởng" : "Growth"}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                        <CardContent className="p-4 text-center">
                                            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-purple-700">{metrics.collectionRate.toFixed(1)}%</p>
                                            <p className="text-xs text-purple-600">{language === "vi" ? "Tỷ lệ thu" : "Collection Rate"}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                                        <CardContent className="p-4 text-center">
                                            <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-orange-700">{formatCurrency(metrics.totalOutstanding)}</p>
                                            <p className="text-xs text-orange-600">{language === "vi" ? "Công nợ" : "Outstanding"}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                                        <CardContent className="p-4 text-center">
                                            <Clock className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                                            <p className="text-xl font-bold text-teal-700">{metrics.avgDaysToPayment}</p>
                                            <p className="text-xs text-teal-600">{language === "vi" ? "Ngày TB" : "Avg Days"}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                                        <CardContent className="p-4 text-center">
                                            <CalendarLucide className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                                            <p className="text-lg font-bold text-indigo-700">{metrics.topPerformingMonth}</p>
                                            <p className="text-xs text-indigo-600">{language === "vi" ? "Tháng tốt nhất" : "Best Month"}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Performance */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5" />
                                            {language === "vi" ? "Hiệu suất gần đây" : "Recent Performance"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {dailyRevenue.slice(0, 10).map((day, index) => (
                                                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-green-600">{formatCurrency(day.revenue)}</p>
                                                        <p className="text-sm text-gray-600">{day.invoices} {language === "vi" ? "hóa đơn" : "invoices"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="trends" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            {language === "vi" ? "Xu hướng doanh thu theo tháng" : "Monthly Revenue Trends"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {monthlyRevenue.map((month, index) => (
                                                <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <CalendarLucide className="h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <p className="font-semibold">{month.month}</p>
                                                            <p className="text-sm text-gray-600">{month.year}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold">{formatCurrency(month.revenue)}</p>
                                                        <div className="flex items-center gap-1">
                                                            {month.growth >= 0 ? (
                                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                                            )}
                                                            <span className={`text-sm ${month.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {formatPercentage(month.growth)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="rooms" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <PieChart className="h-5 w-5" />
                                            {language === "vi" ? "Doanh thu theo phòng" : "Revenue by Room"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {roomRevenue.map((room, index) => (
                                                <div key={room.roomId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                            #{index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{room.roomName}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {room.invoiceCount} {language === "vi" ? "hóa đơn" : "invoices"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold">{formatCurrency(room.revenue)}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {language === "vi" ? "TB:" : "Avg:"} {formatCurrency(room.avgRevenue)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="analysis" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardHeader>
                                            <CardTitle className="text-blue-800 flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5" />
                                                {language === "vi" ? "Điểm mạnh" : "Strengths"}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                                <p className="text-sm">
                                                    {language === "vi" 
                                                        ? `Tỷ lệ thu ${metrics.collectionRate.toFixed(1)}% - ${metrics.collectionRate > 80 ? 'tốt' : 'cần cải thiện'}`
                                                        : `Collection rate of ${metrics.collectionRate.toFixed(1)}% - ${metrics.collectionRate > 80 ? 'good' : 'needs improvement'}`}
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                <p className="text-sm">
                                                    {language === "vi" 
                                                        ? `Doanh thu tăng trưởng ${formatPercentage(metrics.monthlyGrowth)} so với tháng trước`
                                                        : `Revenue growth of ${formatPercentage(metrics.monthlyGrowth)} from last month`}
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                                                <p className="text-sm">
                                                    {language === "vi" 
                                                        ? `Tháng ${metrics.topPerformingMonth} là tháng có doanh thu cao nhất`
                                                        : `${metrics.topPerformingMonth} was the highest performing month`}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-orange-50 border-orange-200">
                                        <CardHeader>
                                            <CardTitle className="text-orange-800 flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5" />
                                                {language === "vi" ? "Cần chú ý" : "Areas for Attention"}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                                                <p className="text-sm">
                                                    {language === "vi" 
                                                        ? `Tổng công nợ: ${formatCurrency(metrics.totalOutstanding)}`
                                                        : `Total outstanding debt: ${formatCurrency(metrics.totalOutstanding)}`}
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                                                <p className="text-sm">
                                                    {language === "vi" 
                                                        ? `Thời gian thu nợ trung bình: ${metrics.avgDaysToPayment} ngày`
                                                        : `Average collection time: ${metrics.avgDaysToPayment} days`}
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                                                <p className="text-sm">
                                                    {language === "vi" 
                                                        ? `${((invoices.length - invoices.filter(i => i.trangThai === "DA_THANH_TOAN" || i.trangThai === "daThanhToan").length) / invoices.length * 100).toFixed(1)}% hóa đơn chưa thanh toán`
                                                        : `${((invoices.length - invoices.filter(i => i.trangThai === "DA_THANH_TOAN" || i.trangThai === "daThanhToan").length) / invoices.length * 100).toFixed(1)}% of invoices unpaid`}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recommendations */}
                                <Card className="bg-green-50 border-green-200">
                                    <CardHeader>
                                        <CardTitle className="text-green-800 flex items-center gap-2">
                                            <Target className="h-5 w-5" />
                                            {language === "vi" ? "Khuyến nghị" : "Recommendations"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-white rounded border">
                                                <h4 className="font-semibold text-green-800 mb-2">
                                                    {language === "vi" ? "Cải thiện thu nợ" : "Improve Collection"}
                                                </h4>
                                                <p className="text-sm text-green-700">
                                                    {language === "vi" 
                                                        ? "Thiết lập hệ thống nhắc nhở tự động và chính sách phạt chậm nộp"
                                                        : "Set up automated reminders and late payment policies"}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white rounded border">
                                                <h4 className="font-semibold text-green-800 mb-2">
                                                    {language === "vi" ? "Tối ưu giá thuê" : "Optimize Pricing"}
                                                </h4>
                                                <p className="text-sm text-green-700">
                                                    {language === "vi" 
                                                        ? "Xem xét điều chỉnh giá thuê cho các phòng có doanh thu thấp"
                                                        : "Review pricing for rooms with low revenue performance"}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={() => setIsOpen(false)}>
                        {language === "vi" ? "Đóng" : "Close"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}