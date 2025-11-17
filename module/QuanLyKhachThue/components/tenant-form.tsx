
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
import { createTenant } from "../api/api-tenant"
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
        const tenantData = {
            maKhach: 0, // Will be set by backend
            maKhachDaiDien: `KT${Date.now()}`, // Generate a representative code
            maCanCuoc: formData.get('maCanCuoc') as string,
            hoTen: formData.get('hoTen') as string,
            thuongTru: formData.get('thuongTru') as string,
            ngaySinh: formData.get('ngaySinh') as string,
            ngayTao: new Date().toISOString(), // Current date
            trangThai: 'hoatDong', // Default status
            dienThoai: formData.get('dienThoai') as string,
        };

        // Validate all fields
        const errors: Record<string, string> = {};
        Object.keys(tenantData).forEach(key => {
            if (key !== 'maKhach' && key !== 'maKhachDaiDien' && key !== 'ngayTao' && key !== 'trangThai') {
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
            <DialogContent className="sm:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                        {language === 'vi' ? 'Thêm khách thuê' : 'Add Tenant'}
                    </DialogTitle>
                    <DialogDescription>
                        {language === 'vi' ? 'Điền thông tin khách thuê của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your tenant information.'}
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
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isCreating}>
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
