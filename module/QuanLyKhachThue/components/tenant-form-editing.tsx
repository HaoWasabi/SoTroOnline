

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { updateTenant } from "../api/api-tenant"
import { useState, useEffect, useCallback, useRef } from "react"
import { Tenant } from "../types/Tenant"

interface TenantFormEditingProps {
    tenant: Tenant;
    children: React.ReactNode;
    onUpdate?: () => void;
}

export function TenantFormEditing({ tenant, children, onUpdate }: TenantFormEditingProps) {

    const { language } = useLanguageStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Use useRef to store original values (more performant than useState for comparison)
    const originalValuesRef = useRef({
        hoTen: '',
        maCanCuoc: '',
        dienThoai: '',
        thuongTru: '',
        ngaySinh: ''
    });

    // Initialize original values when dialog opens
    useEffect(() => {
        if (isOpen) {
            originalValuesRef.current = {
                hoTen: tenant.hoTen || '',
                maCanCuoc: tenant.maCanCuoc || '',
                dienThoai: tenant.dienThoai || '',
                thuongTru: tenant.thuongTru || '',
                ngaySinh: tenant.ngaySinh ? new Date(tenant.ngaySinh).toISOString().split('T')[0] : ''
            };
            setHasChanges(false);
        }
    }, [isOpen, tenant]);

    // Optimized change detection with useCallback to prevent unnecessary re-renders
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const originalValue = originalValuesRef.current[name as keyof typeof originalValuesRef.current];
        
        // Quick check: if this specific field changed, enable button immediately
        if (value !== originalValue) {
            if (!hasChanges) {
                setHasChanges(true);
            }
            return;
        }
        
        // If this field matches original, check all other fields
        // Only do full form check when a field reverts to original value
        const form = e.target.form;
        if (form) {
            const formData = new FormData(form);
            const hasAnyChanges = Object.keys(originalValuesRef.current).some(
                key => {
                    const currentValue = formData.get(key) as string || '';
                    const originalValue = originalValuesRef.current[key as keyof typeof originalValuesRef.current];
                    return currentValue !== originalValue;
                }
            );
            
            setHasChanges(hasAnyChanges);
        }
    }, [hasChanges]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tenant.maKhach) return;

        const formData = new FormData(e.currentTarget);
        const updatedData = {
            hoTen: formData.get('hoTen') as string,
            maCanCuoc: formData.get('maCanCuoc') as string,
            dienThoai: formData.get('dienThoai') as string,
            thuongTru: formData.get('thuongTru') as string,
            ngaySinh: formData.get('ngaySinh') as string,
        };

        try {
            setIsUpdating(true);
            await updateTenant(tenant.maKhach, updatedData);
            setIsOpen(false);
            onUpdate?.();
        } catch (error) {
            console.error('Error updating tenant:', error);
            // You can add toast notification here
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                        {language === 'vi' ? 'Chỉnh sửa khách thuê' : 'Edit Tenant'}
                    </DialogTitle>
                    <DialogDescription>
                        {language === 'vi' ? 'Cập nhật thông tin khách thuê của bạn vào biểu mẫu bên dưới.' : 'Update your tenant information in the form below.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <CardContent className="space-y-4">
                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                <Label htmlFor="hoTen">
                                    {language === 'vi' ? 'Họ và tên' : 'Full Name'}
                                </Label>
                                <Input
                                    id="hoTen"
                                    name="hoTen"
                                    placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                                    defaultValue={tenant.hoTen || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maCanCuoc">
                                        {language === 'vi' ? 'Căn cước công dân' : 'ID Card'}
                                    </Label>
                                    <Input
                                        id="maCanCuoc"
                                        name="maCanCuoc"
                                        type="text"
                                        placeholder={language === 'vi' ? '001234567890' : '001234567890'}
                                        defaultValue={tenant.maCanCuoc || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dienThoai">
                                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                                    </Label>
                                    <Input
                                        id="dienThoai"
                                        name="dienThoai"
                                        type="tel"
                                        placeholder={language === 'vi' ? '0123456789' : '+1 (555) 123-4567'}
                                        defaultValue={tenant.dienThoai || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thuongTru">
                                        {language === 'vi' ? 'Địa chỉ thường trú' : 'Permanent Address'}
                                    </Label>
                                    <Input
                                        id="thuongTru"
                                        name="thuongTru"
                                        type="text"
                                        placeholder={language === 'vi' ? '123 An Dương Vương, Hà Nội' : '123 Main Street, City'}
                                        defaultValue={tenant.thuongTru || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-1 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ngaySinh">
                                        {language === 'vi' ? 'Ngày sinh' : 'Date of Birth'}
                                    </Label>
                                    <Input
                                        id="ngaySinh"
                                        name="ngaySinh"
                                        type="date"
                                        defaultValue={tenant.ngaySinh ? new Date(tenant.ngaySinh).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                    
                        </CardContent>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isUpdating || !hasChanges}>
                                {isUpdating 
                                    ? (language === 'vi' ? 'Đang cập nhật...' : 'Updating...') 
                                    : (language === 'vi' ? 'Cập nhật' : 'Update')
                                }
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
