"use client";

import { Toast, ToastContainer } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/useToast";
import { resetPasswordApi } from "@/module/QuanLyTaiKhoan/api/api-quan-ly-tai-khoan";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useRef, useState } from "react";


export default function ResetPasswordForm() {

    const { toast, showError, showSuccess, removeToast } = useToast();
    const {language} = useLanguageStore();
    const emailRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const email = emailRef.current?.value || '';

        if(!email) {
            showError(language === 'vi' ? 'Vui lòng nhập email' : 'Please enter your email');
            return;
        }

        const result = await resetPasswordApi(email);
        if (result.status === 'success') {
            showSuccess(language === 'vi' ? 'Mật khẩu tạm thời đã được gửi về email. Vui lòng kiểm tra email của bạn.' : result.message, 6000);
            setIsSubmitting(false);
        } else {
            showError(language === 'vi' ? 'Đặt lại mật khẩu thất bại' :  result.message, 6000);
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
            <Card className="shadow-lg w-80 sm:min-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        {language === 'vi' ? 'Nhập email' : 'Enter your email'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {language === 'vi' ? 'Mã tạm thời sẽ gửi về email của bạn' : 'A temporary code will be sent to your email'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                ref={emailRef}
                                id="email"
                                type="email"
                                placeholder={language === 'vi' ? 'Nhập email ở đây' : "Enter your email"}
                                //value={formData.email}
                                //onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    
                        </CardContent>
            
                        <CardFooter className="flex flex-col space-y-4">
                            <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
                                {language === 'vi' ? 'Gửi yêu cầu' : 'Send Request'}
                            </Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    )
}