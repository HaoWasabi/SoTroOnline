"use client";

import MainLayout from "@/components/main-layout";
import DashboardManagementLayout from "@/module/QuanLyDashboard/components/dashboard-management-layout";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function Home() {
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
      <main>
        <DashboardManagementLayout />
      </main>
    </MainLayout>
  );
}
