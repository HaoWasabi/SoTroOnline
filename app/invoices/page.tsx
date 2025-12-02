"use client";

import MainLayout from "@/components/main-layout";
import InvoiceManagementLayout from "@/module/QuanLyHoaDon/components/invoice-management-layout";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function InvoicesPage() {
    const { isAuthenticated, isLoading } = useAuthGuard();

    // Show loading during hydration
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Will redirect if not authenticated, so just return null briefly
    if (!isAuthenticated) {
        return null;
    }

    return (
        <MainLayout>
            <InvoiceManagementLayout />
        </MainLayout>
    )
}