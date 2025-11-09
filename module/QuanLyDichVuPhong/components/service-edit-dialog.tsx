"use client"

import { useState } from "react";
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
        donGiaDien: dichVuData.donGiaDien,
        donGiaNuoc: dichVuData.donGiaNuoc,
        donGiaRac: dichVuData.donGiaRac,
    });

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {language === 'vi' ? 'Chỉnh sửa giá dịch vụ' : 'Edit Service Prices'}
                    </DialogTitle>
                    <DialogDescription>
                        {language === 'vi' 
                            ? 'Cập nhật giá cả cho tất cả các dịch vụ trong hệ thống.'
                            : 'Update prices for all services in the system.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="donGiaDien">
                                {language === 'vi' ? 'Giá điện (VNĐ/kWh)' : 'Electricity Price (VND/kWh)'}
                            </Label>
                            <Input
                                id="donGiaDien"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaDien}
                                onChange={(e) => handleInputChange('donGiaDien', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá điện' : 'Enter electricity price'}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="donGiaNuoc">
                                {language === 'vi' ? 'Giá nước (VNĐ/m³)' : 'Water Price (VND/m³)'}
                            </Label>
                            <Input
                                id="donGiaNuoc"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaNuoc}
                                onChange={(e) => handleInputChange('donGiaNuoc', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá nước' : 'Enter water price'}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="donGiaRac">
                                {language === 'vi' ? 'Giá rác (VNĐ/tháng)' : 'Garbage Price (VND/month)'}
                            </Label>
                            <Input
                                id="donGiaRac"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.donGiaRac}
                                onChange={(e) => handleInputChange('donGiaRac', e.target.value)}
                                placeholder={language === 'vi' ? 'Nhập giá rác' : 'Enter garbage price'}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            {language === 'vi' ? 'Hủy' : 'Cancel'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600"
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