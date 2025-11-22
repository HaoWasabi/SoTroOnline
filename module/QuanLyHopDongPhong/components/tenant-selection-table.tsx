"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Search, UserCheck, UserX, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useLanguageStore } from "@/zustand/language-tranlator"

interface Tenant {
  maKhach: number
  hoTen: string
  maCanCuoc?: string
  dienThoai?: string
  ngaySinh?: string
  thuongTru?: string
  trangThai: string
  // Support database field names (snake_case)
  ma_khach?: number
  ho_ten?: string
  ma_can_cuoc?: string
  dien_thoai?: string
  ngay_sinh?: string
  thuong_tru?: string
  trang_thai?: string
}

interface TenantSelectionTableProps {
  tenants: Tenant[]
  selectedTenants: number[]
  onTenantsChange: (tenantIds: number[]) => void
  loading?: boolean
  maxSelection?: number
  showMainTenant?: boolean
  mainTenantId?: number
  onMainTenantChange?: (tenantId: number) => void
  disabled?: boolean
}

export function TenantSelectionTable({
  tenants,
  selectedTenants,
  onTenantsChange,
  loading = false,
  maxSelection = 4,
  showMainTenant = false,
  mainTenantId,
  onMainTenantChange,
  disabled = false
}: TenantSelectionTableProps) {
  const { language } = useLanguageStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter tenants based on search term and active status
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const isActive = tenant.trangThai?.toLowerCase() === "hoatdong" || 
                      tenant.trangThai?.toLowerCase() === "hoat dong" ||
                      tenant.trangThai?.toLowerCase() === "active" ||
                      tenant.trang_thai?.toLowerCase() === "hoatdong" ||
                      tenant.trang_thai?.toLowerCase() === "hoat dong" ||
                      tenant.trang_thai?.toLowerCase() === "active"
      
      const matchesSearch = searchTerm === "" || [
        // Support camelCase naming (frontend)
        tenant.hoTen,
        tenant.maCanCuoc,
        tenant.dienThoai,
        tenant.maKhach?.toString(),
        // Support underscore naming (backend database)
        tenant.ho_ten,
        tenant.ma_can_cuoc,
        tenant.dien_thoai,
        tenant.ma_khach?.toString()
      ].some(field => 
        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )

      return isActive && matchesSearch
    })
  }, [tenants, searchTerm])

  const handleTenantToggle = (tenantId: number) => {
    if (disabled) return

    const isSelected = selectedTenants.includes(tenantId)
    
    if (isSelected) {
      // Remove tenant
      onTenantsChange(selectedTenants.filter(id => id !== tenantId))
      // If this was the main tenant, clear main tenant selection
      if (showMainTenant && mainTenantId === tenantId) {
        onMainTenantChange?.(0)
      }
    } else {
      // Add tenant (check max selection limit)
      if (selectedTenants.length >= maxSelection) {
        return // Cannot add more tenants
      }
      const newSelection = [...selectedTenants, tenantId]
      onTenantsChange(newSelection)
      
      // If this is the first tenant and we need a main tenant, set it as main
      if (showMainTenant && selectedTenants.length === 0) {
        onMainTenantChange?.(tenantId)
      }
    }
  }

  const handleMainTenantChange = (tenantId: number) => {
    if (disabled) return
    onMainTenantChange?.(tenantId)
  }

  const isSelectionFull = selectedTenants.length >= maxSelection

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {language === "vi" ? "Chọn khách thuê" : "Select Tenants"}
          <Badge variant="secondary">
            {selectedTenants.length}/{maxSelection}
          </Badge>
        </CardTitle>
        <CardDescription>
          {language === "vi" 
            ? `Chọn tối đa ${maxSelection} khách thuê cho hợp đồng này` 
            : `Select up to ${maxSelection} tenants for this contract`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === "vi" ? "Tìm kiếm theo tên, CCCD, SĐT..." : "Search by name, ID card, phone..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>

        {/* Selection Status */}
        {selectedTenants.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              {language === "vi" 
                ? `Đã chọn ${selectedTenants.length} khách thuê` 
                : `${selectedTenants.length} tenants selected`}
              {isSelectionFull && (
                <span className="ml-2 text-orange-600">
                  {language === "vi" ? "(Đã đạt giới hạn)" : "(Limit reached)"}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Tenants Table */}
        <div className="border rounded-lg max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{language === "vi" ? "Mã" : "ID"}</TableHead>
                <TableHead>{language === "vi" ? "Họ tên" : "Full Name"}</TableHead>
                <TableHead>{language === "vi" ? "CCCD" : "ID Card"}</TableHead>
                <TableHead>{language === "vi" ? "Số điện thoại" : "Phone"}</TableHead>
                <TableHead>{language === "vi" ? "Trạng thái" : "Status"}</TableHead>
                {showMainTenant && (
                  <TableHead className="text-center">
                    {language === "vi" ? "Đại diện" : "Main"}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={showMainTenant ? 7 : 6} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>{language === "vi" ? "Đang tải..." : "Loading..."}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showMainTenant ? 7 : 6} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        language === "vi" ? "Không tìm thấy khách thuê phù hợp" : "No matching tenants found"
                      ) : (
                        language === "vi" ? "Không có khách thuê hoạt động" : "No active tenants available"
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenants.map((tenant, index) => {
                  const tenantId = tenant.maKhach || tenant.ma_khach || 0
                  const isSelected = selectedTenants.includes(tenantId)
                  const isMainTenant = showMainTenant && mainTenantId === tenantId
                  const canSelect = !disabled && (!isSelectionFull || isSelected)
                  
                  // Create a unique key using both tenant ID and array index as fallback
                  const uniqueKey = tenantId > 0 ? `tenant-${tenantId}` : `tenant-fallback-${index}`

                  return (
                    <TableRow key={uniqueKey} className={isSelected ? "bg-blue-50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleTenantToggle(tenantId)}
                          disabled={!canSelect}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{tenantId}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{tenant.hoTen || tenant.ho_ten}</span>
                          {isMainTenant && (
                            <Badge variant="default" className="text-xs">
                              {language === "vi" ? "Đại diện" : "Main"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{(tenant.maCanCuoc || tenant.ma_can_cuoc) || "-"}</TableCell>
                      <TableCell>{(tenant.dienThoai || tenant.dien_thoai) || "-"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={tenant.trangThai?.toLowerCase().includes("hoat") || 
                                 tenant.trangThai?.toLowerCase().includes("active") ? "default" : "secondary"}
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          {language === "vi" ? "Hoạt động" : "Active"}
                        </Badge>
                      </TableCell>
                      {showMainTenant && (
                        <TableCell className="text-center">
                          {isSelected && (
                            <Button
                              variant={isMainTenant ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleMainTenantChange(tenantId)}
                              disabled={disabled}
                            >
                              {isMainTenant ? (
                                language === "vi" ? "Đại diện" : "Main"
                              ) : (
                                language === "vi" ? "Chọn" : "Set"
                              )}
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-600">
          <p>
            {language === "vi" 
              ? "💡 Mẹo: Bạn có thể tìm kiếm theo tên, số CCCD hoặc số điện thoại" 
              : "💡 Tip: You can search by name, ID card number, or phone number"}
          </p>
          {showMainTenant && (
            <p className="mt-1">
              {language === "vi"
                ? "🏠 Chọn một người làm đại diện chính cho hợp đồng"
                : "🏠 Select one person as the main representative for the contract"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}