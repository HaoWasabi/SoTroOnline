"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useToast } from "@/hook/useToast";
import { Plus, Edit, Calendar, Home } from "lucide-react";
import { 
    createUtilityUsage, 
    updateUtilityUsage 
} from "../api/api-utility-usage";
import { currentManagerRoomApi } from "../../QuanLyPhong/api/api-quan-ly-phong";

import type { UtilityUsageRequest, UtilityUsageResponse } from "../types/utility-usage-types";

interface UtilityUsageFormDialogProps {
    utilityUsage?: UtilityUsageResponse;
    onSuccess?: () => void;
    mode?: 'create' | 'edit';
    children?: React.ReactNode;
}

interface Room {
    maPhong: number;
    hoTenQuanLy: string;
    maQuanLy: number;
    tenPhong: string;
    loaiPhong: string;
    diaChi: string;
    chieuDai: number;
    chieuRong: number;
    vatDung: string;
    giaThueCoBan: number;
    trangThai: string;
}

export default function UtilityUsageFormDialog({ 
    utilityUsage, 
    onSuccess, 
    mode = 'create',
    children 
}: UtilityUsageFormDialogProps) {
    const { language } = useLanguageStore();
    const { showSuccess, showError } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);

    const [formData, setFormData] = useState<UtilityUsageRequest>({
        maPhong: utilityUsage?.maPhong || 0,
        thangNam: utilityUsage?.thangNam || new Date().toISOString().slice(0, 7) + '-01',
        chiSoDienCu: utilityUsage?.chiSoDienCu || 0,
        chiSoDienMoi: utilityUsage?.chiSoDienMoi || 0,
        chiSoNuocCu: utilityUsage?.chiSoNuocCu || 0,
        chiSoNuocMoi: utilityUsage?.chiSoNuocMoi || 0,
        trangThai: utilityUsage?.trangThai || 'hoatDong'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load rooms when dialog opens
    useEffect(() => {
        if (open && mode === 'create') {
            loadRooms();
        }
    }, [open, mode]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            if (mode === 'edit' && utilityUsage) {
                setFormData({
                    maPhong: utilityUsage.maPhong,
                    thangNam: utilityUsage.thangNam,
                    chiSoDienCu: utilityUsage.chiSoDienCu,
                    chiSoDienMoi: utilityUsage.chiSoDienMoi,
                    chiSoNuocCu: utilityUsage.chiSoNuocCu,
                    chiSoNuocMoi: utilityUsage.chiSoNuocMoi,
                    trangThai: utilityUsage.trangThai
                });
            } else {
                setFormData({
                    maPhong: 0,
                    thangNam: new Date().toISOString().slice(0, 7) + '-01',
                    chiSoDienCu: 0,
                    chiSoDienMoi: 0,
                    chiSoNuocCu: 0,
                    chiSoNuocMoi: 0,
                    trangThai: 'hoatDong'
                });
            }
            setErrors({});
        }
    }, [open, mode, utilityUsage]);

    const loadRooms = async () => {
        try {
            setIsLoadingRooms(true);
            const response = await currentManagerRoomApi.getAllRoomsActivePaged(0, 1000); // Get all active rooms
            
            if (response.data && Array.isArray(response.data.content)) {
                setRooms(response.data.content);
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            showError(language === 'vi' ? 'Không thể tải danh sách phòng' : 'Failed to load rooms');
        } finally {
            setIsLoadingRooms(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.maPhong) {
            newErrors.maPhong = language === 'vi' ? 'Vui lòng chọn phòng' : 'Please select a room';
        }
        
        if (!formData.thangNam) {
            newErrors.thangNam = language === 'vi' ? 'Vui lòng chọn tháng/năm' : 'Please select month/year';
        }
        
        if (formData.chiSoDienMoi < formData.chiSoDienCu) {
            newErrors.chiSoDienMoi = language === 'vi' ? 'Chỉ số điện mới không thể nhỏ hơn chỉ số cũ' : 'New electricity reading cannot be less than previous reading';
        }
        
        if (formData.chiSoNuocMoi < formData.chiSoNuocCu) {
            newErrors.chiSoNuocMoi = language === 'vi' ? 'Chỉ số nước mới không thể nhỏ hơn chỉ số cũ' : 'New water reading cannot be less than previous reading';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showError(language === 'vi' ? 'Vui lòng kiểm tra lại thông tin' : 'Please check the form data');
            return;
        }

        try {
            setIsSubmitting(true);
            
            if (mode === 'edit' && utilityUsage) {
                await updateUtilityUsage(utilityUsage.id, formData);
                showSuccess(language === 'vi' ? 'Cập nhật thành công' : 'Updated successfully');
            } else {
                await createUtilityUsage(formData);
                showSuccess(language === 'vi' ? 'Thêm mới thành công' : 'Created successfully');
            }
            
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error instanceof Error ? error.message : '';
            
            if (errorMessage.includes('already exists') || errorMessage.includes('đã tồn tại')) {
                showError(language === 'vi' 
                    ? 'Chỉ số điện nước cho phòng này trong tháng đã tồn tại' 
                    : 'Utility readings for this room and month already exist');
            } else {
                showError(language === 'vi' 
                    ? 'Có lỗi xảy ra, vui lòng thử lại' 
                    : 'An error occurred, please try again');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof UtilityUsageRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const getSelectedRoom = () => {
        return rooms.find(room => room.maPhong === formData.maPhong);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Thêm chỉ số' : 'Add Reading'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-6">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 tracking-tight">
                        <div className="relative h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            {mode === 'edit' ? <Edit className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                        </div>
                        {mode === 'edit'
                            ? (language === 'vi' ? 'Chỉnh sửa chỉ số' : 'Edit Utility Reading')
                            : (language === 'vi' ? 'Thêm chỉ số điện nước' : 'Add Utility Reading')
                        }
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-base leading-relaxed ml-13">
                        {mode === 'edit'
                            ? (language === 'vi' ? 'Cập nhật thông tin chỉ số điện nước.' : 'Update utility meter readings.')
                            : (language === 'vi' ? 'Nhập chỉ số điện nước cho phòng.' : 'Enter utility meter readings for the room.')
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Room Selection (only for create mode) */}
                    {mode === 'create' && (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                {language === 'vi' ? 'Phòng' : 'Room'} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.maPhong.toString()}
                                onValueChange={(value) => handleInputChange('maPhong', parseInt(value))}
                                disabled={isLoadingRooms}
                            >
                                <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                                    <SelectValue placeholder={language === 'vi' ? 'Chọn phòng' : 'Select room'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.map((room) => (
                                        <SelectItem key={room.maPhong} value={room.maPhong.toString()}>
                                            {room.tenPhong} ({room.maPhong})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.maPhong && <p className="text-xs text-red-500 font-medium">{errors.maPhong}</p>}
                        </div>
                    )}

                    {/* Selected Room Display (for edit mode) */}
                    {mode === 'edit' && utilityUsage && (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                {language === 'vi' ? 'Phòng' : 'Room'}
                            </Label>
                            <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl">
                                <span className="font-medium text-gray-900">{utilityUsage.tenPhong}</span>
                            </div>
                        </div>
                    )}

                    {/* Month/Year Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {language === 'vi' ? 'Tháng/Năm' : 'Month/Year'} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="month"
                            value={formData.thangNam.slice(0, 7)}
                            onChange={(e) => handleInputChange('thangNam', e.target.value + '-01')}
                            className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        {errors.thangNam && <p className="text-xs text-red-500 font-medium">{errors.thangNam}</p>}
                    </div>

                    {/* Electricity Readings */}
                    <div className="bg-white rounded-xl p-5 border border-yellow-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500"></div>
                            {language === 'vi' ? 'Chỉ số điện' : 'Electricity Readings'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">
                                    {language === 'vi' ? 'Chỉ số cũ' : 'Previous Reading'}
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.chiSoDienCu}
                                    onChange={(e) => handleInputChange('chiSoDienCu', parseInt(e.target.value) || 0)}
                                    className="border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">
                                    {language === 'vi' ? 'Chỉ số mới' : 'Current Reading'}
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.chiSoDienMoi}
                                    onChange={(e) => handleInputChange('chiSoDienMoi', parseInt(e.target.value) || 0)}
                                    className="border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                />
                                {errors.chiSoDienMoi && <p className="text-xs text-red-500 font-medium">{errors.chiSoDienMoi}</p>}
                            </div>
                        </div>
                        {formData.chiSoDienMoi >= formData.chiSoDienCu && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>{language === 'vi' ? 'Tiêu thụ:' : 'Usage:'}</strong> {(formData.chiSoDienMoi - formData.chiSoDienCu).toLocaleString()} kWh
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Water Readings */}
                    <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            {language === 'vi' ? 'Chỉ số nước' : 'Water Readings'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">
                                    {language === 'vi' ? 'Chỉ số cũ' : 'Previous Reading'}
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.chiSoNuocCu}
                                    onChange={(e) => handleInputChange('chiSoNuocCu', parseInt(e.target.value) || 0)}
                                    className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">
                                    {language === 'vi' ? 'Chỉ số mới' : 'Current Reading'}
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.chiSoNuocMoi}
                                    onChange={(e) => handleInputChange('chiSoNuocMoi', parseInt(e.target.value) || 0)}
                                    className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                />
                                {errors.chiSoNuocMoi && <p className="text-xs text-red-500 font-medium">{errors.chiSoNuocMoi}</p>}
                            </div>
                        </div>
                        {formData.chiSoNuocMoi >= formData.chiSoNuocCu && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>{language === 'vi' ? 'Tiêu thụ:' : 'Usage:'}</strong> {(formData.chiSoNuocMoi - formData.chiSoNuocCu).toLocaleString()} m³
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-3 pt-6">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                            className="border-2 border-gray-300 hover:border-gray-400 rounded-xl py-3 font-semibold transition-all duration-200"
                        >
                            {language === 'vi' ? 'Hủy' : 'Cancel'}
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {isSubmitting 
                                ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...')
                                : mode === 'edit'
                                    ? (language === 'vi' ? 'Cập nhật' : 'Update')
                                    : (language === 'vi' ? 'Thêm mới' : 'Create')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}