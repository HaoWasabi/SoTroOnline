
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
import { createTenant, getCurrentManagerId } from "../api/api-tenant"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { Plus } from "lucide-react"
import { useState } from "react"

interface TenantFormProps {
    onSuccess?: () => void;
}

export function TenantForm({ onSuccess }: TenantFormProps) {

    const { language } = useLanguageStore();
    const { toast, showSuccess, showError, removeToast } = useToast();
    const [isCreating, setIsCreating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
            case 'email':
                if (value && value.trim()) {
                    const emailPattern = /^[A-Za-z0-9+_.-]+@(.+)$/;
                    if (!emailPattern.test(value.trim())) {
                        return language === 'vi' ? 'Định dạng email không hợp lệ' : 'Invalid email format';
                    }
                }
                break;
        }
        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        
        setValidationErrors(prev => ({
            ...prev,
            [name]: error || ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        // Get current manager ID for SAAS multi-tenant support
        const currentManagerId = getCurrentManagerId();
        
        const tenantData = {
            maKhachDaiDien: `KT${Date.now()}`, // Generate a representative code
            maCanCuoc: formData.get('maCanCuoc') as string,
            hoTen: formData.get('hoTen') as string,
            thuongTru: formData.get('thuongTru') as string,
            ngaySinh: formData.get('ngaySinh') as string,
            ngayTao: new Date().toISOString(), // Current date
            trangThai: 'hoatDong', // Default status
            dienThoai: formData.get('dienThoai') as string,
            email: formData.get('email') as string,
            maNguoiQuanLy: currentManagerId || undefined, // Add manager ID for SAAS support
        };

        // Validate all fields
        const errors: Record<string, string> = {};
        Object.keys(tenantData).forEach(key => {
            if (key !== 'maKhach' && key !== 'maKhachDaiDien' && key !== 'ngayTao' && key !== 'trangThai' && key !== 'maNguoiQuanLy') {
                const error = validateField(key, tenantData[key as keyof typeof tenantData] as string);
                if (error) {
                    errors[key] = error;
                }
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
            setIsCreating(true);
            // Manager ID is already included in tenantData
            const result = await createTenant(tenantData);
            
            // Handle different response formats
            if (result.success || (result.status && result.status >= 200 && result.status < 300)) {
                // Show success message
                showSuccess(
                    language === 'vi' 
                        ? 'Tạo khách thuê thành công!' 
                        : 'Tenant created successfully!'
                );
                
                // Close dialog and reset form
                setIsOpen(false);
                (e.target as HTMLFormElement).reset();
                setValidationErrors({});
                
                // Call onSuccess callback to refresh the tenant list
                onSuccess?.();
            } else {
                // Handle API validation errors
                if (result.message) {
                    if (result.message.includes('Duplicate') || result.message.includes('trùng')) {
                        setValidationErrors({ maCanCuoc: language === 'vi' ? 'Số CCCD đã tồn tại' : 'ID card already exists' });
                    }
                    showError(result.message);
                } else {
                    showError(language === 'vi' ? 'Tạo thất bại' : 'Creation failed');
                }
            }
        } catch (error) {
            console.error('Error creating tenant:', error);
            
            // Parse error response for specific validation errors
            if (error instanceof Error) {
                const errorMessage = error.message;
                if (errorMessage.includes('Duplicate') || errorMessage.includes('trùng')) {
                    setValidationErrors({ maCanCuoc: language === 'vi' ? 'Số CCCD đã tồn tại' : 'ID card already exists' });
                }
            }
            
            // Show error message
            showError(
                language === 'vi' 
                    ? 'Có lỗi xảy ra khi tạo khách thuê. Vui lòng thử lại.' 
                    : 'An error occurred while creating the tenant. Please try again.'
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'vi' ? 'Thêm khách thuê' : 'Add Tenant'}
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 backdrop-blur-sm max-h-[85vh] overflow-y-auto">
                <DialogHeader className="space-y-2 pb-4 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                            <Plus className="h-5 w-5 text-white" />
                        </div>
                        {language === 'vi' ? 'Thêm khách thuê' : 'Add Tenant'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 ml-10">
                        {language === 'vi' ? 'Điền thông tin khách thuê của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your tenant information.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-1">
                    <div className="space-y-4">
                        {/* Personal Information Section */}
                        <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100 space-y-2">
                                    <Label htmlFor="hoTen" className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                        <span className="text-xs">👤</span>
                                        {language === 'vi' ? 'Họ và tên' : 'Full Name'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="hoTen"
                                        name="hoTen"
                                        placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                                        onChange={handleInputChange}
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.hoTen 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-emerald-200 focus:border-emerald-400 bg-emerald-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.hoTen && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.hoTen}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 space-y-2">
                                    <Label htmlFor="maCanCuoc" className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                        <span className="text-xs">🆔</span>
                                        {language === 'vi' ? 'Căn cước công dân' : 'ID Card'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="maCanCuoc"
                                        name="maCanCuoc"
                                        type="text"
                                        placeholder={language === 'vi' ? '001234567890' : '001234567890'}
                                        onChange={handleInputChange}
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.maCanCuoc 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-blue-200 focus:border-blue-400 bg-blue-50/30'
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
                        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 space-y-3">
                                    <Label htmlFor="dienThoai" className="text-base font-semibold text-purple-700 flex items-center gap-2">
                                        <span className="text-sm">📱</span>
                                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="dienThoai"
                                        name="dienThoai"
                                        type="tel"
                                        placeholder={language === 'vi' ? '0123456789' : '+1 (555) 123-4567'}
                                        onChange={handleInputChange}
                                        className={`rounded-xl border-2 font-semibold transition-all duration-200 ${
                                            validationErrors.dienThoai 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-purple-200 focus:border-purple-400 bg-purple-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.dienThoai && (
                                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{validationErrors.dienThoai}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 space-y-3">
                                    <Label htmlFor="email" className="text-base font-semibold text-blue-700 flex items-center gap-2">
                                        <span className="text-sm">📧</span>
                                        {language === 'vi' ? 'Email' : 'Email'}
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder={language === 'vi' ? 'example@email.com' : 'example@email.com'}
                                        onChange={handleInputChange}
                                        className={`rounded-xl border-2 font-semibold transition-all duration-200 ${
                                            validationErrors.email 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-blue-200 focus:border-blue-400 bg-blue-50/30'
                                        }`}
                                    />
                                    {validationErrors.email && (
                                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{validationErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mt-6">

                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 space-y-3">
                                    <Label htmlFor="thuongTru" className="text-base font-semibold text-amber-700 flex items-center gap-2">
                                        <span className="text-sm">🏠</span>
                                        {language === 'vi' ? 'Địa chỉ thường trú' : 'Permanent Address'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="thuongTru"
                                        name="thuongTru"
                                        type="text"
                                        placeholder={language === 'vi' ? '123 An Dương Vương, Hà Nội' : '123 Main Street, City'}
                                        onChange={handleInputChange}
                                        className={`rounded-xl border-2 font-semibold transition-all duration-200 ${
                                            validationErrors.thuongTru 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-amber-200 focus:border-amber-400 bg-amber-50/30'
                                        }`}
                                        required
                                    />
                                    {validationErrors.thuongTru && (
                                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{validationErrors.thuongTru}</p>
                                    )}
                                </div>
                            </div>
                        </div>
    
                            {/* Birth Date Section */}
                        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                                <h4 className="font-bold text-lg text-gray-900">
                                    {language === 'vi' ? 'Thông tin sinh nhật' : 'Birth Information'}
                                </h4>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 space-y-3">
                                <Label htmlFor="ngaySinh" className="text-base font-semibold text-indigo-700 flex items-center gap-2">
                                    <span className="text-sm">🎂</span>
                                    {language === 'vi' ? 'Ngày sinh' : 'Date of Birth'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ngaySinh"
                                    name="ngaySinh"
                                    type="date"
                                    onChange={handleInputChange}
                                    className={`rounded-xl border-2 font-semibold transition-all duration-200 ${
                                        validationErrors.ngaySinh 
                                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                            : 'border-indigo-200 focus:border-indigo-400 bg-indigo-50/30'
                                    }`}
                                    required
                                />
                                {validationErrors.ngaySinh && (
                                    <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{validationErrors.ngaySinh}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-4 pt-6 border-t border-gray-100">
                        <DialogClose asChild>
                            <Button 
                                variant="outline" 
                                type="button"
                                className="rounded-xl px-6 py-2 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold transition-all duration-200"
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            disabled={isCreating}
                            className="rounded-xl px-8 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg shadow-emerald-200 transition-all duration-200"
                        >
                            {isCreating 
                                ? (language === 'vi' ? 'Đang tạo...' : 'Creating...') 
                                : (language === 'vi' ? 'Tạo khách thuê' : 'Create Tenant')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            {toast && <Toast {...toast} onClose={removeToast} />}
        </Dialog>
    )
}
