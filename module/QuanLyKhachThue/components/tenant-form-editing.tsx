

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
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

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
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { toast, showSuccess, showError, removeToast } = useToast();
    
    // Use useRef to store original values (more performant than useState for comparison)
    const originalValuesRef = useRef({
        hoTen: '',
        maCanCuoc: '',
        dienThoai: '',
        thuongTru: '',
        ngaySinh: ''
    });

    // Validation functions
    const validateField = (name: string, value: string): string | null => {
        switch (name) {
            case 'hoTen':
                if (!value.trim()) {
                    return language === 'vi' ? 'Họ và tên là bắt buộc' : 'Full name is required';
                }
                if (value.trim().length < 2) {
                    return language === 'vi' ? 'Họ và tên phải có ít nhất 2 ký tự' : 'Full name must be at least 2 characters';
                }
                break;
            case 'maCanCuoc':
                if (!value.trim()) {
                    return language === 'vi' ? 'Số CCCD là bắt buộc' : 'ID card number is required';
                }
                if (!/^\d{12}$/.test(value.trim())) {
                    return language === 'vi' ? 'Số CCCD phải có 12 chữ số' : 'ID card must be 12 digits';
                }
                break;
            case 'dienThoai':
                if (!value.trim()) {
                    return language === 'vi' ? 'Số điện thoại là bắt buộc' : 'Phone number is required';
                }
                if (!/^[0-9]{10,11}$/.test(value.trim())) {
                    return language === 'vi' ? 'Số điện thoại phải có 10-11 chữ số' : 'Phone number must be 10-11 digits';
                }
                break;
            case 'thuongTru':
                if (!value.trim()) {
                    return language === 'vi' ? 'Địa chỉ thường trú là bắt buộc' : 'Permanent address is required';
                }
                if (value.trim().length < 10) {
                    return language === 'vi' ? 'Địa chỉ phải có ít nhất 10 ký tự' : 'Address must be at least 10 characters';
                }
                break;
            case 'ngaySinh':
                if (!value) {
                    return language === 'vi' ? 'Ngày sinh là bắt buộc' : 'Date of birth is required';
                }
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 18) {
                    return language === 'vi' ? 'Tuổi phải từ 18 trở lên' : 'Must be at least 18 years old';
                }
                if (age > 100) {
                    return language === 'vi' ? 'Ngày sinh không hợp lệ' : 'Invalid date of birth';
                }
                break;
        }
        return null;
    };

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
            setValidationErrors({});
        }
    }, [isOpen, tenant]);

    // Optimized change detection with useCallback to prevent unnecessary re-renders
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const originalValue = originalValuesRef.current[name as keyof typeof originalValuesRef.current];
        
        // Validate the field
        const error = validateField(name, value);
        setValidationErrors(prev => ({
            ...prev,
            [name]: error || ''
        }));
        
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
    }, [hasChanges, validateField]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tenant.maKhach) {
            showError(language === 'vi' ? 'Không thể cập nhật: Thiếu ID khách thuê' : 'Cannot update: Missing tenant ID');
            return;
        }

        const formData = new FormData(e.currentTarget);
        const updatedData = {
            hoTen: formData.get('hoTen') as string,
            maCanCuoc: formData.get('maCanCuoc') as string,
            dienThoai: formData.get('dienThoai') as string,
            thuongTru: formData.get('thuongTru') as string,
            ngaySinh: formData.get('ngaySinh') as string,
        };

        // Validate all fields
        const errors: Record<string, string> = {};
        Object.keys(updatedData).forEach(key => {
            const error = validateField(key, updatedData[key as keyof typeof updatedData] as string);
            if (error) {
                errors[key] = error;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showError(
                language === 'vi' 
                    ? 'Vui lòng kiểm tra lại thông tin đã nhập.' 
                    : 'Please check the information entered.'
            );
            return;
        }

        // Clear validation errors if all fields are valid
        setValidationErrors({});

        try {
            setIsUpdating(true);
            console.log('Attempting to update tenant with ID:', tenant.maKhach, 'Data:', updatedData);
            
            const result = await updateTenant(tenant.maKhach, updatedData);
            console.log('Update result:', result);
            
            if (result.success || (result.status && result.status >= 200 && result.status < 300)) {
                showSuccess(
                    language === 'vi' 
                        ? 'Cập nhật khách thuê thành công!' 
                        : 'Tenant updated successfully!'
                );
                setIsOpen(false);
                setHasChanges(false);
                setValidationErrors({});
                onUpdate?.();
            } else {
                // Handle API validation errors
                if (result.message) {
                    if (result.message.includes('Duplicate') || result.message.includes('trùng')) {
                        setValidationErrors({ maCanCuoc: language === 'vi' ? 'Số CCCD đã tồn tại' : 'ID card already exists' });
                    }
                    showError(result.message);
                } else {
                    showError(language === 'vi' ? 'Cập nhật thất bại' : 'Update failed');
                }
            }
        } catch (error) {
            console.error('Error updating tenant:', error);
            
            // Parse error response for specific validation errors
            if (error instanceof Error) {
                const errorMessage = error.message;
                if (errorMessage.includes('Duplicate') || errorMessage.includes('trùng')) {
                    setValidationErrors({ maCanCuoc: language === 'vi' ? 'Số CCCD đã tồn tại' : 'ID card already exists' });
                }
            }
            
            showError(
                language === 'vi' 
                    ? 'Có lỗi xảy ra khi cập nhật khách thuê. Vui lòng thử lại.' 
                    : 'An error occurred while updating the tenant. Please try again.'
            );
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
                                    {language === 'vi' ? 'Họ và tên' : 'Full Name'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="hoTen"
                                    name="hoTen"
                                    placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                                    defaultValue={tenant.hoTen || ''}
                                    onChange={handleInputChange}
                                    className={validationErrors.hoTen ? 'border-red-500 focus:ring-red-500' : ''}
                                    required
                                />
                                {validationErrors.hoTen && (
                                    <p className="text-sm text-red-500 mt-1">{validationErrors.hoTen}</p>
                                )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maCanCuoc">
                                        {language === 'vi' ? 'Căn cước công dân' : 'ID Card'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="maCanCuoc"
                                        name="maCanCuoc"
                                        type="text"
                                        placeholder={language === 'vi' ? '001234567890' : '001234567890'}
                                        defaultValue={tenant.maCanCuoc || ''}
                                        onChange={handleInputChange}
                                        className={validationErrors.maCanCuoc ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    {validationErrors.maCanCuoc && (
                                        <p className="text-sm text-red-500 mt-1">{validationErrors.maCanCuoc}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dienThoai">
                                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="dienThoai"
                                        name="dienThoai"
                                        type="tel"
                                        placeholder={language === 'vi' ? '0123456789' : '+1 (555) 123-4567'}
                                        defaultValue={tenant.dienThoai || ''}
                                        onChange={handleInputChange}
                                        className={validationErrors.dienThoai ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    {validationErrors.dienThoai && (
                                        <p className="text-sm text-red-500 mt-1">{validationErrors.dienThoai}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thuongTru">
                                        {language === 'vi' ? 'Địa chỉ thường trú' : 'Permanent Address'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="thuongTru"
                                        name="thuongTru"
                                        type="text"
                                        placeholder={language === 'vi' ? '123 An Dương Vương, Hà Nội' : '123 Main Street, City'}
                                        defaultValue={tenant.thuongTru || ''}
                                        onChange={handleInputChange}
                                        className={validationErrors.thuongTru ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    {validationErrors.thuongTru && (
                                        <p className="text-sm text-red-500 mt-1">{validationErrors.thuongTru}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-1 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ngaySinh">
                                        {language === 'vi' ? 'Ngày sinh' : 'Date of Birth'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="ngaySinh"
                                        name="ngaySinh"
                                        type="date"
                                        defaultValue={tenant.ngaySinh ? new Date(tenant.ngaySinh).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                        className={validationErrors.ngaySinh ? 'border-red-500 focus:ring-red-500' : ''}
                                        required
                                    />
                                    {validationErrors.ngaySinh && (
                                        <p className="text-sm text-red-500 mt-1">{validationErrors.ngaySinh}</p>
                                    )}
                                </div>
                            </div>
                    
                        </CardContent>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isUpdating}
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isUpdating || !hasChanges}
                                className="min-w-24"
                            >
                                {isUpdating 
                                    ? (language === 'vi' ? 'Đang cập nhật...' : 'Updating...') 
                                    : (language === 'vi' ? 'Cập nhật' : 'Update')
                                }
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Dialog>
    )
}
