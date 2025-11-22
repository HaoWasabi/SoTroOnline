"use client"

import { useEffect, useState } from "react";
import { fetchTenantsForCurrentManager, TenantResponse } from "../api/api-tenant";
import { Tenant } from "../types/Tenant";
import { useLanguageStore } from "@/zustand/language-tranlator";
import TenantComponent from "./tenant-component";
import Pagination from "./pagination";
import { useAuthGuard } from "@/hook/useAuthGuard";

interface ListOfTenantsProps {
    searchTerm: string;
    statusFilter: string;
    refreshTrigger: number;
}

export default function ListOfTenants({ searchTerm, statusFilter, refreshTrigger }: ListOfTenantsProps) {
    const { language } = useLanguageStore();
    const { isAuthenticated } = useAuthGuard();
    const [allTenants, setAllTenants] = useState<Tenant[]>([]);
    const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
        hasNext: false,
        hasPrevious: false
    });

    const loadTenants = async (page: number = 0, search?: string, status?: string, isRefresh: boolean = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            
            // Debug logging
            console.log('🔍 Loading tenants with params:', { page, search, status, isRefresh });
            
            const response: TenantResponse = await fetchTenantsForCurrentManager(page, search, status);
            
            console.log('📡 API Response:', response);
            
            if (response.success) {
                console.log('✅ Tenants loaded:', response.data.content.length, 'items');
                console.log('📋 Tenants data:', response.data.content.map(t => ({ id: t.maKhach, name: t.hoTen, status: t.trangThai })));
                
                setAllTenants(response.data.content);
                setFilteredTenants(response.data.content); // Since API handles filtering, display all returned data
                setPagination({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    size: response.data.size,
                    hasNext: response.data.hasNext,
                    hasPrevious: response.data.hasPrevious
                });
            } else {
                console.log('❌ API Error:', response.message);
                setError(response.message);
            }
        } catch (err) {
            console.error('💥 Load tenants error:', err);
            setError(language === 'vi' ? 'Không thể tải danh sách khách thuê' : 'Failed to load tenants');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Single effect to handle all data loading scenarios
    useEffect(() => {
        console.log('🔄 useEffect triggered:', { isAuthenticated, refreshTrigger, searchTerm, statusFilter });
        
        if (!isAuthenticated) {
            console.log('❌ Not authenticated, skipping load');
            return;
        }

        // Handle refresh trigger (when new tenant is created)
        if (refreshTrigger > 0) {
            console.log('🔄 Refresh trigger activated');
            loadTenants(0, searchTerm, statusFilter, true);
            return;
        }

        // Handle search with debounce - only if searchTerm has actual content
        if (searchTerm && searchTerm.trim().length > 0) {
            console.log('🔍 Search debounce activated for:', searchTerm);
            const timeoutId = setTimeout(() => {
                loadTenants(0, searchTerm, statusFilter, false);
            }, 500);
            return () => {
                console.log('🧹 Clearing search timeout');
                clearTimeout(timeoutId);
            };
        }

        // Initial load and status filter changes (when no active search)
        console.log('📋 Standard load triggered');
        loadTenants(0, searchTerm || '', statusFilter || '', false);
    }, [isAuthenticated, refreshTrigger, searchTerm, statusFilter]);

    const handlePageChange = (newPage: number) => {
        loadTenants(newPage, searchTerm, statusFilter, false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">
                    {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="text-center">
                    <p className="text-red-600 mb-2">{error}</p>
                    <button 
                        onClick={() => loadTenants(0, searchTerm, statusFilter, false)} 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {language === 'vi' ? 'Thử lại' : 'Try Again'}
                    </button>
                </div>
            </div>
        );
    }

    if (filteredTenants.length === 0) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">
                    {searchTerm || statusFilter
                        ? (language === 'vi' ? 'Không tìm thấy khách thuê' : 'No tenant found')
                        : (language === 'vi' ? 'Không có khách thuê nào' : 'No tenants found')
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Refreshing indicator */}
            {refreshing && (
                <div className="flex items-center justify-center py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-700 text-sm">
                        {language === 'vi' ? 'Đang cập nhật danh sách...' : 'Refreshing list...'}
                    </span>
                </div>
            )}
            
            {/* Results summary */}
            {(searchTerm || statusFilter) && (
                <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span>
                        {language === 'vi' 
                            ? `Hiển thị ${filteredTenants.length} kết quả`
                            : `Showing ${filteredTenants.length} results`
                        }
                        {searchTerm && (
                            <span className="ml-1">
                                {language === 'vi' ? 'cho' : 'for'} "{searchTerm}"
                            </span>
                        )}
                        {statusFilter && (
                            <span className="ml-1">
                                {language === 'vi' ? 'với trạng thái' : 'with status'} "
                                {statusFilter === 'hoatDong' ? (language === 'vi' ? 'Đang hoạt động' : 'Active') :
                                 statusFilter === 'daXoa' ? (language === 'vi' ? 'Đã xóa' : 'Deleted') : statusFilter}"
                            </span>
                        )}
                    </span>
                    {allTenants.length > 0 && (
                        <span>
                            {language === 'vi' 
                                ? `từ tổng số ${allTenants.length} khách thuê`
                                : `out of ${allTenants.length} total tenants`
                            }
                        </span>
                    )}
                </div>
            )}
            
            <div className={`grid grid-col-1 lg:grid-cols-3 gap-4 transition-opacity duration-300 ${refreshing ? 'opacity-70' : 'opacity-100'}`}>
                {filteredTenants.map((tenant: Tenant) => (
                    <TenantComponent 
                        key={tenant.maKhach} 
                        tenant={tenant}
                        onUpdate={() => loadTenants(pagination.currentPage, searchTerm, statusFilter, false)}
                        onDelete={() => loadTenants(pagination.currentPage, searchTerm, statusFilter, false)}
                    />
                ))}
            </div>
            
            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNext={pagination.hasNext}
                    hasPrevious={pagination.hasPrevious}
                    onPageChange={handlePageChange}
                    totalElements={pagination.totalElements}
                    size={pagination.size}
                />
            )}
        </div>
    );
}