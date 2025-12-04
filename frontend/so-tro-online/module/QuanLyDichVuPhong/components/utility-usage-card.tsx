"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { UtilityUsageResponse } from "../types/utility-usage-types";
import { 
    Calendar, 
    Zap, 
    Droplet, 
    Home, 
    Edit, 
    Trash2, 
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hook/useToast";
import { deleteUtilityUsage } from "../api/api-utility-usage";
import UtilityUsageFormDialog from "./utility-usage-form-dialog";


interface UtilityUsageCardProps {
    utilityUsage: UtilityUsageResponse;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function UtilityUsageCard({ utilityUsage, onUpdate, onDelete }: UtilityUsageCardProps) {
    const { language } = useLanguageStore();
    const { showSuccess, showError } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate usage differences
    const electricityUsage = utilityUsage.chiSoDienMoi - utilityUsage.chiSoDienCu;
    const waterUsage = utilityUsage.chiSoNuocMoi - utilityUsage.chiSoNuocCu;

    // Get trend icons
    const getElectricityTrend = () => {
        if (electricityUsage > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
        if (electricityUsage < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
        return <Minus className="h-4 w-4 text-gray-500" />;
    };

    const getWaterTrend = () => {
        if (waterUsage > 0) return <TrendingUp className="h-4 w-4 text-blue-500" />;
        if (waterUsage < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
        return <Minus className="h-4 w-4 text-gray-500" />;
    };

    // Get status badge
    const getStatusBadge = () => {
        const isActive = utilityUsage.trangThai === 'hoatDong';
        return (
            <Badge 
                variant={isActive ? 'default' : 'destructive'}
                className={`px-3 py-1 text-xs font-semibold shadow-lg ${
                    isActive
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-green-200"
                        : "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-red-200"
                }`}
            >
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    {language === 'vi' 
                        ? (isActive ? 'Đang hoạt động' : 'Đã xóa')
                        : (isActive ? 'Active' : 'Deleted')
                    }
                </div>
            </Badge>
        );
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                year: 'numeric',
                month: 'long'
            });
        } catch {
            return dateString;
        }
    };

    // Handle delete
    const handleDelete = async () => {
        const confirmMsg = language === 'vi'
            ? "Bạn có chắc chắn muốn xóa bản ghi này?"
            : "Are you sure you want to delete this record?";
        
        if (!confirm(confirmMsg)) return;

        try {
            setIsDeleting(true);
            await deleteUtilityUsage(utilityUsage.id);
            showSuccess(language === 'vi' ? 'Xóa thành công' : 'Deleted successfully');
            onDelete?.();
        } catch (error) {
            console.error('Error deleting utility usage:', error);
            showError(language === 'vi' ? 'Có lỗi xảy ra khi xóa' : 'Error deleting record');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Home className="h-6 w-6 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                {utilityUsage.tenPhong}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(utilityUsage.thangNam)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge()}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-lg border-2 border-gray-200 hover:border-gray-300">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    {language === 'vi' ? 'Hành động' : 'Actions'}
                                </DropdownMenuLabel>
                                <UtilityUsageFormDialog
                                    utilityUsage={utilityUsage}
                                    onSuccess={onUpdate}
                                    mode="edit"
                                >
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                                    </DropdownMenuItem>
                                </UtilityUsageFormDialog>
                                <DropdownMenuItem 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {isDeleting 
                                        ? (language === 'vi' ? 'Đang xóa...' : 'Deleting...')
                                        : (language === 'vi' ? 'Xóa' : 'Delete')
                                    }
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Electricity Usage */}
                <div className="bg-white rounded-xl p-5 border border-yellow-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500"></div>
                        <h4 className="font-bold text-lg text-gray-900">
                            <Zap className="h-5 w-5 text-yellow-600 inline mr-2" />
                            {language === 'vi' ? 'Điện' : 'Electricity'}
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">
                                {language === 'vi' ? 'Chỉ số cũ' : 'Previous Reading'}
                            </div>
                            <div className="text-lg font-bold text-gray-800">
                                {utilityUsage.chiSoDienCu.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                            <div className="text-sm text-blue-600 mb-1">
                                {language === 'vi' ? 'Chỉ số mới' : 'Current Reading'}
                            </div>
                            <div className="text-lg font-bold text-blue-800">
                                {utilityUsage.chiSoDienMoi.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
                            <div className="text-sm text-yellow-600 mb-1 flex items-center gap-1">
                                {language === 'vi' ? 'Tiêu thụ' : 'Usage'}
                                {getElectricityTrend()}
                            </div>
                            <div className="text-lg font-bold text-yellow-800">
                                {Math.abs(electricityUsage).toLocaleString()} kWh
                            </div>
                        </div>
                    </div>
                </div>

                {/* Water Usage */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <h4 className="font-bold text-lg text-gray-900">
                            <Droplet className="h-5 w-5 text-blue-600 inline mr-2" />
                            {language === 'vi' ? 'Nước' : 'Water'}
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">
                                {language === 'vi' ? 'Chỉ số cũ' : 'Previous Reading'}
                            </div>
                            <div className="text-lg font-bold text-gray-800">
                                {utilityUsage.chiSoNuocCu.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
                            <div className="text-sm text-cyan-600 mb-1">
                                {language === 'vi' ? 'Chỉ số mới' : 'Current Reading'}
                            </div>
                            <div className="text-lg font-bold text-cyan-800">
                                {utilityUsage.chiSoNuocMoi.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                            <div className="text-sm text-blue-600 mb-1 flex items-center gap-1">
                                {language === 'vi' ? 'Tiêu thụ' : 'Usage'}
                                {getWaterTrend()}
                            </div>
                            <div className="text-lg font-bold text-blue-800">
                                {Math.abs(waterUsage).toLocaleString()} m³
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}