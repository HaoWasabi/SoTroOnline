"use client";

import { Toast, ToastContainer } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hook/useToast";
import { validateResetTokenApi, resetPasswordWithTokenApi } from "@/module/QuanLyTaiKhoan/api/api-quan-ly-tai-khoan";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { validatePassword } from "@/utils/auth-validation";
import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";

export default function ResetPasswordWithTokenPage() {
    const { toast, showError, showSuccess, removeToast } = useToast();
    const { language } = useLanguageStore();
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                showError(language === 'vi' ? 'Token không hợp lệ' : 'Invalid token');
                setIsValidating(false);
                return;
            }

            const result = await validateResetTokenApi(token);
            if (result.status === 'success') {
                setIsValidToken(true);
            } else {
                showError(language === 'vi' ? 'Token không hợp lệ hoặc đã hết hạn' : 'Invalid or expired token');
            }
            setIsValidating(false);
        };

        validateToken();
    }, [token, language, showError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!token) {
            showError(language === 'vi' ? 'Token không hợp lệ' : 'Invalid token');
            setIsSubmitting(false);
            return;
        }

        const newPassword = newPasswordRef.current?.value.trim();
        const confirmPassword = confirmPasswordRef.current?.value.trim();

        if (!validatePassword(newPassword as string)) {
            showError(language === 'vi' ? "Mật khẩu phải có ít nhất 10 ký tự, bao gồm chữ cái và số" : "Password must be at least 10 characters long and include both letters and numbers", 3000);
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showError(language === 'vi' ? "Mật khẩu xác nhận không khớp" : "Confirm password does not match", 3000);
            setIsSubmitting(false);
            return;
        }

        const result = await resetPasswordWithTokenApi(token, newPassword as string);
        
        if (result.status === 'success') {
            showSuccess(language === 'vi' ? 'Đặt lại mật khẩu thành công! Đang chuyển hướng...' : 'Password reset successfully! Redirecting...', 3000);
            setTimeout(() => {
                router.push('/login-page');
            }, 2000);
        } else {
            showError(language === 'vi' ? 'Đặt lại mật khẩu thất bại' : result.message, 4000);
        }
        
        setIsSubmitting(false);
    };

    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Building2 className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">SoTroOnline</h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? 'Đang xác thực token...' : 'Validating token...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center justify-center">
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
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Building2 className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">SoTroOnline</h1>
                    <p className="text-red-600 mb-4">
                        {language === 'vi' ? 'Token không hợp lệ hoặc đã hết hạn' : 'Invalid or expired token'}
                    </p>
                    <Button onClick={() => router.push('/forgot-password')} className="bg-blue-500 hover:bg-blue-600">
                        {language === 'vi' ? 'Yêu cầu mới' : 'Request New Reset'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center justify-center">
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
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">SoTroOnline</h1>
            </div>
            
            <Card className="shadow-lg w-80 sm:min-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        {language === 'vi' ? 'Đặt lại mật khẩu' : 'Reset Password'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {language === 'vi' ? 'Nhập mật khẩu mới của bạn' : 'Enter your new password'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">
                                {language === 'vi' ? 'Mật khẩu mới' : 'New Password'}
                            </Label>
                            <Input
                                ref={newPasswordRef}
                                id="newPassword"
                                type="password"
                                placeholder={language === 'vi' ? 'Nhập mật khẩu mới' : "Enter new password"}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                {language === 'vi' ? 'Xác nhận mật khẩu' : 'Confirm Password'}
                            </Label>
                            <Input
                                ref={confirmPasswordRef}
                                id="confirmPassword"
                                type="password"
                                placeholder={language === 'vi' ? 'Xác nhận mật khẩu mới' : "Confirm new password"}
                                required
                            />
                        </div>
                    </CardContent>
            
                    <CardFooter className="flex flex-col space-y-4">
                        <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
                            {isSubmitting ? 
                                (language === 'vi' ? 'Đang xử lý...' : 'Processing...') :
                                (language === 'vi' ? 'Đặt lại mật khẩu' : 'Reset Password')
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}