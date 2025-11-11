"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Edit, Eye, Trash2, MapPin, Ruler, Package, User, DollarSign, RefreshCw, X, RotateCcw, Building, MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { Room } from "../types/room-types";
import { RoomFormAsDialog } from "./room-form-as-dialog";
import { useToast } from "@/hook/useToast";

interface RoomCardProps {
    room: Room;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function RoomCardComponent({ room, onUpdate, onDelete }: RoomCardProps) {
    const { language } = useLanguageStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const { showSuccess, showError } = useToast();

    // Helper function to get status badge
    const getStatusBadge = () => {
        const statusConfig = {
            'phongTrong': {
                variant: 'default' as const,
                className: 'bg-green-100 text-green-800 hover:bg-green-200',
                text: language === 'vi' ? 'Phòng trống' : 'Available'
            },
            'hoatDong': {
                variant: 'secondary' as const,
                className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                text: language === 'vi' ? 'Đã thuê' : 'Occupied'
            },
            'baoTri': {
                variant: 'destructive' as const,
                className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
                text: language === 'vi' ? 'Bảo trì' : 'Maintenance'
            },
            'daXoa': {
                variant: 'destructive' as const,
                className: 'bg-red-100 text-red-800 hover:bg-red-200',
                text: language === 'vi' ? 'Đã xóa' : 'Deleted'
            }
        };

        const config = statusConfig[room.roomStatus as keyof typeof statusConfig];
        
        if (config) {
            return (
                <Badge variant={config.variant} className={config.className}>
                    {config.text}
                </Badge>
            );
        }

        // Fallback for any unexpected values
        return (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100">
                {room.roomStatus || (language === 'vi' ? 'Không xác định' : 'Unknown')}
            </Badge>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Mock delete function - replace with actual API call
    const deleteRoom = async (roomId: number) => {
        // TODO: Replace with actual API call
        console.log('Deleting room:', roomId);
        return { success: true };
    };

    // Mock restore function - replace with actual API call
    const restoreRoom = async (roomId: number) => {
        // TODO: Replace with actual API call
        console.log('Restoring room:', roomId);
        return { success: true };
    };

    return (
        <Card className="w-full gap-0 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                {room.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>{language === 'vi' ? 'Mã phòng:' : 'Room ID:'} {room.room_id}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {getStatusBadge()}
                        
                        {/* Dropdown Menu for Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>
                                    {language === 'vi' ? 'Thao tác' : 'Actions'}    
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                
                                {/* View Action */}
                                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Building className="h-5 w-5 text-blue-600" />
                                                {language === 'vi' ? 'Chi tiết phòng' : 'Room Details'}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {language === 'vi' ? 'Thông tin chi tiết của phòng' : 'Detailed information about the room'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        {language === 'vi' ? 'Tên phòng' : 'Room Name'}
                                                    </label>
                                                    <p className="text-lg font-semibold">{room.name}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        {language === 'vi' ? 'Mã phòng' : 'Room ID'}
                                                    </label>
                                                    <p className="text-lg font-semibold">#{room.room_id}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    {language === 'vi' ? 'Địa chỉ' : 'Address'}
                                                </label>
                                                <p className="text-gray-700">{room.address}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        {language === 'vi' ? 'Kích thước' : 'Dimensions'}
                                                    </label>
                                                    <p className="text-gray-700">{room.width}m × {room.height}m</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        {language === 'vi' ? 'Diện tích' : 'Area'}
                                                    </label>
                                                    <p className="text-gray-700">{(room.width * room.height).toFixed(1)} m²</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        {language === 'vi' ? 'Giá thuê' : 'Rent Price'}
                                                    </label>
                                                    <p className="text-xl font-bold text-green-600">
                                                        {formatPrice(room.baseRent)} VND
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        {language === 'vi' ? 'Trạng thái' : 'Status'}
                                                    </label>
                                                    <div className="mt-1">
                                                        {getStatusBadge()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                                {language === 'vi' ? 'Đóng' : 'Close'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Edit Action */}
                                <RoomFormAsDialog room={room} onUpdate={onUpdate}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        {language === 'vi' ? 'Chỉnh sửa' : 'Edit Room'}
                                    </DropdownMenuItem>
                                </RoomFormAsDialog>

                                <DropdownMenuSeparator />

                                {/* Delete/Restore Actions */}
                                {room.roomStatus !== 'daXoa' ? (
                                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem 
                                                disabled={true}
                                                onSelect={(e) => e.preventDefault()}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                {language === 'vi' ? 'Xóa phòng' : 'Delete Room'}
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                                    <Trash2 className="h-5 w-5" />
                                                    {language === 'vi' ? 'Xác nhận xóa' : 'Confirm Deletion'}
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-600">
                                                    {language === 'vi' 
                                                        ? `Bạn có chắc chắn muốn xóa phòng "${room.name}"? Phòng sẽ được đánh dấu là đã xóa nhưng dữ liệu vẫn được lưu trữ.`
                                                        : `Are you sure you want to delete room "${room.name}"? The room will be marked as deleted but data will be preserved.`
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
                                ) : (
                                    <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem 
                                                onSelect={(e) => e.preventDefault()}
                                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                {language === 'vi' ? 'Khôi phục phòng' : 'Restore Room'}
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 text-green-600">
                                                    <RotateCcw className="h-5 w-5" />
                                                    {language === 'vi' ? 'Xác nhận khôi phục' : 'Confirm Restoration'}
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-600">
                                                    {language === 'vi' 
                                                        ? `Bạn có chắc chắn muốn khôi phục phòng "${room.name}"? Phòng sẽ trở lại trạng thái hoạt động.`
                                                        : `Are you sure you want to restore room "${room.name}"? The room will be returned to active status.`
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
                                                        if (!room.room_id) {
                                                            showError(language === 'vi' ? 'Không thể khôi phục: Thiếu ID phòng' : 'Cannot restore: Missing room ID');
                                                            return;
                                                        }
                                                        
                                                        try {
                                                            setIsRestoring(true);
                                                            console.log('Attempting to restore room with ID:', room.room_id);
                                                            
                                                            const result = await restoreRoom(room.room_id);
                                                            console.log('Restore result:', result);
                                                            
                                                            if (result.success) {
                                                                showSuccess(
                                                                    language === 'vi' 
                                                                        ? 'Khôi phục phòng thành công!' 
                                                                        : 'Room restored successfully!'
                                                                );
                                                                setRestoreDialogOpen(false);
                                                                onUpdate?.(); // Refresh the list to show updated status
                                                            } else {
                                                                showError(language === 'vi' ? 'Khôi phục thất bại' : 'Restore failed');
                                                            }
                                                        } catch (error) {
                                                            console.error('Error restoring room:', error);
                                                            showError(
                                                                language === 'vi' 
                                                                    ? 'Có lỗi xảy ra khi khôi phục phòng. Vui lòng thử lại.' 
                                                                    : 'An error occurred while restoring the room. Please try again.'
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-2 pt-0">
                {/* Price Information */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-green-700">
                                {formatPrice(room.baseRent)} VND
                            </span>
                            <span className="text-xs text-green-600">
                                {language === 'vi' ? 'Giá thuê cơ bản/tháng' : 'Base rent/month'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Room Information */}
                <div className="space-y-2">
                    {room.address && (
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <span className="text-gray-500 block">
                                    {language === 'vi' ? 'Địa chỉ:' : 'Address:'}
                                </span>
                                <span className="text-gray-700">
                                    {room.address}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                        <Ruler className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">
                            {language === 'vi' ? 'Kích thước:' : 'Dimensions:'}
                        </span>
                        <span className="text-gray-700 font-medium">
                            {room.width}m × {room.height}m ({(room.width * room.height).toFixed(1)} m²)
                        </span>
                    </div>
                    
                    {room.typeOfRoom && (
                        <div className="flex items-center gap-2 text-sm">
                            <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-500">
                                {language === 'vi' ? 'Loại phòng:' : 'Room type:'}
                            </span>
                            <span className="text-gray-700">
                                {room.typeOfRoom}
                            </span>
                        </div>
                    )}

                    {room.managerName && (
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-500">
                                {language === 'vi' ? 'Quản lý:' : 'Manager:'}
                            </span>
                            <span className="text-gray-700">
                                {room.managerName}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {/* View Button */}
                    {/* <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Xem' : 'View'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-blue-600" />
                                    {language === 'vi' ? 'Chi tiết phòng' : 'Room Details'}
                                </DialogTitle>
                                <DialogDescription>
                                    {language === 'vi' ? 'Thông tin chi tiết của phòng' : 'Detailed information about the room'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {language === 'vi' ? 'Tên phòng' : 'Room Name'}
                                        </label>
                                        <p className="text-lg font-semibold">{room.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {language === 'vi' ? 'Mã phòng' : 'Room ID'}
                                        </label>
                                        <p className="text-lg font-semibold">{room.room_id}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        {language === 'vi' ? 'Địa chỉ' : 'Address'}
                                    </label>
                                    <p className="text-gray-700">{room.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {language === 'vi' ? 'Kích thước' : 'Dimensions'}
                                        </label>
                                        <p className="text-gray-700">{room.width}m × {room.height}m</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {language === 'vi' ? 'Diện tích' : 'Area'}
                                        </label>
                                        <p className="text-gray-700">{(room.width * room.height).toFixed(1)} m²</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {language === 'vi' ? 'Giá thuê' : 'Rent Price'}
                                        </label>
                                        <p className="text-xl font-bold text-green-600">
                                            {formatPrice(room.baseRent)} VND
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            {language === 'vi' ? 'Trạng thái' : 'Status'}
                                        </label>
                                        <div className="mt-1">
                                            {getStatusBadge()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                    {language === 'vi' ? 'Đóng' : 'Close'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> */}

                    {/* Edit Button using RoomFormAsDialog */}
                    {/* <RoomFormAsDialog room={room} onUpdate={onUpdate}>
                        <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                        </Button>
                    </RoomFormAsDialog> */}

                    {/* Delete/Restore Button */}
                    {/* {room.roomStatus !== 'daXoa' ? (
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="hover:bg-red-600"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Delete button clicked for room:', room.room_id);
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
                                            ? `Bạn có chắc chắn muốn xóa phòng "${room.name}"? Phòng sẽ được đánh dấu là đã xóa nhưng dữ liệu vẫn được lưu trữ.`
                                            : `Are you sure you want to delete room "${room.name}"? The room will be marked as deleted but data will be preserved.`
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
                    ) : (
                        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="hover:bg-green-600 hover:text-white border-green-500 text-green-600"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Restore button clicked for room:', room.room_id);
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
                                            ? `Bạn có chắc chắn muốn khôi phục phòng "${room.name}"? Phòng sẽ trở lại trạng thái hoạt động.`
                                            : `Are you sure you want to restore room "${room.name}"? The room will be returned to active status.`
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
                                            if (!room.room_id) {
                                                showError(language === 'vi' ? 'Không thể khôi phục: Thiếu ID phòng' : 'Cannot restore: Missing room ID');
                                                return;
                                            }
                                            
                                            try {
                                                setIsRestoring(true);
                                                console.log('Attempting to restore room with ID:', room.room_id);
                                                
                                                const result = await restoreRoom(room.room_id);
                                                console.log('Restore result:', result);
                                                
                                                if (result.success) {
                                                    showSuccess(
                                                        language === 'vi' 
                                                            ? 'Khôi phục phòng thành công!' 
                                                            : 'Room restored successfully!'
                                                    );
                                                    setRestoreDialogOpen(false);
                                                    onUpdate?.(); // Refresh the list to show updated status
                                                } else {
                                                    showError(language === 'vi' ? 'Khôi phục thất bại' : 'Restore failed');
                                                }
                                            } catch (error) {
                                                console.error('Error restoring room:', error);
                                                showError(
                                                    language === 'vi' 
                                                        ? 'Có lỗi xảy ra khi khôi phục phòng. Vui lòng thử lại.' 
                                                        : 'An error occurred while restoring the room. Please try again.'
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
                    )} */}
                </div>
            </CardContent>
        </Card>
    );
}