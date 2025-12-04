"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { DichVuResponse, DichVuRequest } from "../types/dich-vu-types";
import { updateDichVuApi } from "../api/api-quan-ly-dich-vu-phong";
import { useToast } from "@/hook/useToast";

interface ServiceEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dichVuData: DichVuResponse;
    onUpdateSuccess: () => void;
}

export default function ServiceEditDialog({ 
    open, 
    onOpenChange, 
    dichVuData, 
    onUpdateSuccess 
}: ServiceEditDialogProps) {
    const { language } = useLanguageStore();
    const { showError, showSuccess } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<DichVuRequest>({
        donGiaDien: dichVuData.donGiaDien || 0,
        donGiaNuoc: dichVuData.donGiaNuoc || 0,
        donGiaRac: dichVuData.donGiaRac || 0,
        donGiaWifi: dichVuData.donGiaWifi || 0,
        donGiaCap: dichVuData.donGiaCap || 0,
        donGiaKhac: dichVuData.donGiaKhac || 0,
    });

    // Reset form data when dialog opens with new data
    useEffect(() => {
        if (open) {
            setFormData({
                donGiaDien: dichVuData.donGiaDien || 0,
                donGiaNuoc: dichVuData.donGiaNuoc || 0,
                donGiaRac: dichVuData.donGiaRac || 0,
                donGiaWifi: dichVuData.donGiaWifi || 0,
                donGiaCap: dichVuData.donGiaCap || 0,
                donGiaKhac: dichVuData.donGiaKhac || 0,
            });
        }
    }, [open, dichVuData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await updateDichVuApi(dichVuData.maDichVu, formData);
            
            if (result.status === 200) {
                showSuccess(language === 'vi' ? 'Cập nhật dịch vụ thành công' : 'Service updated successfully');
                onUpdateSuccess();
                onOpenChange(false);
            } else {
                showError(result.message || (language === 'vi' ? 'Cập nhật thất bại' : 'Update failed'));
            }
        } catch (error) {
            console.error('Error updating service:', error);
            showError(language === 'vi' ? 'Có lỗi xảy ra khi cập nhật dịch vụ' : 'Error updating service');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof DichVuRequest, value: string) => {
        const numericValue = parseFloat(value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: numericValue
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                        {language === 'vi' ? 'Chỉnh sửa giá dịch vụ' : 'Edit Service Prices'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        {language === 'vi' 
                            ? 'Cập nhật giá cả cho tất cả các dịch vụ trong hệ thống.'
                            : 'Update prices for all services in the system.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Electricity Service */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100 space-y-3">
                            <Label htmlFor="donGiaDien" className="flex items-center gap-2 text-sm font-semibold text-yellow-700">
                                ⚡ {language === 'vi' ? 'Giá điện (VNĐ/kWh)' : 'Electricity Price (VND/kWh)'}
                            </Label>
                            <Input
                                id="donGiaDien"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaDien}
                                onChange={(e) => handleInputChange('donGiaDien', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá điện' : 'Enter electricity price'}
                                className="border-yellow-200 focus:border-yellow-400 bg-yellow-50/30"
                                required
                            />
                        </div>

                        {/* Water Service */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 space-y-3">
                            <Label htmlFor="donGiaNuoc" className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                                💧 {language === 'vi' ? 'Giá nước (VNĐ/m³)' : 'Water Price (VND/m³)'}
                            </Label>
                            <Input
                                id="donGiaNuoc"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaNuoc}
                                onChange={(e) => handleInputChange('donGiaNuoc', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá nước' : 'Enter water price'}
                                className="border-blue-200 focus:border-blue-400 bg-blue-50/30"
                                required
                            />
                        </div>

                        {/* WiFi Service */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100 space-y-3">
                            <Label htmlFor="donGiaWifi" className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                                📶 {language === 'vi' ? 'Giá WiFi (VNĐ/tháng)' : 'WiFi Price (VND/month)'}
                            </Label>
                            <Input
                                id="donGiaWifi"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaWifi}
                                onChange={(e) => handleInputChange('donGiaWifi', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá WiFi' : 'Enter WiFi price'}
                                className="border-purple-200 focus:border-purple-400 bg-purple-50/30"
                                required
                            />
                        </div>

                        {/* Cable TV Service */}
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100 space-y-3">
                            <Label htmlFor="donGiaCap" className="flex items-center gap-2 text-sm font-semibold text-pink-700">
                                📺 {language === 'vi' ? 'Giá truyền hình (VNĐ/tháng)' : 'Cable TV Price (VND/month)'}
                            </Label>
                            <Input
                                id="donGiaCap"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaCap}
                                onChange={(e) => handleInputChange('donGiaCap', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá truyền hình' : 'Enter cable TV price'}
                                className="border-pink-200 focus:border-pink-400 bg-pink-50/30"
                                required
                            />
                        </div>

                        {/* Garbage Service */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 space-y-3">
                            <Label htmlFor="donGiaRac" className="flex items-center gap-2 text-sm font-semibold text-green-700">
                                🗑️ {language === 'vi' ? 'Giá rác (VNĐ/tháng)' : 'Garbage Price (VND/month)'}
                            </Label>
                            <Input
                                id="donGiaRac"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaRac}
                                onChange={(e) => handleInputChange('donGiaRac', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá rác' : 'Enter garbage price'}
                                className="border-green-200 focus:border-green-400 bg-green-50/30"
                                required
                            />
                        </div>

                        {/* Other Services */}
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100 space-y-3">
                            <Label htmlFor="donGiaKhac" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                ⚙️ {language === 'vi' ? 'Dịch vụ khác (VNĐ/tháng)' : 'Other Services (VND/month)'}
                            </Label>
                            <Input
                                id="donGiaKhac"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaKhac}
                                onChange={(e) => handleInputChange('donGiaKhac', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá dịch vụ khác' : 'Enter other services price'}
                                className="border-gray-200 focus:border-gray-400 bg-gray-50/30"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="rounded-xl px-6 py-2"
                        >
                            {language === 'vi' ? 'Hủy' : 'Cancel'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
                        >
                            {isSubmitting 
                                ? (language === 'vi' ? 'Đang cập nhật...' : 'Updating...')
                                : (language === 'vi' ? 'Cập nhật' : 'Update')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}