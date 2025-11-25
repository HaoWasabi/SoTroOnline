"use client";

import MainLayout from "@/components/main-layout";
import ContractManagementLayout from "@/module/QuanLyHopDongPhong/components/contract-management-layout";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function ContractsPage() {
    const { isAuthenticated } = useAuthGuard();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <MainLayout>
            <ContractManagementLayout />
        </MainLayout>
    )
}