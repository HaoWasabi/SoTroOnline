"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";
import { Edit, Eye, Trash2, MapPin, Ruler, Package, User, DollarSign, Building, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Room } from "../types/room-types";
import { RoomFormAsDialog } from "./room-form-as-dialog";
import { useToast } from "@/hook/useToast";
import { roomApi } from "../api/api-quan-ly-phong";


interface RoomCardProps {
    room: Room;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function RoomCardComponent({ room, onUpdate, onDelete }: RoomCardProps) {
    const { language } = useLanguageStore();
    const { taiKhoan } = useTaiKhoanStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const { showSuccess, showError } = useToast();

    // Helper function to get manager information
    const getManagerInfo = () => {
        // Debug logging to understand the data structure
        console.log('Room data:', { 
            managerName: room.managerName, 
            managerId: room.managerId,
            fullRoom: room 
        });
        
        // First, try to use room's manager data if available
        if (room.managerName && room.managerName.trim() !== '') {
            return {
                name: room.managerName.trim(),
                id: room.managerId || null
            };
        }
        
        // If only manager ID is available, try to use it with current user context
        if (room.managerId && taiKhoan && room.managerId === taiKhoan.maTaiKhoan) {
            return {
                name: taiKhoan.hoTen || 'Current Manager',
                id: room.managerId
            };
        }
        
        // If we have manager ID but no name, show the ID
        if (room.managerId) {
            return {
                name: `Manager #${room.managerId}`,
                id: room.managerId
            };
        }
        
        // Final fallback to current user if in SAAS environment
        if (taiKhoan) {
            return {
                name: taiKhoan.hoTen || 'Current Manager',
                id: taiKhoan.maTaiKhoan || null
            };
        }
        
        return {
            name: 'Unknown Manager',
            id: null
        };
    };

    // Helper function to get status badge
    const getStatusBadge = () => {
        const statusConfig = {
            'phongTrong': {
                variant: 'default' as const,
                className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-green-200',
                text: language === 'vi' ? 'Phòng trống' : 'Available',
                icon: <div className="w-2 h-2 rounded-full bg-white/80 mr-1"></div>
            },
            'hoatDong': {
                variant: 'secondary' as const,
                className: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-blue-200',
                text: language === 'vi' ? 'Đã thuê' : 'Occupied',
                icon: <div className="w-2 h-2 rounded-full bg-white/80 mr-1"></div>
            },
            'baoTri': {
                variant: 'destructive' as const,
                className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-orange-200',
                text: language === 'vi' ? 'Bảo trì' : 'Maintenance',
                icon: <div className="w-2 h-2 rounded-full bg-white/60 mr-1"></div>
            }
        };

        const config = statusConfig[room.roomStatus as keyof typeof statusConfig];
        
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

        // Fallback for any unexpected values
        return (
            <Badge variant="outline" className="bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                {room.roomStatus || (language === 'vi' ? 'Không xác định' : 'Unknown')}
            </Badge>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Helper function to translate room type
    const translateRoomType = (roomType: string) => {
        const roomTypeTranslations: { [key: string]: { vi: string; en: string } } = {
            'Phòng trống': {
                vi: 'Phòng trống',
                en: 'Available'
            },
            'Phòng có nội thất': {
                vi: 'Phòng có nội thất',
                en: 'Furnished'
            }
        };

        const translation = roomTypeTranslations[roomType];
        if (translation) {
            return language === 'vi' ? translation.vi : translation.en;
        }
        
        // Fallback: return the original value if no translation found
        return roomType;
    };

    // Delete room function using actual API
    const deleteRoom = async (roomId: number) => {
        try {
            const response = await roomApi.deleteRoom(roomId);
            return { success: response.message === "success" || true };
        } catch (error) {
            console.error('Error deleting room:', error);
            throw error;
        }
    };

    return (
        <>
            <Card className="w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                    <Building className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                    {room.name}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 ml-10">
                                <Package className="h-4 w-4" />
                                <span>{language === 'vi' ? 'Mã phòng:' : 'Room ID:'} {room.room_id}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {getStatusBadge()}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0">
                    {/* Summary Information */}
                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            <h4 className="font-bold text-sm text-gray-900">
                                {language === 'vi' ? 'Thông tin tóm tắt' : 'Summary Information'}
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Price Display */}
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100">
                                <div className="flex items-center gap-2 text-xs">
                                    <DollarSign className="h-3 w-3 text-emerald-600" />
                                    <span className="text-emerald-600 font-medium">
                                        {language === 'vi' ? 'Giá thuê:' : 'Rent:'}
                                    </span>
                                    <span className="text-emerald-800 font-semibold">
                                        {formatPrice(room.baseRent)} VND
                                    </span>
                                </div>
                            </div>
                            
                            {/* Dimensions Display */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                                <div className="flex items-center gap-2 text-xs">
                                    <Ruler className="h-3 w-3 text-purple-600" />
                                    <span className="text-purple-600 font-medium">
                                        {language === 'vi' ? 'Kích thước:' : 'Size:'}
                                    </span>
                                    <span className="text-purple-800 font-semibold">
                                        {(room.width * room.height).toFixed(1)} m²
                                    </span>
                                </div>
                            </div>
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
                                {/* View Details Button */}
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setViewDialogOpen(true)}
                                    className="rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-medium transition-all duration-200"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                                </Button>

                                {/* Actions Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>
                                            {language === 'vi' ? 'Thao tác' : 'Actions'}    
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        
                                        {/* Edit Action */}
                                        <RoomFormAsDialog room={room} onUpdate={onUpdate}>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                {language === 'vi' ? 'Chỉnh sửa' : 'Edit Room'}
                                            </DropdownMenuItem>
                                        </RoomFormAsDialog>

                                        <DropdownMenuSeparator />

                                        {/* Delete Action */}
                                        <DropdownMenuItem 
                                            onClick={() => setDeleteDialogOpen(true)}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {language === 'vi' ? 'Xóa phòng' : 'Delete Room'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* View Details Dialog - Moved outside of Card */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-4xl rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="space-y-2 pb-4 border-b border-gray-100">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <Building className="h-5 w-5 text-white" />
                            </div>
                            {room.name}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600 ml-10">
                            {language === 'vi' ? 'Thông tin chi tiết của phòng' : 'Detailed room information'}
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
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <Building className="h-4 w-4 text-blue-600" />
                                        <span className="text-blue-600 font-medium">
                                            {language === 'vi' ? 'Mã phòng:' : 'Room ID:'}
                                        </span>
                                    </div>
                                    <span className="text-blue-800 font-bold text-lg">
                                        {room.room_id}
                                    </span>
                                </div>
                                
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <Package className="h-4 w-4 text-emerald-600" />
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

                        {/* Location & Type */}
                        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Vị trí & Loại phòng' : 'Location & Room Type'}
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {room.address && (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <MapPin className="h-4 w-4 text-purple-600" />
                                            <span className="text-purple-600 font-medium">
                                                {language === 'vi' ? 'Địa chỉ:' : 'Address:'}
                                            </span>
                                        </div>
                                        <span className="text-purple-800 font-bold text-lg">
                                            {room.address}
                                        </span>
                                    </div>
                                )}
                                
                                {room.typeOfRoom && (
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Package className="h-4 w-4 text-amber-600" />
                                            <span className="text-amber-600 font-medium">
                                                {language === 'vi' ? 'Loại phòng:' : 'Room Type:'}
                                            </span>
                                        </div>
                                        <span className="text-amber-800 font-bold text-lg">
                                            {translateRoomType(room.typeOfRoom)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dimensions & Pricing */}
                        <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Kích thước & Giá cả' : 'Dimensions & Pricing'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <Ruler className="h-4 w-4 text-cyan-600" />
                                        <span className="text-cyan-600 font-medium">
                                            {language === 'vi' ? 'Kích thước:' : 'Dimensions:'}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-cyan-800 font-bold text-lg block">
                                            {room.width}m × {room.height}m
                                        </span>
                                        <span className="text-cyan-600 text-sm">
                                            ({(room.width * room.height).toFixed(1)} m²)
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                        <span className="text-emerald-600 font-medium">
                                            {language === 'vi' ? 'Giá thuê:' : 'Rent Price:'}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-emerald-800 font-bold text-lg block">
                                            {formatPrice(room.baseRent)} VND
                                        </span>
                                        <span className="text-emerald-600 text-sm">
                                            {language === 'vi' ? 'mỗi tháng' : 'per month'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manager Information Section */}
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
                                        {getManagerInfo().name}
                                    </span>
                                </div>
                                
                                {getManagerInfo().id && (
                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <Package className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-500 font-medium">
                                                {language === 'vi' ? 'Mã quản lý:' : 'Manager ID:'}
                                            </span>
                                        </div>
                                        <span className="text-gray-700 font-bold text-lg">
                                            {getManagerInfo().id}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Room Items Section */}
                        {room.furnitures && room.furnitures.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                                    <h4 className="font-bold text-lg text-gray-900">
                                        {language === 'vi' ? 'Vật dụng trong phòng' : 'Room Items'}
                                    </h4>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                                    <span className="text-orange-800 font-medium">
                                        {Array.isArray(room.furnitures) ? room.furnitures.join(', ') : room.furnitures}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t border-gray-100 pt-4">
                        <Button 
                            onClick={() => setViewDialogOpen(false)}
                            className="rounded-xl px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
                        >
                            {language === 'vi' ? 'Đóng' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            {language === 'vi' ? 'Xác nhận xóa' : 'Confirm Deletion'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                            {language === 'vi' 
                                ? `Bạn có chắc chắn muốn xóa vĩnh viễn phòng "${room.name}"? Hành động này không thể hoàn tác.`
                                : `Are you sure you want to permanently delete room "${room.name}"? This action cannot be undone.`
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
                                if (!room.room_id) {
                                    showError(language === 'vi' ? 'Không thể xóa: Thiếu ID phòng' : 'Cannot delete: Missing room ID');
                                    return;
                                }
                                
                                try {
                                    setIsDeleting(true);
                                    console.log('Attempting to delete room with ID:', room.room_id);
                                    
                                    const result = await deleteRoom(room.room_id);
                                    console.log('Delete result:', result);
                                    
                                    if (result.success) {
                                        showSuccess(
                                            language === 'vi' 
                                                ? 'Xóa phòng thành công!' 
                                                : 'Room deleted successfully!'
                                        );
                                        setDeleteDialogOpen(false);
                                        onDelete?.();
                                    } else {
                                        showError(language === 'vi' ? 'Xóa thất bại' : 'Delete failed');
                                    }
                                } catch (error) {
                                    console.error('Error deleting room:', error);
                                    showError(
                                        language === 'vi' 
                                            ? 'Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.' 
                                            : 'An error occurred while deleting the room. Please try again.'
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
        </>
    );
}