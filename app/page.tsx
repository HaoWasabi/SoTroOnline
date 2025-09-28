import MainLayout from "@/components/main-layout";
import DashboardManagementLayout from "@/module/QuanLyDashboard/components/dashboard-management-layout";

export default function Home() {
  return (
    <MainLayout>
      <main>
        <DashboardManagementLayout />
      </main>
    </MainLayout>
  );
}
