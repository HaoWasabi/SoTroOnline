

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
import { useState } from "react"

interface TenantFormEditingProps {
    tenant: Tenant;
    children: React.ReactNode;
    onUpdate?: () => void;
}

export function TenantFormEditing({ tenant, children, onUpdate }: TenantFormEditingProps) {

    const { language } = useLanguageStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tenant.id) return;

        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            tenant_cccd: formData.get('cccd') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
            dateOfBirth: formData.get('dateOfBirth') as string,
        };

        try {
            setIsUpdating(true);
            await updateTenant(tenant.id, updatedData);
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
                                <Label htmlFor="name">
                                    {language === 'vi' ? 'Tên' : 'Name'}
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John"
                                    defaultValue={tenant.name}
                                    required
                                />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        defaultValue={tenant.email}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cccd">Cccd</Label>
                                    <Input
                                        id="cccd"
                                        name="cccd"
                                        type="text"
                                        placeholder={ language === 'vi' ? 'Nhập số căn cước công dân ở đây!' : 'Enter cccd code here!'}
                                        defaultValue={tenant.tenant_cccd}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        { language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        defaultValue={tenant.phone}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="address">
                                        { language === 'vi' ? 'Địa chỉ' : 'Address'}
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder={ language === 'vi' ? '123 An Duong Vuong' : '123 No Street'}
                                        defaultValue={tenant.address}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">
                                        { language === 'vi' ? 'Ngày sinh' : 'Date of birth'}
                                    </Label>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        defaultValue={tenant.dateOfBirth}
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
                            <Button type="submit" disabled={isUpdating}>
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
