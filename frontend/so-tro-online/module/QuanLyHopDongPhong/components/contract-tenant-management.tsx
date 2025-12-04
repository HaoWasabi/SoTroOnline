"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hook/useToast"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Toast } from "@/components/toast"
import { Trash2, Crown, Search, UserPlus, Users } from "lucide-react"

import { 
    getContractTenants, 
    removeTenantFromContract,
    addTenantToContract,
    getAvailableTenants
} from "../api/api-quan-ly-hop-dong"
import { getAuthHeaders } from "@/utils/auth-api"

import { Contract } from "../types/contract"

interface ContractTenantManagementProps {
    contract: Contract;
    onUpdate?: () => void;
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function ContractTenantManagement({ 
    contract, 
    onUpdate, 
    children, 
    open, 
    onOpenChange 
}: ContractTenantManagementProps) {
    const { language } = useLanguageStore()
    const { toast, showSuccess, showError, removeToast } = useToast()
    
    const [internalOpen, setInternalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    // Use external open state if provided, otherwise use internal state
    const isOpen = open !== undefined ? open : internalOpen
    const setIsOpen = onOpenChange || setInternalOpen
    
    // Current contract tenants
    const [contractTenants, setContractTenants] = useState<any[]>([])
    const [mainTenantId, setMainTenantId] = useState<number | null>(null)
    
    // Available tenants for adding
    const [availableTenants, setAvailableTenants] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [availableLoading, setAvailableLoading] = useState(false)
    
    // Maximum tenant configuration
    const [maximumTenants, setMaximumTenants] = useState<number>(5) // Default 5 tenants
    
    const [isRemoving, setIsRemoving] = useState<number | null>(null)
    const [isAdding, setIsAdding] = useState<number | null>(null)

    useEffect(() => {
        if (isOpen) {
            loadContractTenants()
            loadAvailableTenants()
        }
    }, [isOpen, contract.maHopDongPhong])

    const loadContractTenants = async () => {
        if (!contract.maHopDongPhong) return []
        
        try {
            setIsLoading(true)
            const response = await getContractTenants(Number(contract.maHopDongPhong))
            
            let responseData: any[] = []
            if (response.message === "success" && response.data) {
                responseData = response.data
            } else if (response.status === "success" && response.data) {
                responseData = response.data
            } else if (Array.isArray(response)) {
                responseData = response
            }
            
            setContractTenants(responseData)
            
            // Auto-adjust maximum tenants if current count exceeds the limit
            if (responseData.length > maximumTenants) {
                const newMaxTenants = Math.min(10, Math.max(responseData.length, 5))
                setMaximumTenants(newMaxTenants)
                console.log(`Auto-adjusted maximum tenants from ${maximumTenants} to ${newMaxTenants} due to ${responseData.length} existing tenants`)
            }
            
            // Set main tenant from contract
            if (responseData.length > 0) {
                const mainTenant = responseData.find((t: any) => 
                    (t.maKhachThue || t.maKhach || t.ma_khach || t.id) === Number(contract.maKhachDaiDien)
                ) || responseData[0]
                
                if (mainTenant) {
                    const mainId = mainTenant.maKhachThue || mainTenant.maKhach || mainTenant.ma_khach || mainTenant.id
                    setMainTenantId(mainId)
                }
            } else {
                setMainTenantId(null)
            }
            
            return responseData // Return the updated tenant list
        } catch (error) {
            console.error("Error loading contract tenants:", error)
            showError(language === "vi" ? "Lỗi khi tải danh sách khách thuê" : "Error loading tenants")
            return []
        } finally {
            setIsLoading(false)
        }
    }

    const loadAvailableTenants = async (currentTenants?: any[]) => {
        try {
            setAvailableLoading(true)
            const response = await getAvailableTenants()
            
            console.log("Raw getAvailableTenants response:", response)
            
            let responseData: any[] = []
            if (response.message === "success" && response.data) {
                responseData = response.data
            } else if (response.status === "success" && response.data) {
                responseData = response.data
            } else if (Array.isArray(response)) {
                responseData = response
            }
            
            console.log("Parsed responseData:", responseData)
            
            // Use provided currentTenants or fall back to state
            const tenantsToFilter = currentTenants || contractTenants
            
            // Filter out tenants that are already in the current contract
            const currentTenantIds = tenantsToFilter.map(t => 
                t.maKhachThue || t.maKhach || t.ma_khach || t.id
            )
            
            console.log("Current tenant IDs to filter:", currentTenantIds)
            
            const filteredAvailable = responseData.filter(tenant => {
                const tenantId = tenant.maKhachThue || tenant.maKhach || tenant.ma_khach || tenant.id
                return !currentTenantIds.includes(tenantId)
            })
            
            console.log("Filtered available tenants:", filteredAvailable)
            
            setAvailableTenants(filteredAvailable)
        } catch (error) {
            console.error("Error loading available tenants:", error)
            showError(language === "vi" ? "Lỗi khi tải danh sách khách thuê có sẵn" : "Error loading available tenants")
        } finally {
            setAvailableLoading(false)
        }
    }

    const handleRemoveTenant = async (tenantId: number) => {
        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể xóa: Thiếu ID hợp đồng" : "Cannot remove: Missing contract ID")
            return
        }

        // Check if this is the main tenant
        const isMainTenant = tenantId === mainTenantId
        const tenantName = contractTenants.find(t => 
            (t.maKhachThue || t.maKhach || t.ma_khach || t.id) === tenantId
        )?.hoTen || "Unknown"

        // Show confirmation dialog especially for main tenant
        let confirmMessage = language === "vi" 
            ? `Bạn có chắc chắn muốn xóa ${tenantName} khỏi hợp đồng này không?`
            : `Are you sure you want to remove ${tenantName} from this contract?`

        if (isMainTenant) {
            confirmMessage += language === "vi"
                ? "\n\nLưu ý: Đây là khách đại diện. Hệ thống sẽ tự động chỉ định khách đại diện mới từ các thành viên còn lại."
                : "\n\nNote: This is the main tenant. The system will automatically assign a new main tenant from remaining members."
        }

        // If we're over the limit, show additional warning about bringing count back within limits
        const currentTenantCount = contractTenants.length
        if (currentTenantCount > maximumTenants) {
            confirmMessage += language === "vi"
                ? `\n\nLưu ý: Hiện tại có ${currentTenantCount}/${maximumTenants} khách thuê (vượt giới hạn). Việc xóa sẽ giúp đưa số lượng về mức hợp lý.`
                : `\n\nNote: Currently ${currentTenantCount}/${maximumTenants} tenants (over limit). Removing will help bring the count within limits.`
        }

        if (!confirm(confirmMessage)) {
            return
        }

        try {
            setIsRemoving(tenantId)
            console.log(`Removing tenant ${tenantId} from contract ${contract.maHopDongPhong}`)
            
            const response = await removeTenantFromContract(Number(contract.maHopDongPhong), tenantId)
            
            if (response.status === "success") {
                let successMessage = language === "vi" ? "Xóa khách thuê thành công" : "Tenant removed successfully"
                
                if (isMainTenant) {
                    successMessage += language === "vi" 
                        ? ". Đã chỉ định khách đại diện mới tự động."
                        : ". New main tenant assigned automatically."
                }
                
                showSuccess(successMessage)
                // Reload the tenant list and get the updated data
                const updatedTenants = await loadContractTenants()
                // Use the updated tenant list to filter available tenants  
                await loadAvailableTenants(updatedTenants)
                onUpdate?.() // Notify parent component
            } else {
                showError(response.message || (language === "vi" ? "Xóa thất bại" : "Remove failed"))
            }
        } catch (error) {
            console.error("Error removing tenant:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            
            // Provide specific error messages for common cases
            if (errorMessage.includes("only tenant")) {
                showError(language === "vi" 
                    ? "Không thể xóa khách thuê duy nhất. Vui lòng xóa hợp đồng thay vì xóa khách thuê."
                    : "Cannot remove the only tenant. Please delete the contract instead.")
            } else if (errorMessage.includes("main tenant")) {
                showError(language === "vi" 
                    ? "Không thể xóa khách đại diện khi không có thành viên khác."
                    : "Cannot remove main tenant when no other members exist.")
            } else {
                showError(language === "vi" 
                    ? `Có lỗi xảy ra khi xóa khách thuê: ${errorMessage}`
                    : `An error occurred while removing tenant: ${errorMessage}`)
            }
        } finally {
            setIsRemoving(null)
        }
    }

    const handleAddTenant = async (tenantId: number) => {
        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể thêm: Thiếu ID hợp đồng" : "Cannot add: Missing contract ID")
            return
        }

        // Check if adding this tenant would exceed maximum limit
        const currentTenantCount = contractTenants.length
        if (currentTenantCount >= maximumTenants) {
            showError(language === "vi" 
                ? `Không thể thêm: Đã đạt giới hạn tối đa (${maximumTenants} khách thuê). Vui lòng tăng giới hạn hoặc xóa khách thuê khác.`
                : `Cannot add: Maximum tenant limit reached (${maximumTenants} tenants). Please increase limit or remove other tenants.`)
            return
        }

        const tenantName = availableTenants.find(t => 
            (t.maKhachThue || t.maKhach || t.ma_khach || t.id) === tenantId
        )?.hoTen || "Unknown"

        try {
            setIsAdding(tenantId)
            console.log(`Checking if tenant ${tenantId} has active contracts...`)
            
            // First, check if tenant has any active contracts
            const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/hop-dong-phong/tenants/${tenantId}/active-contracts`, {
                headers: getAuthHeaders()
            })
            
            if (!checkResponse.ok) {
                throw new Error(`HTTP error! status: ${checkResponse.status}`)
            }
            
            const checkData = await checkResponse.json()
            console.log("Tenant contract check response:", checkData)
            
            // Check if tenant has active contracts
            if (checkData.status === "success" && checkData.data) {
                const hasActiveContract = checkData.data.hasActiveContract
                const activeContractCount = checkData.data.activeContractCount || 0
                
                if (hasActiveContract && activeContractCount > 0) {
                    showError(language === "vi" 
                        ? `Khách thuê ${tenantName} đã có hợp đồng đang hoạt động. Không thể thêm vào hợp đồng khác.`
                        : `Tenant ${tenantName} already has an active contract. Cannot add to another contract.`)
                    setIsAdding(null)
                    return
                }
            }

            // If no active contracts, proceed with confirmation and addition
            const confirmMessage = language === "vi" 
                ? `Bạn có chắc chắn muốn thêm ${tenantName} vào hợp đồng này không?`
                : `Are you sure you want to add ${tenantName} to this contract?`

            if (!confirm(confirmMessage)) {
                setIsAdding(null)
                return
            }

            console.log(`Adding tenant ${tenantId} to contract ${contract.maHopDongPhong}`)
            
            // Pass the maximum tenants configuration to the backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/hop-dong-phong/${contract.maHopDongPhong}/tenants/${tenantId}?maxTenants=${maximumTenants}`, {
                method: 'POST',
                headers: getAuthHeaders()
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const result = await response.json()
            
            // Handle both ApiResponseV2 format and legacy format
            // ApiResponseV2 uses: { message: "success", data: ... }
            // Legacy format uses: { status: "success", data: ... }
            const isSuccess = result.message === "success" || result.status === "success"
            
            if (isSuccess) {
                showSuccess(language === "vi" ? "Thêm khách thuê thành công" : "Tenant added successfully")
                
                // Reload the tenant list and get the updated data
                const updatedTenants = await loadContractTenants()
                
                // Use the updated tenant list to filter available tenants
                await loadAvailableTenants(updatedTenants)
                
                onUpdate?.() // Notify parent component
            } else {
                const errorMessage = result.message || result.data || (language === "vi" ? "Thêm thất bại" : "Add failed")
                showError(errorMessage)
            }
        } catch (error) {
            console.error("Error adding tenant:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            
            // Handle specific validation errors from backend
            if (errorMessage.includes("already has an active contract") || errorMessage.includes("đã có hợp đồng")) {
                showError(language === "vi" 
                    ? `Khách thuê ${tenantName} đã có hợp đồng đang hoạt động. Không thể thêm vào hợp đồng khác.`
                    : `Tenant ${tenantName} already has an active contract. Cannot add to another contract.`)
            } else if (errorMessage.includes("already in this contract") || errorMessage.includes("already in contract")) {
                showError(language === "vi" 
                    ? `Khách thuê ${tenantName} đã có trong hợp đồng này.`
                    : `Tenant ${tenantName} is already in this contract.`)
            } else if (errorMessage.includes("maximum tenant limit") || errorMessage.includes("reached maximum")) {
                showError(language === "vi" 
                    ? `Hợp đồng đã đạt giới hạn tối đa (${maximumTenants} khách thuê). Không thể thêm thêm.`
                    : `Contract has reached maximum tenant limit (${maximumTenants} tenants). Cannot add more.`)
            } else if (errorMessage.includes("not active") || errorMessage.includes("inactive")) {
                showError(language === "vi" 
                    ? `Không thể thêm khách thuê: ${errorMessage}`
                    : `Cannot add tenant: ${errorMessage}`)
            } else if (errorMessage.includes("does not exist")) {
                showError(language === "vi" 
                    ? `Khách thuê hoặc hợp đồng không tồn tại: ${errorMessage}`
                    : `Tenant or contract does not exist: ${errorMessage}`)
            } else if (errorMessage.includes("database migration") || errorMessage.includes("Multi-tenant support")) {
                showError(language === "vi" 
                    ? "Hệ thống cần được cập nhật để hỗ trợ nhiều khách thuê. Vui lòng liên hệ quản trị viên."
                    : "System needs to be updated for multi-tenant support. Please contact administrator.")
            } else {
                showError(language === "vi" 
                    ? `Có lỗi xảy ra khi thêm khách thuê: ${errorMessage}`
                    : `An error occurred while adding tenant: ${errorMessage}`)
            }
        } finally {
            setIsAdding(null)
        }
    }

    // Filter available tenants based on search term
    const filteredAvailableTenants = availableTenants.filter(tenant => {
        if (searchTerm === "") return true
        
        const tenantName = tenant.hoTen || tenant.ho_ten || tenant.tenKhach || tenant.name || ""
        const tenantPhone = tenant.soDienThoai || tenant.so_dien_thoai || tenant.dien_thoai || tenant.phone || ""
        const tenantEmail = tenant.email || ""
        const tenantId = (tenant.maKhachThue || tenant.maKhach || tenant.ma_khach || tenant.id || "").toString()
        
        return [tenantName, tenantPhone, tenantEmail, tenantId]
            .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    })

    // Debug logging
    console.log("Available tenants state:", availableTenants)
    console.log("Search term:", searchTerm)
    console.log("Filtered available tenants:", filteredAvailableTenants)
    console.log("Available loading:", availableLoading)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:min-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        {language === "vi" ? "Quản lý khách thuê" : "Tenant Management"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-base mt-2">
                        {language === "vi" 
                            ? `Quản lý khách thuê của hợp đồng ${contract.maHopDongPhong}`
                            : `Manage tenants for contract ${contract.maHopDongPhong}`
                        }
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-auto space-y-6">
                    {/* Maximum Tenant Configuration */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">⚙️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-700">
                                {language === "vi" ? "Cấu hình giới hạn" : "Tenant Limit Configuration"}
                            </h3>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-4 flex-wrap">
                                <Label htmlFor="maximumTenants" className="text-sm font-medium text-blue-700">
                                    {language === "vi" ? "Số lượng khách thuê tối đa:" : "Maximum tenants:"}
                                </Label>
                                <Input
                                    id="maximumTenants"
                                    type="number"
                                    min="5"
                                    max="10"
                                    value={maximumTenants}
                                    onChange={(e) => setMaximumTenants(Math.max(5, Math.min(10, parseInt(e.target.value) || 5)))}
                                    className="w-20 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                                    {language === "vi" 
                                        ? `Hiện tại: ${contractTenants.length}/${maximumTenants}`
                                        : `Current: ${contractTenants.length}/${maximumTenants}`
                                    }
                                </span>
                                {contractTenants.length > maximumTenants && (
                                    <div className="flex items-center gap-2 text-red-500">
                                        <span className="text-sm font-medium">
                                            {language === "vi" ? "Vượt giới hạn!" : "Over limit!"}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setMaximumTenants(contractTenants.length)}
                                            className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                            {language === "vi" ? "Điều chỉnh" : "Adjust"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {contractTenants.length > maximumTenants && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">
                                        {language === "vi" 
                                            ? `Hợp đồng hiện có ${contractTenants.length} khách thuê, vượt quá giới hạn ${maximumTenants}. Bạn có thể điều chỉnh giới hạn hoặc xóa bớt khách thuê.`
                                            : `Contract currently has ${contractTenants.length} tenants, exceeding the limit of ${maximumTenants}. You can adjust the limit or remove some tenants.`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Current Contract Tenants */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">👥</span>
                            </div>
                            <h3 className="text-lg font-semibold text-emerald-700">
                                {language === "vi" ? "Khách thuê hiện tại" : "Current Tenants"}
                            </h3>
                        </div>
                        <div className="bg-white rounded-lg border border-emerald-100 overflow-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin h-8 w-8 border-2 border-emerald-300 border-t-emerald-600 rounded-full"></div>
                                    <span className="ml-2 text-emerald-600">
                                        {language === "vi" ? "Đang tải..." : "Loading..."}
                                    </span>
                                </div>
                            ) : contractTenants.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">😕</span>
                                    <p>{language === "vi" ? "Không có khách thuê nào" : "No tenants found"}</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{language === "vi" ? "Tên khách thuê" : "Tenant Name"}</TableHead>
                                            <TableHead>{language === "vi" ? "Số điện thoại" : "Phone"}</TableHead>
                                            <TableHead>{language === "vi" ? "Email" : "Email"}</TableHead>
                                            <TableHead>{language === "vi" ? "Vai trò" : "Role"}</TableHead>
                                            <TableHead className="text-center">{language === "vi" ? "Thao tác" : "Actions"}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contractTenants.map((tenant, index) => {
                                            const tenantId = tenant.maKhachThue || tenant.maKhach || tenant.ma_khach || tenant.id
                                            const isMainTenant = tenantId === mainTenantId
                                            const tenantName = tenant.hoTen || tenant.ho_ten || tenant.tenKhach || tenant.name || `Tenant ${tenantId}`
                                            const tenantPhone = tenant.soDienThoai || tenant.so_dien_thoai || tenant.dien_thoai || tenant.phone || "-"
                                            const tenantEmail = tenant.email || "-"
                                            
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {tenantName}
                                                            {isMainTenant && (
                                                                <div title={language === "vi" ? "Khách đại diện" : "Main tenant"}>
                                                                    <Crown className="h-4 w-4 text-yellow-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{tenantPhone}</TableCell>
                                                    <TableCell>{tenantEmail}</TableCell>
                                                    <TableCell>
                                                        {isMainTenant ? (
                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                {language === "vi" ? "Đại diện" : "Main"}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                {language === "vi" ? "Thành viên" : "Member"}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRemoveTenant(tenantId)}
                                                            disabled={isRemoving === tenantId}
                                                            className="h-8"
                                                        >
                                                            {isRemoving === tenantId ? (
                                                                <div className="flex items-center gap-1">
                                                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                                                                    {language === "vi" ? "Xóa" : "Remove"}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    <Trash2 className="h-3 w-3" />
                                                                    {language === "vi" ? "Xóa" : "Remove"}
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>

                    {/* Available Tenants */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">➕</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-purple-700">
                                    {language === "vi" ? "Thêm khách thuê" : "Add Tenants"}
                                </h3>
                                <p className="text-sm text-purple-600">
                                    {language === "vi" 
                                        ? "Danh sách khách thuê có sẵn để thêm vào hợp đồng"
                                        : "Available tenants to add to the contract"
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-purple-100 p-4 space-y-4">
                            {/* Search Field */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                                <Input
                                    placeholder={language === "vi" ? "Tìm kiếm theo tên, SĐT, email..." : "Search by name, phone, email..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            {availableLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin h-8 w-8 border-2 border-purple-300 border-t-purple-600 rounded-full"></div>
                                    <span className="ml-2 text-purple-600">
                                        {language === "vi" ? "Đang tải..." : "Loading..."}
                                    </span>
                                </div>
                            ) : filteredAvailableTenants.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">🔍</span>
                                    <p>
                                        {searchTerm 
                                            ? (language === "vi" ? "Không tìm thấy khách thuê nào" : "No tenants found") 
                                            : (language === "vi" ? "Không có khách thuê nào có sẵn" : "No available tenants")
                                        }
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{language === "vi" ? "Tên khách thuê" : "Tenant Name"}</TableHead>
                                            <TableHead>{language === "vi" ? "Số điện thoại" : "Phone"}</TableHead>
                                            <TableHead>{language === "vi" ? "Email" : "Email"}</TableHead>
                                            <TableHead className="text-center">{language === "vi" ? "Thao tác" : "Actions"}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAvailableTenants.map((tenant, index) => {
                                            const tenantId = tenant.maKhachThue || tenant.maKhach || tenant.ma_khach || tenant.id
                                            const tenantName = tenant.hoTen || tenant.ho_ten || tenant.tenKhach || tenant.name || `Tenant ${tenantId}`
                                            const tenantPhone = tenant.soDienThoai || tenant.so_dien_thoai || tenant.dien_thoai || tenant.phone || "-"
                                            const tenantEmail = tenant.email || "-"
                                            
                                            console.log(`Rendering tenant ${index}:`, {tenantId, tenantName, tenantPhone, tenantEmail})
                                            
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{tenantName}</TableCell>
                                                    <TableCell>{tenantPhone}</TableCell>
                                                    <TableCell>{tenantEmail}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAddTenant(tenantId)}
                                                            disabled={isAdding === tenantId}
                                                            className="h-8"
                                                        >
                                                            {isAdding === tenantId ? (
                                                                <div className="flex items-center gap-1">
                                                                    <div className="animate-spin h-3 w-3 border border-gray-600 border-t-transparent rounded-full"></div>
                                                                    {language === "vi" ? "Thêm" : "Add"}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    <UserPlus className="h-3 w-3" />
                                                                    {language === "vi" ? "Thêm" : "Add"}
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                </div>
                
                <DialogFooter className="border-t border-gray-100 pt-6 mt-6 backdrop-blur-sm">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-gray-50 border-gray-300"
                    >
                        {language === "vi" ? "Đóng" : "Close"}
                    </Button>
                </DialogFooter>
            </DialogContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Dialog>
    )
}