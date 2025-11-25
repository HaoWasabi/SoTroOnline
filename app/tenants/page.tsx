"use client";

import MainLayout from "@/components/main-layout";
import TenantManagementLayout from "@/module/QuanLyKhachThue/components/tenant-management-layout";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function TenantsPage() {
    const { isAuthenticated } = useAuthGuard();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <MainLayout>
            <TenantManagementLayout />
        </MainLayout>
    )
}