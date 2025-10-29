"use client"

import { useEffect, useState } from "react";
import { fetchTenants, TenantResponse } from "../api/api-tenant";
import { Tenant } from "../types/Tenant";
import { useLanguageStore } from "@/zustand/language-tranlator";
import TenantComponent from "./tenant-component";
import Pagination from "./pagination";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function ListOfTenants() {
    const { language } = useLanguageStore();
    const { isAuthenticated } = useAuthGuard();
    const [tenants, setTenants] = useState<Tenant[]>([]);
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
                setTenants(response.data.content);
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

    useEffect(() => {
        // Only load tenants if authenticated
        if (isAuthenticated) {
            loadTenants();
        }
    }, [isAuthenticated]);

    const handlePageChange = (newPage: number) => {
        loadTenants(newPage);
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

    if (tenants.length === 0) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">
                    {language === 'vi' ? 'Không có khách thuê nào' : 'No tenants found'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-col-1 lg:grid-cols-3 gap-4">
                {tenants.map((tenant) => (
                    <TenantComponent 
                        key={tenant.maKhach} 
                        tenant={tenant}
                        onUpdate={() => loadTenants(pagination.currentPage)}
                        onDelete={() => loadTenants(pagination.currentPage)}
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