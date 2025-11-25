import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, FileText, AlertTriangle, CheckCircle, Clock, Loader2, Plus } from "lucide-react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { getContractsWithoutInvoice } from "@/module/QuanLyHopDongPhong/api/api-quan-ly-hop-dong"
import { createInvoice } from "../api/api-quan-ly-hoa-don"
import type { Contract } from "@/module/QuanLyHopDongPhong/types/contract"

interface PeriodicGenerationResult {
    success: number
    failed: number
    errors: string[]
    generatedInvoices: any[]
}

export default function PeriodicInvoiceGeneration({ onSuccess }: { onSuccess?: () => void }) {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [contracts, setContracts] = useState<Contract[]>([])
    const [selectedContracts, setSelectedContracts] = useState<number[]>([])
    const [isLoadingContracts, setIsLoadingContracts] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationResult, setGenerationResult] = useState<PeriodicGenerationResult | null>(null)
    const [step, setStep] = useState(1) // 1: Select period, 2: Select contracts, 3: Results

    const months = [
        { value: "1", label: language === "vi" ? "Tháng 1" : "January" },
        { value: "2", label: language === "vi" ? "Tháng 2" : "February" },
        { value: "3", label: language === "vi" ? "Tháng 3" : "March" },
        { value: "4", label: language === "vi" ? "Tháng 4" : "April" },
        { value: "5", label: language === "vi" ? "Tháng 5" : "May" },
        { value: "6", label: language === "vi" ? "Tháng 6" : "June" },
        { value: "7", label: language === "vi" ? "Tháng 7" : "July" },
        { value: "8", label: language === "vi" ? "Tháng 8" : "August" },
        { value: "9", label: language === "vi" ? "Tháng 9" : "September" },
        { value: "10", label: language === "vi" ? "Tháng 10" : "October" },
        { value: "11", label: language === "vi" ? "Tháng 11" : "November" },
        { value: "12", label: language === "vi" ? "Tháng 12" : "December" },
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => ({
        value: String(currentYear - 2 + i),
        label: String(currentYear - 2 + i)
    }))

    const handleSearchContracts = async () => {
        if (!selectedMonth || !selectedYear) {
            showError(language === "vi" ? "Vui lòng chọn tháng và năm" : "Please select month and year")
            return
        }

        setIsLoadingContracts(true)
        try {
            const result = await getContractsWithoutInvoice(parseInt(selectedMonth), parseInt(selectedYear))
            if (result.status === "success" && result.data) {
                setContracts(result.data)
                setSelectedContracts(result.data.map(c => Number(c.maHopDongPhong)))
                setStep(2)
            } else {
                showError(result.message || (language === "vi" ? "Không thể tải danh sách hợp đồng" : "Failed to load contracts"))
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi tải danh sách hợp đồng" : "Error loading contracts")
        } finally {
            setIsLoadingContracts(false)
        }
    }

    const handleToggleContract = (contractId: number) => {
        setSelectedContracts(prev =>
            prev.includes(contractId)
                ? prev.filter(id => id !== contractId)
                : [...prev, contractId]
        )
    }

    const handleToggleAll = () => {
        setSelectedContracts(
            selectedContracts.length === contracts.length
                ? []
                : contracts.map(c => Number(c.maHopDongPhong))
        )
    }

    const handleGenerateInvoices = async () => {
        if (selectedContracts.length === 0) {
            showError(language === "vi" ? "Vui lòng chọn ít nhất một hợp đồng" : "Please select at least one contract")
            return
        }

        setIsGenerating(true)
        const result: PeriodicGenerationResult = {
            success: 0,
            failed: 0,
            errors: [],
            generatedInvoices: []
        }

        try {
            for (const contractId of selectedContracts) {
                const contract = contracts.find(c => c.maHopDongPhong === contractId)
                if (!contract) continue

                try {
                    const tienPhong = typeof contract.tienPhong === 'string' 
                        ? parseFloat(contract.tienPhong) || 0 
                        : contract.tienPhong || 0

                    const invoiceData = {
                        maHopDongPhong: contractId,
                        thang: parseInt(selectedMonth),
                        nam: parseInt(selectedYear),
                        tienPhong: tienPhong,
                        tienDichVu: 0,
                        tongTien: tienPhong,
                        tienConNo: tienPhong,
                        ngayTao: new Date().toISOString(),
                        capNhatLanCuoi: new Date().toISOString(),
                        trangThai: "CON_NO",
                        noiDung: `Hóa đơn tháng ${selectedMonth}/${selectedYear} - Phòng ${contract.tenPhong || ''}`
                    }

                    const response = await createInvoice(invoiceData)
                    if (response.status === "success") {
                        result.success++
                        result.generatedInvoices.push(response.data)
                    } else {
                        result.failed++
                        result.errors.push(`${contract.tenPhong || contract.maHopDongPhong}: ${response.message}`)
                    }
                } catch (error) {
                    result.failed++
                    result.errors.push(`${contract.tenPhong || contract.maHopDongPhong}: ${error instanceof Error ? error.message : 'Unknown error'}`)
                }
            }

            setGenerationResult(result)
            setStep(3)

            if (result.success > 0) {
                showSuccess(
                    language === "vi" 
                        ? `Tạo thành công ${result.success} hóa đơn` 
                        : `Successfully generated ${result.success} invoices`
                )
                onSuccess?.()
            }

            if (result.failed > 0) {
                showError(
                    language === "vi" 
                        ? `Tạo thất bại ${result.failed} hóa đơn` 
                        : `Failed to generate ${result.failed} invoices`
                )
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi tạo hóa đơn" : "Error generating invoices")
        } finally {
            setIsGenerating(false)
        }
    }

    const resetDialog = () => {
        setStep(1)
        setContracts([])
        setSelectedContracts([])
        setGenerationResult(null)
        setSelectedMonth("")
        setSelectedYear("")
    }

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(resetDialog, 300) // Reset after animation
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-200 font-medium transition-all duration-200 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Tạo hóa đơn định kỳ" : "Generate Periodic Invoices"}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {language === "vi" ? "Tạo hóa đơn định kỳ" : "Periodic Invoice Generation"}
                    </DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="font-semibold text-lg mb-4 text-blue-800">
                                {language === "vi" ? "Chọn kỳ thanh toán" : "Select Payment Period"}
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {language === "vi" ? "Tháng" : "Month"}
                                    </label>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={language === "vi" ? "Chọn tháng" : "Select month"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map(month => (
                                                <SelectItem key={month.value} value={month.value}>
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {language === "vi" ? "Năm" : "Year"}
                                    </label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={language === "vi" ? "Chọn năm" : "Select year"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map(year => (
                                                <SelectItem key={year.value} value={year.value}>
                                                    {year.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button 
                                onClick={handleSearchContracts}
                                disabled={!selectedMonth || !selectedYear || isLoadingContracts}
                                className="mt-4 w-full"
                            >
                                {isLoadingContracts ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {language === "vi" ? "Đang tìm kiếm..." : "Searching..."}
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        {language === "vi" ? "Tìm hợp đồng chưa có hóa đơn" : "Find Contracts Without Invoices"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">
                                {language === "vi" 
                                    ? `Hợp đồng chưa có hóa đơn tháng ${selectedMonth}/${selectedYear}` 
                                    : `Contracts Without Invoices for ${selectedMonth}/${selectedYear}`}
                            </h3>
                            <Badge variant="secondary" className="px-3 py-1">
                                {contracts.length} {language === "vi" ? "hợp đồng" : "contracts"}
                            </Badge>
                        </div>

                        {contracts.length === 0 ? (
                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="p-6 text-center">
                                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                    <p className="text-yellow-800 font-medium">
                                        {language === "vi" 
                                            ? "Không có hợp đồng nào cần tạo hóa đơn cho kỳ này" 
                                            : "No contracts need invoices for this period"}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-4">
                                    <Checkbox 
                                        id="select-all"
                                        checked={selectedContracts.length === contracts.length}
                                        onCheckedChange={handleToggleAll}
                                    />
                                    <label htmlFor="select-all" className="text-sm font-medium">
                                        {language === "vi" ? "Chọn tất cả" : "Select All"}
                                    </label>
                                </div>

                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {contracts.map((contract) => (
                                        <Card key={contract.maHopDongPhong} className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedContracts.includes(Number(contract.maHopDongPhong))}
                                                    onCheckedChange={() => handleToggleContract(Number(contract.maHopDongPhong))}
                                                />
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                                    <div>
                                                        <p className="font-medium">
                                                            {language === "vi" ? "Hợp đồng" : "Contract"} #{contract.maHopDongPhong}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {contract.tenPhong || "Unknown Room"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            {language === "vi" ? "Khách thuê" : "Tenant"}
                                                        </p>
                                                        <p className="font-medium">
                                                            {(contract as any).tenKhachThue || "Unknown Tenant"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            {language === "vi" ? "Tiền phòng" : "Room Fee"}
                                                        </p>
                                                        <p className="font-medium text-green-600">
                                                            {(contract.tienPhong || 0).toLocaleString("vi-VN")} ₫
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Badge variant={contract.trangThai === "hoatDong" ? "default" : "secondary"}>
                                                            {contract.trangThai || "Unknown"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                        {language === "vi" ? "Quay lại" : "Back"}
                                    </Button>
                                    <Button 
                                        onClick={handleGenerateInvoices}
                                        disabled={selectedContracts.length === 0 || isGenerating}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {language === "vi" ? "Đang tạo..." : "Generating..."}
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="h-4 w-4 mr-2" />
                                                {language === "vi" 
                                                    ? `Tạo ${selectedContracts.length} hóa đơn` 
                                                    : `Generate ${selectedContracts.length} Invoices`}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {step === 3 && generationResult && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="font-semibold text-xl mb-4">
                                {language === "vi" ? "Kết quả tạo hóa đơn" : "Invoice Generation Results"}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-6 text-center">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                    <p className="text-2xl font-bold text-green-700">{generationResult.success}</p>
                                    <p className="text-green-600">
                                        {language === "vi" ? "Thành công" : "Successful"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-red-50 border-red-200">
                                <CardContent className="p-6 text-center">
                                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-2xl font-bold text-red-700">{generationResult.failed}</p>
                                    <p className="text-red-600">
                                        {language === "vi" ? "Thất bại" : "Failed"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {generationResult.errors.length > 0 && (
                            <Card className="bg-red-50 border-red-200">
                                <CardHeader>
                                    <CardTitle className="text-red-700 text-lg">
                                        {language === "vi" ? "Lỗi chi tiết" : "Error Details"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {generationResult.errors.map((error, index) => (
                                            <div key={index} className="p-2 bg-white rounded border border-red-100">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={resetDialog} className="flex-1">
                                {language === "vi" ? "Tạo mới" : "Create New"}
                            </Button>
                            <Button onClick={handleClose} className="flex-1">
                                {language === "vi" ? "Hoàn thành" : "Done"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}