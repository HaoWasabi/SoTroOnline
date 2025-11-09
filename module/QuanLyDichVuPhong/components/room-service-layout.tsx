"use client"

import { Card, CardContent } from "@/components/ui/card";
import { useLanguageStore } from "@/zustand/language-tranlator";
import RoomServiceCard from "./room-service-card";
import { useEffect, useState } from "react";
import { getDichVuApi } from "../api/api-quan-ly-dich-vu-phong";
import { DichVuResponse } from "../types/dich-vu-types";
import { Toast, ToastContainer } from "@/components/toast";
import { useToast } from "@/hook/useToast";
import { useAuthGuard } from "@/hook/useAuthGuard";

export default function RoomServiceManagementLayout() {
    // Authentication guard
    const { isAuthenticated } = useAuthGuard();

    const {language} = useLanguageStore();
    const { toast, showError, showSuccess, removeToast } = useToast();
    const [dichVuData, setDichVuData] = useState<DichVuResponse | null>(null);
    const [loading, setLoading] = useState(true);

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
                    <p>
                        {!isAuthenticated 
                            ? (language === 'vi' ? 'Đang xác thực...' : 'Authenticating...')
                            : (language === 'vi' ? 'Đang tải...' : 'Loading...')
                        }
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            {toast && (
                <ToastContainer>
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => removeToast()}
                    />
                </ToastContainer>
            )}
            
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {language === 'vi' ? 'Quản lý dịch vụ phòng' : 'Room Service Management'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {language === 'vi' 
                                    ? 'Quản lý giá dịch vụ điện, nước và rác cho tất cả các phòng'
                                    : 'Manage electricity, water and garbage service prices for all rooms'
                                }
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-4">
                {dichVuData && (
                    <RoomServiceCard 
                        dichVu={dichVuData} 
                        onUpdateSuccess={handleUpdateSuccess}
                    />
                )}
            </div>
        </main>
    )
}
