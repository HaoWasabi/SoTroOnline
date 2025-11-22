"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader} from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useTaiKhoanStore } from "@/zustand/taikhoan-store"
import {  Edit, Trash2, Phone, User, Calendar, MapPin, CreditCard, RotateCcw, MoreHorizontal, Eye } from "lucide-react"
import { TenantFormEditing } from "./tenant-form-editing"
import { deleteTenant, restoreTenant } from "../api/api-tenant"
import { useState } from "react"
import { Tenant } from "../types/Tenant"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

interface TenantComponentProps {
    tenant: Tenant;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function TenantComponent({ tenant, onUpdate, onDelete }: TenantComponentProps) {

    const { language } = useLanguageStore();
    const { taiKhoan } = useTaiKhoanStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [seeDialogOpen, setSeeDialogOpen] = useState(false);
    const { toast, showSuccess, showError, removeToast } = useToast();

    // Helper function to get manager name
    const getManagerName = () => {
        // In a SAAS system, if the tenant belongs to the current manager,
        // we can get the name from the current user context
        if (tenant.maNguoiQuanLy && taiKhoan) {
            if (tenant.maNguoiQuanLy === taiKhoan.maTaiKhoan) {
                return taiKhoan.hoTen || 'Unknown Manager';
            }
        }
        return 'Unknown Manager';
    };

    // Helper function to get status badge
    const getStatusBadge = () => {
        const statusConfig = {
            'hoatDong': {
                variant: 'default' as const,
                className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-green-200',
                text: language === 'vi' ? 'Đang hoạt động' : 'Active',
                icon: <div className="w-2 h-2 rounded-full bg-white/80 mr-1"></div>
            },
            'daXoa': {
                variant: 'destructive' as const,
                className: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-red-200',
                text: language === 'vi' ? 'Đã xóa' : 'Deleted',
                icon: <div className="w-2 h-2 rounded-full bg-white/60 mr-1"></div>
            }
        };

        const config = statusConfig[tenant.trangThai as keyof typeof statusConfig];
        
        if (config) {
            return (
                <Badge variant={config.variant} className={config.className}>
                    <div className="flex items-center gap-1">
                        {config.icon}
                        {config.text}
                    </div>
                </Badge>
            );
        }

        // Fallback for any unexpected values (should not happen based on your data)
        return (
            <Badge variant="outline" className="bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                {tenant.trangThai || (language === 'vi' ? 'Không xác định' : 'Unknown')}
            </Badge>
        );
    };

    return (
        <>
            <Card className="w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                    {tenant.hoTen}
                                </h3>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {getStatusBadge()}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0">
                    {/* Summary Information - Keep only essential info in card */}
                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            <h4 className="font-bold text-sm text-gray-900">
                                {language === 'vi' ? 'Thông tin tóm tắt' : 'Summary Information'}
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {tenant.maCanCuoc && (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                                    <div className="flex items-center gap-2 text-xs">
                                        <CreditCard className="h-3 w-3 text-blue-600" />
                                        <span className="text-blue-600 font-medium">
                                            {language === 'vi' ? 'CCCD:' : 'ID:'}
                                        </span>
                                        <span className="text-blue-800 font-semibold">
                                            {tenant.maCanCuoc}
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            {tenant.dienThoai && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                                    <div className="flex items-center gap-2 text-xs">
                                        <Phone className="h-3 w-3 text-purple-600" />
                                        <span className="text-purple-600 font-medium">
                                            {language === 'vi' ? 'SĐT:' : 'Phone:'}
                                        </span>
                                        <span className="text-purple-800 font-semibold">
                                            {tenant.dienThoai}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{language === 'vi' ? 'Hành động' : 'Actions'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* See Tenant Button */}
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSeeDialogOpen(true)}
                                    className="rounded-lg border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-medium transition-all duration-200"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? 'Xem chi tiết' : 'See Details'}
                                </Button>

                                {/* Actions Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <TenantFormEditing tenant={tenant} onUpdate={onUpdate}>
                                            <DropdownMenuItem asChild>
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <Edit className="h-4 w-4" />
                                                    {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                                                </div>
                                            </DropdownMenuItem>
                                        </TenantFormEditing>
                                        
                                        {tenant.dienThoai && tenant.trangThai === 'hoatDong' && (
                                            <DropdownMenuItem 
                                                onClick={() => window.open(`tel:${tenant.dienThoai}`, '_blank')}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <Phone className="h-4 w-4" />
                                                {language === 'vi' ? 'Gọi điện thoại' : 'Call Phone'}
                                            </DropdownMenuItem>
                                        )}
                                        
                                        {tenant.trangThai === 'hoatDong' ? (
                                            <DropdownMenuItem 
                                                onClick={() => setDeleteDialogOpen(true)}
                                                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                {language === 'vi' ? 'Xóa khách thuê' : 'Delete Tenant'}
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem 
                                                onClick={() => setRestoreDialogOpen(true)}
                                                className="flex items-center gap-2 cursor-pointer text-green-600 focus:text-green-600"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                                {language === 'vi' ? 'Khôi phục' : 'Restore'}
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            {tenant.trangThai === 'hoatDong' && (
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-5 w-5" />
                                {language === 'vi' ? 'Xác nhận xóa' : 'Confirm Deletion'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {language === 'vi' 
                                    ? `Bạn có chắc chắn muốn xóa khách thuê "${tenant.hoTen}"? Khách thuê sẽ được đánh dấu là đã xóa nhưng dữ liệu vẫn được lưu trữ.`
                                    : `Are you sure you want to delete tenant "${tenant.hoTen}"? The tenant will be marked as deleted but data will be preserved.`
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <Button 
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                            <Button 
                                variant="destructive" 
                                disabled={isDeleting}
                                className="min-w-20"
                                onClick={async () => {
                                    if (!tenant.maKhach) {
                                        showError(language === 'vi' ? 'Không thể xóa: Thiếu ID khách thuê' : 'Cannot delete: Missing tenant ID');
                                        return;
                                    }
                                    
                                    try {
                                        setIsDeleting(true);
                                        console.log('Attempting to delete tenant with ID:', tenant.maKhach);
                                        
                                        const result = await deleteTenant(tenant.maKhach);
                                        console.log('Delete result:', result);
                                        
                                        if (result.success || (result.status && result.status >= 200 && result.status < 300)) {
                                            showSuccess(
                                                language === 'vi' 
                                                    ? 'Xóa khách thuê thành công!' 
                                                    : 'Tenant deleted successfully!'
                                            );
                                            setDeleteDialogOpen(false);
                                            onDelete?.();
                                        } else {
                                            showError(result.message || (language === 'vi' ? 'Xóa thất bại' : 'Delete failed'));
                                        }
                                    } catch (error) {
                                        console.error('Error deleting tenant:', error);
                                        showError(
                                            language === 'vi' 
                                                ? 'Có lỗi xảy ra khi xóa khách thuê. Vui lòng thử lại.' 
                                                : 'An error occurred while deleting the tenant. Please try again.'
                                        );
                                    } finally {
                                        setIsDeleting(false);
                                    }
                                }}
                            >
                                {isDeleting 
                                    ? (language === 'vi' ? 'Đang xóa...' : 'Deleting...') 
                                    : (language === 'vi' ? 'Xóa' : 'Delete')
                                }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Restore Dialog */}
            {tenant.trangThai === 'daXoa' && (
                <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-green-600">
                                <RotateCcw className="h-5 w-5" />
                                {language === 'vi' ? 'Xác nhận khôi phục' : 'Confirm Restoration'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {language === 'vi' 
                                    ? `Bạn có chắc chắn muốn khôi phục khách thuê "${tenant.hoTen}"? Khách thuê sẽ trở lại trạng thái hoạt động.`
                                    : `Are you sure you want to restore tenant "${tenant.hoTen}"? The tenant will be returned to active status.`
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <Button 
                                variant="outline"
                                onClick={() => setRestoreDialogOpen(false)}
                                disabled={isRestoring}
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                            <Button 
                                variant="default" 
                                disabled={isRestoring}
                                className="min-w-20 bg-green-600 hover:bg-green-700"
                                onClick={async () => {
                                    if (!tenant.maKhach) {
                                        showError(language === 'vi' ? 'Không thể khôi phục: Thiếu ID khách thuê' : 'Cannot restore: Missing tenant ID');
                                        return;
                                    }
                                    
                                    try {
                                        setIsRestoring(true);
                                        console.log('Attempting to restore tenant with ID:', tenant.maKhach);
                                        
                                        const result = await restoreTenant(tenant.maKhach);
                                        console.log('Restore result:', result);
                                        
                                        if (result.success || (result.status && result.status >= 200 && result.status < 300)) {
                                            showSuccess(
                                                language === 'vi' 
                                                    ? 'Khôi phục khách thuê thành công!' 
                                                    : 'Tenant restored successfully!'
                                            );
                                            setRestoreDialogOpen(false);
                                            onUpdate?.(); // Refresh the list to show updated status
                                        } else {
                                            showError(result.message || (language === 'vi' ? 'Khôi phục thất bại' : 'Restore failed'));
                                        }
                                    } catch (error) {
                                        console.error('Error restoring tenant:', error);
                                        showError(
                                            language === 'vi' 
                                                ? 'Có lỗi xảy ra khi khôi phục khách thuê. Vui lòng thử lại.' 
                                                : 'An error occurred while restoring the tenant. Please try again.'
                                        );
                                    } finally {
                                        setIsRestoring(false);
                                    }
                                }}
                            >
                                {isRestoring 
                                    ? (language === 'vi' ? 'Đang khôi phục...' : 'Restoring...') 
                                    : (language === 'vi' ? 'Khôi phục' : 'Restore')
                                }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* See Tenant Details Dialog */}
            <Dialog open={seeDialogOpen} onOpenChange={setSeeDialogOpen}>
                <DialogContent className="max-w-4xl rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="space-y-2 pb-4 border-b border-gray-100">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            {tenant.hoTen}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600 ml-10">
                            {language === 'vi' ? 'Thông tin chi tiết của khách thuê' : 'Detailed tenant information'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Thông tin cơ bản' : 'Basic Information'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">

                                
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        <span className="text-emerald-600 font-medium">
                                            {language === 'vi' ? 'Trạng thái:' : 'Status:'}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        {getStatusBadge()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {tenant.maCanCuoc && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <CreditCard className="h-4 w-4 text-blue-600" />
                                            <span className="text-blue-600 font-medium">
                                                {language === 'vi' ? 'Căn cước công dân:' : 'ID Card Number:'}
                                            </span>
                                        </div>
                                        <span className="text-blue-800 font-bold text-lg">
                                            {tenant.maCanCuoc}
                                        </span>
                                    </div>
                                )}
                                
                                {tenant.ngaySinh && (
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Calendar className="h-4 w-4 text-emerald-600" />
                                            <span className="text-emerald-600 font-medium">
                                                {language === 'vi' ? 'Ngày sinh:' : 'Date of Birth:'}
                                            </span>
                                        </div>
                                        <span className="text-emerald-800 font-bold text-lg">
                                            {new Date(tenant.ngaySinh).toLocaleDateString(
                                                language === 'vi' ? 'vi-VN' : 'en-US'
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {tenant.dienThoai && (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Phone className="h-4 w-4 text-purple-600" />
                                            <span className="text-purple-600 font-medium">
                                                {language === 'vi' ? 'Số điện thoại:' : 'Phone Number:'}
                                            </span>
                                        </div>
                                        <span className="text-purple-800 font-bold text-lg">
                                            {tenant.dienThoai}
                                        </span>
                                    </div>
                                )}
                                
                                {tenant.thuongTru && (
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <MapPin className="h-4 w-4 text-amber-600" />
                                            <span className="text-amber-600 font-medium">
                                                {language === 'vi' ? 'Địa chỉ thường trú:' : 'Permanent Address:'}
                                            </span>
                                        </div>
                                        <span className="text-amber-800 font-bold text-lg">
                                            {tenant.thuongTru}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Manager Information Section - SAAS Support */}
                        {tenant.maNguoiQuanLy && (
                            <div className="bg-white rounded-xl p-6 border border-teal-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                                    <h4 className="font-bold text-lg text-gray-900">
                                        {language === 'vi' ? 'Thông tin người quản lý' : 'Manager Information'}
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <User className="h-4 w-4 text-teal-600" />
                                            <span className="text-teal-600 font-medium">
                                                {language === 'vi' ? 'Tên người quản lý:' : 'Manager Name:'}
                                            </span>
                                        </div>
                                        <span className="text-teal-800 font-bold text-lg">
                                            {getManagerName()}
                                        </span>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-500 font-medium">
                                                {language === 'vi' ? 'Mã quản lý:' : 'Manager ID:'}
                                            </span>
                                        </div>
                                        <span className="text-gray-700 font-bold text-lg">
                                            {tenant.maNguoiQuanLy}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t border-gray-100 pt-4">
                        <Button 
                            onClick={() => setSeeDialogOpen(false)}
                            className="rounded-xl px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold"
                        >
                            {language === 'vi' ? 'Đóng' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {toast && <Toast {...toast} onClose={removeToast} />}
        </>
    )
}