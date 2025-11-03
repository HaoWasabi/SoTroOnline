"use client"

import { useEffect, useState } from "react";
import { fetchTenants, TenantResponse } from "../api/api-tenant";
import { Tenant } from "../types/Tenant";
import { useLanguageStore } from "@/zustand/language-tranlator";
import TenantComponent from "./tenant-component";
import Pagination from "./pagination";
import { useAuthGuard } from "@/hook/useAuthGuard";

interface ListOfTenantsProps {
    searchTerm: string;
    statusFilter: string;
}

export default function ListOfTenants({ searchTerm, statusFilter }: ListOfTenantsProps) {
    const { language } = useLanguageStore();
    const { isAuthenticated } = useAuthGuard();
    const [allTenants, setAllTenants] = useState<Tenant[]>([]);
    const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
        hasNext: false,
        hasPrevious: false
    });

    const loadTenants = async (page: number = 0, search?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response: TenantResponse = await fetchTenants(page, search);
            
            if (response.success) {
                setAllTenants(response.data.content);
                setPagination({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    size: response.data.size,
                    hasNext: response.data.hasNext,
                    hasPrevious: response.data.hasPrevious
                });
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(language === 'vi' ? 'Không thể tải danh sách khách thuê' : 'Failed to load tenants');
            console.error('Error loading tenants:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter tenants based on status
    const filterTenants = (tenants: Tenant[], statusFilter: string) => {
        if (!statusFilter) return tenants;
        
        return tenants.filter(tenant => {
            if (statusFilter === "unknown") {
                // Check for tenants with unknown status (not 'hoatDong' or 'daXoa')
                return tenant.trangThai !== 'hoatDong' && tenant.trangThai !== 'daXoa';
            }
            return tenant.trangThai === statusFilter;
        });
    };

    // Update filtered tenants when allTenants or statusFilter changes
    useEffect(() => {
        const filtered = filterTenants(allTenants, statusFilter);
        setFilteredTenants(filtered);
    }, [allTenants, statusFilter]);

    useEffect(() => {
        // Only load tenants if authenticated
        if (isAuthenticated) {
            loadTenants();
        }
    }, [isAuthenticated]);

    // Effect to handle search term changes
    useEffect(() => {
        if (isAuthenticated) {
            const timeoutId = setTimeout(() => {
                loadTenants(0, searchTerm);
            }, 500); // Debounce search for 500ms

            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm, isAuthenticated]);

    const handlePageChange = (newPage: number) => {
        loadTenants(newPage, searchTerm);
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
                        onClick={() => loadTenants()} 
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
                                 statusFilter === 'daXoa' ? (language === 'vi' ? 'Đã xóa' : 'Deleted') :
                                 statusFilter === 'unknown' ? (language === 'vi' ? 'Không xác định' : 'Unknown') : statusFilter}"
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
            
            <div className="grid grid-col-1 lg:grid-cols-3 gap-4">
                {filteredTenants.map((tenant: Tenant) => (
                    <TenantComponent 
                        key={tenant.maKhach} 
                        tenant={tenant}
                        onUpdate={() => loadTenants(pagination.currentPage, searchTerm)}
                        onDelete={() => loadTenants(pagination.currentPage, searchTerm)}
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