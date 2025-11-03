
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

        // Validate required fields
        if (!tenantData.hoTen || !tenantData.maCanCuoc || !tenantData.dienThoai || !tenantData.thuongTru || !tenantData.ngaySinh) {
            showError(
                language === 'vi' 
                    ? 'Vui lòng điền đầy đủ thông tin bắt buộc.' 
                    : 'Please fill in all required fields.'
            );
            return;
        }

        try {
            setIsCreating(true);
            await createTenant(tenantData);
            
            // Show success message
            showSuccess(
                language === 'vi' 
                    ? 'Tạo khách thuê thành công!' 
                    : 'Tenant created successfully!'
            );
            
            // Close dialog and reset form
            setIsOpen(false);
            (e.target as HTMLFormElement).reset();
            
            // Call onSuccess callback to refresh the tenant list
            onSuccess?.();
            
        } catch (error) {
            console.error('Error creating tenant:', error);
            
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
                                        {language === 'vi' ? 'Họ và tên' : 'Full Name'}
                                    </Label>
                                    <Input
                                        id="hoTen"
                                        name="hoTen"
                                        placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
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
                                        required
                                    />
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
