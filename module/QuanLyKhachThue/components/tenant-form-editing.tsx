

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
import { Edit } from "lucide-react"

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

                if (birthDate >= today) {
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
            <DialogContent className="min-w-4xl rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
                <DialogHeader className="space-y-2 pb-4 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Edit className="h-5 w-5 text-white" />
                        </div>
                        {language === 'vi' ? 'Chỉnh sửa khách thuê' : 'Edit Tenant'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 ml-10">
                        {language === 'vi' ? 'Cập nhật thông tin khách thuê của bạn vào biểu mẫu bên dưới.' : 'Update your tenant information in the form below.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-1">
                    <div className="space-y-4">
                        {/* Personal Information Section */}
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 space-y-2">
                                    <Label htmlFor="hoTen" className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                        <span className="text-xs">👤</span>
                                        {language === 'vi' ? 'Họ và tên' : 'Full Name'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="hoTen"
                                        name="hoTen"
                                        placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                                        defaultValue={tenant.hoTen || ''}
                                        onChange={handleInputChange}
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.hoTen 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-blue-200 focus:border-blue-400 bg-blue-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.hoTen && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.hoTen}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100 space-y-2">
                                    <Label htmlFor="maCanCuoc" className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                        <span className="text-xs">🆔</span>
                                        {language === 'vi' ? 'Căn cước công dân' : 'ID Card'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="maCanCuoc"
                                        name="maCanCuoc"
                                        type="text"
                                        placeholder={language === 'vi' ? '001234567890' : '001234567890'}
                                        defaultValue={tenant.maCanCuoc || ''}
                                        onChange={handleInputChange}
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.maCanCuoc 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-emerald-200 focus:border-emerald-400 bg-emerald-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.maCanCuoc && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.maCanCuoc}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 space-y-2">
                                    <Label htmlFor="dienThoai" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                                        <span className="text-xs">📱</span>
                                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="dienThoai"
                                        name="dienThoai"
                                        type="tel"
                                        placeholder={language === 'vi' ? '0123456789' : '+1 (555) 123-4567'}
                                        defaultValue={tenant.dienThoai || ''}
                                        onChange={handleInputChange}
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.dienThoai 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-purple-200 focus:border-purple-400 bg-purple-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.dienThoai && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.dienThoai}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100 space-y-2">
                                    <Label htmlFor="thuongTru" className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                                        <span className="text-xs">🏠</span>
                                        {language === 'vi' ? 'Địa chỉ thường trú' : 'Permanent Address'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="thuongTru"
                                        name="thuongTru"
                                        type="text"
                                        placeholder={language === 'vi' ? '123 An Dương Vương, Hà Nội' : '123 Main Street, City'}
                                        defaultValue={tenant.thuongTru || ''}
                                        onChange={handleInputChange}
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.thuongTru 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-amber-200 focus:border-amber-400 bg-amber-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.thuongTru && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.thuongTru}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Birth Date Section */}
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Thông tin sinh nhật' : 'Birth Information'}
                                </h4>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-4 border border-indigo-100 space-y-2 max-w-md">
                                <Label htmlFor="ngaySinh" className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                                    <span className="text-xs">🎂</span>
                                    {language === 'vi' ? 'Ngày sinh' : 'Date of Birth'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ngaySinh"
                                    name="ngaySinh"
                                    type="date"
                                    defaultValue={tenant.ngaySinh ? new Date(tenant.ngaySinh).toISOString().split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                        validationErrors.ngaySinh 
                                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                            : 'border-indigo-200 focus:border-indigo-400 bg-indigo-50/30'
                                    }`}
                                    required
                                />
                                {validationErrors.ngaySinh && (
                                    <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.ngaySinh}</p>
                                )}
                            </div>
                        </div>
                    </div>
                        <DialogFooter className="gap-3 pt-4 border-t border-gray-100">
                            <Button 
                                variant="outline" 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isUpdating}
                                className="rounded-lg px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 text-sm"
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isUpdating || !hasChanges}
                                className="rounded-lg px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-lg shadow-blue-200 transition-all duration-200 min-w-24 disabled:opacity-50 text-sm"
                            >
                                {isUpdating 
                                    ? (language === 'vi' ? 'Đang cập nhật...' : 'Updating...') 
                                    : (language === 'vi' ? 'Cập nhật khách thuê' : 'Update Tenant')
                                }
                            </Button>
                        </DialogFooter>
                </form>
            </DialogContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Dialog>
    )
}
