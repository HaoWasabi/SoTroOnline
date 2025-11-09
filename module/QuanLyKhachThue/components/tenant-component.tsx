"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { MoreHorizontal, Edit, Mail, Trash2, Phone, User, Calendar, MapPin, CreditCard, RotateCcw } from "lucide-react"
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const { toast, showSuccess, showError, removeToast } = useToast();

    // Helper function to get status badge
    const getStatusBadge = () => {
        const statusConfig = {
            'hoatDong': {
                variant: 'default' as const,
                className: 'bg-green-100 text-green-800 hover:bg-green-200',
                text: language === 'vi' ? 'Đang hoạt động' : 'Active'
            },
            'daXoa': {
                variant: 'destructive' as const,
                className: 'bg-red-100 text-red-800 hover:bg-red-200',
                text: language === 'vi' ? 'Đã xóa' : 'Deleted'
            }
        };

        const config = statusConfig[tenant.trangThai as keyof typeof statusConfig];
        
        if (config) {
            return (
                <Badge variant={config.variant} className={config.className}>
                    {config.text}
                </Badge>
            );
        }

        // Fallback for any unexpected values (should not happen based on your data)
        return (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100">
                {tenant.trangThai || (language === 'vi' ? 'Không xác định' : 'Unknown')}
            </Badge>
        );
    };

    return (
        <Card className="w-full gap-0 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                {tenant.hoTen}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="h-4 w-4" />
                            <span>{language === 'vi' ? 'Mã đại diện:' : 'Representative ID:'} {tenant.maKhachDaiDien}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {getStatusBadge()}
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-2  pt-0">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* {tenant.email && (
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 truncate" title={tenant.email}>
                                {tenant.email}
                            </span>
                        </div>
                    )} */}
                    
                    {tenant.dienThoai && (
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600">
                                {tenant.dienThoai}
                            </span>
                        </div>
                    )}
                </div>

                {/* Personal Information */}
                <div className="space-y-2">
                    {tenant.maCanCuoc && (
                        <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-500">
                                {language === 'vi' ? 'CCCD/CMND:' : 'ID Card:'}
                            </span>
                            <span className="text-gray-700 font-medium">
                                {tenant.maCanCuoc}
                            </span>
                        </div>
                    )}
                    
                    {tenant.ngaySinh && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-500">
                                {language === 'vi' ? 'Ngày sinh:' : 'Birth date:'}
                            </span>
                            <span className="text-gray-700">
                                {new Date(tenant.ngaySinh).toLocaleDateString(
                                    language === 'vi' ? 'vi-VN' : 'en-US'
                                )}
                            </span>
                        </div>
                    )}
                    
                    {tenant.thuongTru && (
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <span className="text-gray-500 block">
                                    {language === 'vi' ? 'Địa chỉ thường trú:' : 'Permanent address:'}
                                </span>
                                <span className="text-gray-700">
                                    {tenant.thuongTru}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons for Quick Access */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <TenantFormEditing tenant={tenant} onUpdate={onUpdate}>
                        <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                        </Button>
                    </TenantFormEditing>
                    
                    {tenant.dienThoai && tenant.trangThai === 'hoatDong' && (
                        <Button 
                            disabled
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`tel:${tenant.dienThoai}`, '_blank')}
                        >
                            <Phone className="h-4 w-4 mr-2" />
                            {language === 'vi' ? 'Gọi' : 'Call'}
                        </Button>
                    )}

                    {tenant.trangThai === 'hoatDong' ? (
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="hover:bg-red-600"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Delete button clicked for tenant:', tenant.maKhach);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? 'Xóa' : 'Delete'}
                                </Button>
                            </DialogTrigger>
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
                    ) : (
                        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="hover:bg-green-600 hover:text-white border-green-500 text-green-600"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Restore button clicked for tenant:', tenant.maKhach);
                                        setRestoreDialogOpen(true);
                                    }}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? 'Khôi phục' : 'Restore'}
                                </Button>
                            </DialogTrigger>
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
                </div>
            </CardContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Card>
    )
}