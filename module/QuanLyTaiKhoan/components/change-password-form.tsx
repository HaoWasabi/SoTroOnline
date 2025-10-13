"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import React from "react"
import { useToast } from "@/hook/useToast"
import { Toast, ToastContainer } from "@/components/toast"
import { validatePassword } from "@/utils/auth-validation"
import { updatePasswordApi } from "../api/api-quan-ly-tai-khoan"
import { useTaiKhoanStore } from "@/zustand/taikhoan-store"


export default function ChangePasswordForm() {

    const {taiKhoan} = useTaiKhoanStore();
    const newPasswordRef = React.useRef<HTMLInputElement>(null)
    const confirmPasswordRef = React.useRef<HTMLInputElement>(null)
    const {toast, showSuccess, showError, removeToast} = useToast()
    const {language} = useLanguageStore()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newPassword = newPasswordRef.current?.value.trim()
        const confirmPassword = confirmPasswordRef.current?.value.trim();

        if(!validatePassword(newPassword as string)) {
            showError(language === 'vi' ? "Mật khẩu phải có ít nhất 10 ký tự, bao gồm chữ cái và số" : "Password must be at least 10 characters long and include both letters and numbers", 3000);
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showError(language === 'vi' ? "Mật khẩu xác nhận không khớp" : "Confirm password does not match", 3000);
            setIsSubmitting(false);
            return;
        }

        if(taiKhoan?.maTaiKhoan === undefined) {
            showError(language === 'vi' ? "Tài khoản không hợp lệ hoặc không tồn tại" : "Invalid account or does not exist", 3000);
            setIsSubmitting(false);
            return;
        }

        const response = await updatePasswordApi(taiKhoan.maTaiKhoan, newPassword as string);

        if(response.status === 'success') {
            showSuccess(language === 'vi' ? "Cập nhật mật khẩu thành công" : "Password updated successfully", 3000);
            if(newPasswordRef.current) newPasswordRef.current.value = '';
            if(confirmPasswordRef.current) confirmPasswordRef.current.value = '';
            setIsSubmitting(false);
        } else {
            const errorMessage = response.message && (language === 'vi' ? (
                response.message === 'Your account is not exist!' ? 'Tài khoản không tồn tại!' : 
                response.message === 'New password must be different from old password' ? 'Mật khẩu mới phải khác mật khẩu cũ!' : 
                response.message === 'Internal server error' ? 'Lỗi máy chủ nội bộ' : "something went wrong!"
            ) : response.message);
            showError(errorMessage, 4000)
            setIsSubmitting(false);
        }

    }


    return (
        <>
            {toast && (
                <ToastContainer>
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                </ToastContainer>
            )}
            <Card className="min-w-sm md:min-w-md lg:min-w-xl">
                <CardHeader>
                    <CardTitle>
                        {language === 'vi' ? "Cập nhật mật khẩu" : "Update Password"}
                    </CardTitle>
                    <CardDescription>{language === 'vi' ? "Cập nhật mật khẩu của bạn" : "Update your password"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="name">{language === 'vi' ? "Nhập mật khẩu mới" : "Enter new password"}</Label>
                            <Input
                                ref={newPasswordRef}
                                type="password"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{language === 'vi' ? "Xác nhận mật khẩu mới" : "Confirm new password"}</Label>
                            <div className="relative">
                                <Input
                                    ref={confirmPasswordRef}
                                    type="password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button onClick={handleSubmit} disabled={isSubmitting} type="submit" className="text-white bg-blue-500 hover:bg-blue-600">
                                {language === 'vi' ? "Lưu thay đổi" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
} 