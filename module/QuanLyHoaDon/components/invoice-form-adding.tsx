"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus, Search, User, Home, Calendar, FileText } from "lucide-react"
import { createInvoice } from "../api/api-quan-ly-hoa-don"
import { getAllContracts } from "@/module/QuanLyHopDongPhong/api/api-quan-ly-hop-dong"
import { fetchTenants } from "@/module/QuanLyKhachThue/api/api-tenant"
import { getDichVuApi } from "@/module/QuanLyDichVuPhong/api/api-quan-ly-dich-vu-phong"
import { getUtilityUsageByRoom } from "@/module/QuanLyDichVuPhong/api/api-utility-usage"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

const months = [
  { label_vietnam_name: "Tháng 1", label_english_name: "January", value: "01" },
  { label_vietnam_name: "Tháng 2", label_english_name: "February", value: "02" },
  { label_vietnam_name: "Tháng 3", label_english_name: "March", value: "03" },
  { label_vietnam_name: "Tháng 4", label_english_name: "April", value: "04" },
  { label_vietnam_name: "Tháng 5", label_english_name: "May", value: "05" },
  { label_vietnam_name: "Tháng 6", label_english_name: "June", value: "06" },
  { label_vietnam_name: "Tháng 7", label_english_name: "July", value: "07" },
  { label_vietnam_name: "Tháng 8", label_english_name: "August", value: "08" },
  { label_vietnam_name: "Tháng 9", label_english_name: "September", value: "09" },
  { label_vietnam_name: "Tháng 10", label_english_name: "October", value: "10" },
  { label_vietnam_name: "Tháng 11", label_english_name: "November", value: "11" },
  { label_vietnam_name: "Tháng 12", label_english_name: "December", value: "12" },
]

interface ContractInfo {
    maHopDongPhong: number;
    maPhong: string;
    tenPhong?: string;
    maKhachDaiDien: number;
    tenKhachThue: string;
    cccd: string;
    dienThoai: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    tienPhong: number;
    trangThai: string;
    // Alternative property names for flexibility
    id?: number;
    roomCode?: string;
    roomName?: string;
    maKhachThue?: number;
    tenantName?: string;
    customerName?: string;
    idCard?: string;
    cmnd?: string;
    phone?: string;
    sdt?: string;
    startDate?: string;
    endDate?: string;
    rentAmount?: number;
    gia?: number;
    status?: string;
    khachThueList?: Array<{
        maKhach?: number;
        maKhachThue?: number;
        id?: number;
        hoTen?: string;
        tenKhachThue?: string;
        fullName?: string;
        name?: string;
        tenKhach?: string;
        maCanCuoc?: string;
        cccd?: string;
        canCuoc?: string;
        idCard?: string;
        cmnd?: string;
        dienThoai?: string;
        soDienThoai?: string;
        phoneNumber?: string;
        phone?: string;
        sdt?: string;
        laKhachDaiDien?: boolean;
        trangThai?: string;
        status?: string;
    }>;
}

type LocalFormState = {
    maKhachThue: string | number | ""
    maHopDongPhong: string | number | ""
    thang: string
    nam: string
    tienPhong?: string
    tienDichVu?: string
    chiTietHoaDons?: any[]
    noiDung?: string
}

// Contract data will be fetched from API

export function InvoiceFormAsDialog({ onSuccess }: { onSuccess?: () => void }) {
    const { language } = useLanguageStore()
    const { toast, showError, showSuccess, removeToast } = useToast()
    const [open, setOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedContract, setSelectedContract] = useState<ContractInfo | null>(null)
    const [contracts, setContracts] = useState<ContractInfo[]>([])
    const [tenants, setTenants] = useState<any[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isCalculatingService, setIsCalculatingService] = useState(false)
    const [servicePricing, setServicePricing] = useState<any>(null)
    const [formData, setFormData] = useState<LocalFormState>({
        maKhachThue: "",
        maHopDongPhong: "",
        thang: "",
        nam: "",
        tienPhong: "",
        tienDichVu: "",
        chiTietHoaDons: [],
        noiDung: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Fetch contracts and tenants data when dialog opens
    useEffect(() => {
        const fetchData = async () => {
            if (!open) return;
            
            try {
                setIsLoadingData(true);
                
                // Fetch contracts data and service pricing
                console.log('=== INVOICE FORM DEBUG START ===');
                const [contractsResponse, servicePricingResponse] = await Promise.all([
                    getAllContracts(),
                    getDichVuApi().catch(error => {
                        console.warn('Service pricing API not available:', error);
                        return null;
                    })
                ]);
                console.log('Contracts API response:', contractsResponse);
                console.log('Service pricing response:', servicePricingResponse);
                
                // Set service pricing
                if (servicePricingResponse?.data) {
                    setServicePricing(servicePricingResponse.data);
                }
                
                let tenantsResponse;
                try {
                    tenantsResponse = await fetchTenants();
                    console.log('Tenants API response:', tenantsResponse);
                } catch (tenantError) {
                    console.warn('Tenant API not available, using contract data only:', tenantError);
                    tenantsResponse = { status: 'success', data: [] };
                }
                console.log('=== INVOICE FORM DEBUG END ===');

                // Handle contract response structure: { message: 'success', data: [...] }
                const isContractSuccess = contractsResponse.message === 'success' || contractsResponse.status === 'success';
                const contractData = Array.isArray(contractsResponse.data) ? contractsResponse.data : [];
                
                // Handle tenant response structure: { success: true, data: { content: [...] } }
                const isTenantSuccess = tenantsResponse?.success === true;
                const tenantData = isTenantSuccess && tenantsResponse?.data && 'content' in tenantsResponse.data && Array.isArray(tenantsResponse.data.content)
                    ? tenantsResponse.data.content 
                    : [];
                
                if (isContractSuccess && contractData.length > 0) {
                    // Debug: Log the structure of the first contract
                    console.log('Sample contract structure:', Object.keys(contractData[0]));
                        
                    if (tenantData.length > 0) {
                        console.log('Sample tenant structure:', Object.keys(tenantData[0]));
                    }
                    
                    // Filter only active contracts
                    const activeContracts = contractData.filter(
                        (contract: any) => {
                            const status = contract?.trangThai || contract?.status;
                            return status === 'hoatDong' || status === 'active';
                        }
                    );
                    
                    // Map contracts with tenant information
                    const contractsWithTenants = activeContracts.map((contract: any) => {
                        // Find the representative tenant for this contract
                        // Use tenant data from API or fallback to contract's tenant info if available
                        const contractTenants = tenantData.length > 0 
                            ? tenantData.filter((tenant: any) => {
                                // Handle different possible field names and ensure both values exist
                                const tenantId = tenant?.maKhach || tenant?.maKhachThue || tenant?.id;
                                const contractTenantId = contract?.maKhachThue || contract?.maKhachDaiDien;
                                const tenantStatus = tenant?.trangThai || tenant?.status;
                                
                                return tenantId && contractTenantId && tenantId === contractTenantId && 
                                       (tenantStatus === 'hoatDong' || tenantStatus === 'active' || !tenantStatus);
                              })
                            : [];
                        
                        const representativeTenant = contractTenants?.[0]; // Get the first matching tenant
                        
                        // Get tenant name from multiple possible fields
                        const getTenantName = (tenant: any, contract: any) => {
                            // First try tenant data, then contract data
                            return tenant?.hoTen || 
                                   tenant?.tenKhachThue || 
                                   tenant?.fullName || 
                                   tenant?.name || 
                                   tenant?.tenKhach ||
                                   contract?.tenKhachThue ||
                                   'Unknown Tenant';
                        };
                        
                        // Get ID card number from multiple possible fields  
                        const getIdCard = (tenant: any, contract: any) => {
                            return tenant?.maCanCuoc || 
                                   tenant?.cccd || 
                                   tenant?.canCuoc || 
                                   tenant?.idCard || 
                                   tenant?.cmnd ||
                                   contract?.cccd ||
                                   'N/A';
                        };
                        
                        // Get phone number from multiple possible fields
                        const getPhoneNumber = (tenant: any, contract: any) => {
                            return tenant?.dienThoai || 
                                   tenant?.soDienThoai || 
                                   tenant?.phoneNumber || 
                                   tenant?.phone || 
                                   tenant?.sdt ||
                                   contract?.dienThoai ||
                                   'N/A';
                        };
                        
                        // Create contract info with safe property access
                        return {
                            maHopDongPhong: contract?.maHopDongPhong || contract?.id || 0,
                            maPhong: contract?.maPhong || contract?.roomCode || contract?.phong || 'Unknown Room',
                            tenPhong: contract?.tenPhong || contract?.roomName || `Phòng ${contract?.maPhong || contract?.roomCode || 'Unknown'}`,
                            maKhachDaiDien: contract?.maKhachThue || contract?.maKhachDaiDien || representativeTenant?.maKhach || 0,
                            tenKhachThue: getTenantName(representativeTenant, contract),
                            cccd: getIdCard(representativeTenant, contract),
                            dienThoai: getPhoneNumber(representativeTenant, contract),
                            ngayBatDau: contract?.ngayBatDau || contract?.startDate || '',
                            ngayKetThuc: contract?.ngayKetThuc || contract?.endDate || '',
                            tienPhong: contract?.tienPhong || contract?.rentAmount || contract?.gia || 0,
                            trangThai: contract?.trangThai || contract?.status || 'hoatDong',
                            khachThueList: contractTenants || []
                        };
                    });
                    
                    setContracts(contractsWithTenants);
                } else {
                    console.warn('Failed to fetch contracts or no contracts available:', contractsResponse);
                    setContracts([]);
                }
                
                // Set tenants from normalized data  
                setTenants(tenantData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showError(language === 'vi' ? 'Có lỗi khi tải dữ liệu' : 'Error loading data');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [open, language, showError]);

    // Auto-calculate service cost when month/year changes and contract is selected
    useEffect(() => {
        if (selectedContract && formData.thang && formData.nam && servicePricing) {
            calculateAndSetServiceCost(selectedContract.maPhong, formData.thang, formData.nam);
        }
    }, [formData.thang, formData.nam, selectedContract, servicePricing]);

    // Filter contracts based on search query
    const filteredContracts = useMemo(() => {
        if (!searchQuery.trim()) {
            return contracts;
        }
        
        const query = searchQuery.toLowerCase();
        return contracts.filter(contract => {
            if (!contract) return false;
            
            // Get values with multiple fallback options
            const tenKhachThue = (contract.tenKhachThue || contract.tenantName || contract.customerName || '').toLowerCase();
            const maPhong = (contract.maPhong || contract.roomCode || '').toLowerCase();
            const tenPhong = (contract.tenPhong || contract.roomName || '').toLowerCase();
            const cccd = contract.cccd || contract.idCard || contract.cmnd || '';
            const dienThoai = contract.dienThoai || contract.phone || contract.sdt || '';
            
            return tenKhachThue.includes(query) ||
                   maPhong.includes(query) ||
                   tenPhong.includes(query) ||
                   cccd.includes(query) ||
                   dienThoai.includes(query);
        });
    }, [searchQuery, contracts]);

    // Handle contract selection
    const handleContractSelect = (contract: ContractInfo) => {
        if (!contract) {
            console.warn('No contract provided to handleContractSelect');
            return;
        }
        
        // Validate required properties
        const contractId = contract.maHopDongPhong || contract.id;
        const tenantId = contract.maKhachDaiDien || contract.maKhachThue;
        const rentAmount = contract.tienPhong || contract.rentAmount || contract.gia;
        
        if (!contractId) {
            console.warn('Contract missing ID:', contract);
            showError(language === 'vi' ? 'Hợp đồng thiếu mã ID' : 'Contract missing ID');
            return;
        }
        
        setSelectedContract(contract);
        setFormData(prev => ({
            ...prev,
            maHopDongPhong: contractId,
            maKhachThue: tenantId || '',
            tienPhong: (rentAmount || 0).toString()
        }));
        
        // Auto-calculate service cost if month and year are selected
        if (formData.thang && formData.nam) {
            calculateAndSetServiceCost(contract.maPhong, formData.thang, formData.nam);
        }
    }
    
    // Helper function to calculate and set service cost
    const calculateAndSetServiceCost = async (maPhong: string | number, month: string, year: string) => {
        const roomId = typeof maPhong === 'string' ? parseInt(maPhong) : maPhong;
        if (!roomId || !month || !year) return;
        
        const serviceCost = await calculateServiceCost(roomId, month, year);
        setFormData(prev => ({
            ...prev,
            tienDichVu: serviceCost.toString()
        }));
    };

    // Calculate service cost automatically based on utility usage and service pricing
    const calculateServiceCost = async (maPhong: number, month: string, year: string) => {
        if (!servicePricing || !maPhong || !month || !year) {
            console.log('Missing data for service calculation:', { servicePricing, maPhong, month, year });
            return 0;
        }

        try {
            setIsCalculatingService(true);
            console.log('Calculating service cost for room:', maPhong, 'month:', month, 'year:', year);
            
            // Get utility usage for the room
            const utilityResponse = await getUtilityUsageByRoom(maPhong);
            console.log('Utility usage response:', utilityResponse);
            
            if (!utilityResponse?.data || !Array.isArray(utilityResponse.data)) {
                console.log('No utility usage data found');
                return 0;
            }

            // Find utility usage for the specific month/year
            const targetDate = `${year}-${month.padStart(2, '0')}`;
            console.log('Looking for utility data for date:', targetDate);
            
            const monthlyUsage = utilityResponse.data.find((usage: any) => {
                const usageDate = new Date(usage.thangNam).toISOString().slice(0, 7);
                return usageDate === targetDate;
            });

            console.log('Found monthly usage:', monthlyUsage);

            if (!monthlyUsage) {
                console.log('No utility usage found for the specified month');
                showError(language === 'vi' 
                    ? 'Chưa có dữ liệu chỉ số điện nước cho tháng này. Vui lòng nhập chỉ số trước khi tạo hóa đơn.'
                    : 'No utility readings found for this month. Please enter utility readings first.');
                return 0;
            }

            // Calculate consumption
            const electricityUsage = Math.max(0, (monthlyUsage.chiSoDienMoi || 0) - (monthlyUsage.chiSoDienCu || 0));
            const waterUsage = Math.max(0, (monthlyUsage.chiSoNuocMoi || 0) - (monthlyUsage.chiSoNuocCu || 0));

            console.log('Usage calculated:', { electricityUsage, waterUsage });
            console.log('Service pricing:', servicePricing);

            // Calculate costs based on usage and pricing
            let totalServiceCost = 0;
            
            // Electricity cost
            if (electricityUsage > 0 && servicePricing.donGiaDien) {
                totalServiceCost += electricityUsage * servicePricing.donGiaDien;
            }
            
            // Water cost
            if (waterUsage > 0 && servicePricing.donGiaNuoc) {
                totalServiceCost += waterUsage * servicePricing.donGiaNuoc;
            }
            
            // Fixed services (garbage, wifi, cable) - typically charged monthly
            if (servicePricing.donGiaRac) {
                totalServiceCost += servicePricing.donGiaRac;
            }
            
            if (servicePricing.donGiaWifi) {
                totalServiceCost += servicePricing.donGiaWifi;
            }
            
            if (servicePricing.donGiaCap) {
                totalServiceCost += servicePricing.donGiaCap;
            }
            
            if (servicePricing.donGiaKhac) {
                totalServiceCost += servicePricing.donGiaKhac;
            }

            console.log('Total service cost calculated:', totalServiceCost);
            
            return Math.round(totalServiceCost);
        } catch (error) {
            console.error('Error calculating service cost:', error);
            showError(language === 'vi' 
                ? 'Có lỗi khi tính toán chi phí dịch vụ'
                : 'Error calculating service cost');
            return 0;
        } finally {
            setIsCalculatingService(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.maHopDongPhong) newErrors.maHopDongPhong = language === "vi" ? "Vui lòng chọn hợp đồng" : "Please select contract"
        if (!formData.maKhachThue) newErrors.maKhachThue = language === "vi" ? "Vui lòng chọn khách thuê" : "Please select tenant"
        if (!formData.thang) newErrors.thang = language === "vi" ? "Vui lòng chọn tháng" : "Please select month"
        if (!formData.nam) newErrors.nam = language === "vi" ? "Vui lòng nhập năm" : "Please enter year"
        if (!formData.tienPhong) newErrors.tienPhong = language === "vi" ? "Vui lòng nhập tiền phòng" : "Please enter rent"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            showError(language === "vi" ? "Vui lòng điền đầy đủ thông tin" : "Please fill in all required fields")
            return
        }
        setIsCreating(true)
        try {
        const payload = {
            maKhachThue: Number(formData.maKhachThue),
            maHopDongPhong: Number(formData.maHopDongPhong),
            thang: Number(formData.thang),
            nam: Number(formData.nam),
            tienPhong: Number(formData.tienPhong),
            tienDichVu: Number(formData.tienDichVu || 0),
            chiTietHoaDons: formData.chiTietHoaDons || [],
            noiDung: formData.noiDung || "",
            tongTien: Number(formData.tienPhong) + Number(formData.tienDichVu || 0),
            tienConNo: Number(formData.tienPhong) + Number(formData.tienDichVu || 0),
            ngayTao: new Date().toISOString(),
            capNhatLanCuoi: new Date().toISOString(),
            trangThai: "Pending",
        }
        const result = await createInvoice(payload)
        if (result.status === "success") {
            showSuccess(language === "vi" ? "Thêm hóa đơn thành công" : "Invoice created successfully")
            setFormData({
                maKhachThue: "",
                maHopDongPhong: "",
                thang: "",
                nam: "",
                tienPhong: "",
                tienDichVu: "",
                chiTietHoaDons: [],
                noiDung: "",
            })
            setErrors({})
            setOpen(false)
            onSuccess?.()
        } else {
            showError(result.message || (language === "vi" ? "Thêm hóa đơn thất bại" : "Failed to create invoice"))
        }
        } catch (err) {
            // Enhanced error handling with specific guidance
            const errorMessage = err instanceof Error ? err.message : String(err);
            
            if (errorMessage.includes('chỉ số điện nước') || errorMessage.includes('electricity') || errorMessage.includes('water meter')) {
                showError(language === "vi" 
                    ? "Chưa có dữ liệu chỉ số điện nước cho tháng này. Vui lòng nhập chỉ số điện nước trước khi tạo hóa đơn." 
                    : "No utility meter readings found for this month. Please enter electricity and water readings first.");
            } else if (errorMessage.includes('hợp đồng') || errorMessage.includes('contract')) {
                showError(language === "vi" 
                    ? "Hợp đồng không hợp lệ hoặc đã hết hạn." 
                    : "Invalid or expired contract.");
            } else if (errorMessage.includes('already exists') || errorMessage.includes('đã tồn tại')) {
                showError(language === "vi" 
                    ? "Hóa đơn cho tháng này đã được tạo rồi." 
                    : "Invoice for this month has already been created.");
            } else {
                showError(language === "vi" ? "Có lỗi xảy ra khi tạo hóa đơn: " + errorMessage : "Error creating invoice: " + errorMessage);
            }
        } finally {
        setIsCreating(false)
        }
    }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Thêm hóa đơn" : "Add Invoice"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[900px] lg:min-w-[1400px] max-h-[100vh] bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 tracking-tight">
                        <div className="relative h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Plus className="h-6 w-6 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                        </div>
                        {language === "vi" ? "Tạo hóa đơn mới" : "Create New Invoice"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-base leading-relaxed ml-13">
                        {language === "vi" 
                            ? "Chọn hợp đồng đang hoạt động để tạo hóa đơn cho khách thuê." 
                            : "Select an active contract to create an invoice for the tenant."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row gap-8 overflow-y-auto max-h-[70vh]">
                    {/* Contract Selection Panel */}
                    <div className="lg:w-2/3 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                {language === "vi" ? "Tìm kiếm hợp đồng" : "Search Contracts"}
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                                <Input
                                    placeholder={language === "vi" ? "Tìm theo tên, phòng, CCCD..." : "Search by name, room, ID..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="border-0 rounded-2xl overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-700 py-4">{language === "vi" ? "Phòng" : "Room"}</TableHead>
                                        <TableHead className="font-bold text-gray-700 py-4">{language === "vi" ? "Khách thuê" : "Tenant"}</TableHead>
                                        <TableHead className="font-bold text-gray-700 py-4">{language === "vi" ? "Liên hệ" : "Contact"}</TableHead>
                                        <TableHead className="font-bold text-gray-700 py-4">{language === "vi" ? "Tiền phòng" : "Rent"}</TableHead>
                                        <TableHead className="font-bold text-gray-700 py-4">{language === "vi" ? "Ngày bắt đầu" : "Start Date"}</TableHead>
                                        <TableHead className="font-bold text-gray-700 py-4">{language === "vi" ? "Trạng thái" : "Status"}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingData ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                                    {language === "vi" ? "Đang tải dữ liệu..." : "Loading data..."}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredContracts.length > 0 ? (
                                        filteredContracts.map((contract) => (
                                            <TableRow 
                                                key={contract.maHopDongPhong}
                                                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 hover:shadow-md border-b border-gray-100 ${
                                                    selectedContract?.maHopDongPhong === contract.maHopDongPhong 
                                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-md" 
                                                        : ""
                                                }`}
                                                onClick={() => handleContractSelect(contract)}
                                            >
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                            <Home className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{contract.maPhong || 'Unknown'}</div>
                                                            <div className="text-sm text-gray-600">{contract.tenPhong || `Phòng ${contract.maPhong || 'Unknown'}`}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                                            <User className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{contract.tenKhachThue || 'Unknown Tenant'}</div>
                                                            <div className="text-sm text-gray-600">CCCD: {contract.cccd || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="text-sm font-medium text-gray-700">{contract.dienThoai || 'N/A'}</div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="font-bold text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 rounded-lg">
                                                        {(contract.tienPhong || 0).toLocaleString("vi-VN")} ₫
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {contract.ngayBatDau ? new Date(contract.ngayBatDau).toLocaleDateString("vi-VN") : 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-green-200">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-2 h-2 rounded-full bg-white/80"></div>
                                                            {language === "vi" ? "Đang hoạt động" : "Active"}
                                                        </div>
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                {language === "vi" ? "Không tìm thấy hợp đồng nào" : "No contracts found"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Invoice Form Panel */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="border-0 rounded-2xl p-6 bg-gradient-to-br from-white to-slate-50 shadow-xl backdrop-blur-sm">
                            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                {language === "vi" ? "Thông tin hóa đơn" : "Invoice Details"}
                            </h3>
                            
                            {isLoadingData ? (
                                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border border-gray-200">
                                    <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {language === "vi" ? "Đang tải dữ liệu..." : "Loading data..."}
                                    </div>
                                </div>
                            ) : selectedContract ? (
                                <div className="space-y-4 mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-md">
                                    <div className="text-sm flex items-center justify-between">
                                        <span className="font-semibold text-gray-700">{language === "vi" ? "Hợp đồng:" : "Contract:"}</span>
                                        <span className="font-bold text-blue-600">#{selectedContract.maHopDongPhong || 'N/A'}</span>
                                    </div>
                                    <div className="text-sm flex items-center justify-between">
                                        <span className="font-semibold text-gray-700">{language === "vi" ? "Khách thuê:" : "Tenant:"}</span>
                                        <span className="font-medium text-gray-900">{selectedContract.tenKhachThue || 'Unknown'}</span>
                                    </div>
                                    <div className="text-sm flex items-center justify-between">
                                        <span className="font-semibold text-gray-700">{language === "vi" ? "Phòng:" : "Room:"}</span>
                                        <span className="font-medium text-gray-900">{selectedContract.maPhong || 'Unknown'}</span>
                                    </div>
                                    <div className="text-sm flex items-center justify-between pt-2 border-t border-blue-200">
                                        <span className="font-semibold text-gray-700">{language === "vi" ? "Tiền phòng:" : "Rent:"}</span> 
                                        <span className="font-bold text-emerald-700 bg-gradient-to-r from-emerald-100 to-green-100 px-3 py-1 rounded-lg">{(selectedContract.tienPhong || 0).toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border border-gray-200">
                                    <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FileText className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {language === "vi" ? "Vui lòng chọn một hợp đồng" : "Please select a contract"}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-gray-700">{language === "vi" ? "Tháng" : "Month"} <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.thang}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, thang: value }))}
                                        >
                                            <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                                                <SelectValue placeholder={language === "vi" ? "Chọn tháng" : "Select month"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>
                                                        {language === "vi" ? month.label_vietnam_name : month.label_english_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.thang && <p className="text-xs text-red-500 font-medium">{errors.thang}</p>}
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-gray-700">{language === "vi" ? "Năm" : "Year"} <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="number"
                                            value={formData.nam}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nam: e.target.value }))}
                                            placeholder="2025"
                                            className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                        />
                                        {errors.nam && <p className="text-xs text-red-500 font-medium">{errors.nam}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                        {language === "vi" ? "Tiền dịch vụ" : "Service Fee"} (VND)
                                        {isCalculatingService && (
                                            <span className="text-xs text-blue-600 font-medium">
                                                {language === "vi" ? "(Đang tính toán...)" : "(Calculating...)"}
                                            </span>
                                        )}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={formData.tienDichVu}
                                            onChange={(e) => setFormData(prev => ({ ...prev, tienDichVu: e.target.value }))}
                                            placeholder="0"
                                            disabled={isCalculatingService}
                                            className="border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                        />
                                        {isCalculatingService && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                    {servicePricing && formData.tienDichVu && (
                                        <p className="text-xs text-green-600 font-medium">
                                            {language === "vi" 
                                                ? "💡 Tự động tính dựa trên chỉ số điện nước và giá dịch vụ" 
                                                : "💡 Auto-calculated based on utility usage and service pricing"
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700">{language === "vi" ? "Ghi chú" : "Notes"}</Label>
                                    <Input
                                        type="text"
                                        value={formData.noiDung}
                                        onChange={(e) => setFormData(prev => ({ ...prev, noiDung: e.target.value }))}
                                        placeholder={language === "vi" ? "Ghi chú thêm..." : "Additional notes..."}
                                        className="border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <DialogClose asChild>
                                        <Button 
                                            variant="outline" 
                                            size="default" 
                                            disabled={isCreating} 
                                            className="flex-1 border-2 border-gray-300 hover:border-gray-400 rounded-xl py-3 font-semibold transition-all duration-200 hover:shadow-md"
                                        >
                                            {language === "vi" ? "Hủy" : "Cancel"}
                                        </Button>
                                    </DialogClose>
                                    <Button 
                                        type="submit" 
                                        size="default" 
                                        disabled={isCreating || !selectedContract}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isCreating ? (language === "vi" ? "Đang tạo..." : "Creating...") : (language === "vi" ? "Tạo hóa đơn" : "Create Invoice")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </DialogContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Dialog>
    )
}