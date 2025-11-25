"use client";

import MainLayout from "@/components/main-layout";
import InvoiceManagementLayout from "@/module/QuanLyHoaDon/components/invoice-management-layout";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function InvoicesPage() {
    const { isAuthenticated } = useAuthGuard();

    // Show loading or nothing while authentication is being checked
    if (!isAuthenticated) {
        return null; // The auth guard will handle the redirect
    }

    return (
        <MainLayout>
            <InvoiceManagementLayout />
        </MainLayout>
    )
}