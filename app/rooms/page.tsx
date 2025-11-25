"use client";

import MainLayout from "@/components/main-layout";
import RoomManagementLayout from "@/module/QuanLyPhong/components/room-management-layout";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function RoomsPage() {
    const { isAuthenticated } = useAuthGuard();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <MainLayout>
            <RoomManagementLayout />
        </MainLayout>
    )
}