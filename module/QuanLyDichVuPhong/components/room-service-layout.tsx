"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguageStore } from "@/zustand/language-tranlator";
import RoomServiceCard from "./room-service-card";
import UtilityUsageLayout from "./utility-usage-layout";
import { useEffect, useState } from "react";
import { getDichVuApi } from "../api/api-quan-ly-dich-vu-phong";
import { DichVuResponse } from "../types/dich-vu-types";
import { Toast, ToastContainer } from "@/components/toast";
import { useToast } from "@/hook/useToast";
import { useAuthGuard } from "@/hook/useAuthGuard";
import { Settings, BarChart3, Building2, Zap } from "lucide-react";

export default function RoomServiceManagementLayout() {
    // Authentication guard
    const { isAuthenticated } = useAuthGuard();

    const { language } = useLanguageStore();
    const { toast, showError, showSuccess, removeToast } = useToast();
    const [dichVuData, setDichVuData] = useState<DichVuResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pricing");

    useEffect(() => {
        if (isAuthenticated) {
            fetchDichVuData();
        }
    }, [isAuthenticated]);

    const fetchDichVuData = async () => {
        setLoading(true);
        try {
            const result = await getDichVuApi();
            
            if (result.status === 200 && result.data) {
                const serviceData = result.data;
                setDichVuData(serviceData);
            } else {
                showError(language === 'vi' ? 'Không thể tải thông tin dịch vụ' : 'Failed to load service information');
            }
        } catch (error) {
            console.error('Error fetching DichVu data:', error);
            showError(language === 'vi' ? 'Có lỗi xảy ra khi tải dữ liệu' : 'Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSuccess = () => {
        showSuccess(language === 'vi' ? 'Cập nhật thành công' : 'Update successful');
        fetchDichVuData(); // Refresh data
    };

    if (!isAuthenticated || loading) {
        return (
            <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
                <div className="flex justify-center items-center h-64">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-gray-600 font-medium">
                            {!isAuthenticated 
                                ? (language === 'vi' ? 'Đang xác thực...' : 'Authenticating...')
                                : (language === 'vi' ? 'Đang tải...' : 'Loading...')
                            }
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {language === 'vi' ? 'Quản lý dịch vụ phòng' : 'Room Service Management'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {language === 'vi' 
                                ? 'Quản lý giá dịch vụ và chỉ số tiêu thụ điện nước'
                                : 'Manage service pricing and utility consumption tracking'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <TabsTrigger 
                        value="pricing" 
                        className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-semibold transition-all duration-200"
                    >
                        <Settings className="h-4 w-4" />
                        {language === 'vi' ? 'Cài đặt giá dịch vụ' : 'Service Pricing'}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="usage" 
                        className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-semibold transition-all duration-200"
                    >
                        <Zap className="h-4 w-4" />
                        {language === 'vi' ? 'Chỉ số điện nước' : 'Utility Readings'}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="mt-8">
                    <div className="grid grid-cols-1 gap-6">
                        {dichVuData && (
                            <RoomServiceCard 
                                dichVu={dichVuData} 
                                onUpdateSuccess={handleUpdateSuccess}
                            />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="usage" className="mt-8">
                    <UtilityUsageLayout />
                </TabsContent>
            </Tabs>

            {/* Toast Container */}
            {toast && (
                <ToastContainer>
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => removeToast()}
                    />
                </ToastContainer>
            )}
        </main>
    );
}
