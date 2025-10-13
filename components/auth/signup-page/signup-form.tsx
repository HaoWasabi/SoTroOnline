'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff} from 'lucide-react';
import { useLanguageStore } from '@/zustand/language-tranlator';
import { useToast } from '@/hook/useToast';
import { Toast, ToastContainer } from '@/components/toast';
import { validateAddress, validateCccd, validateDateOfBirth, validatePhone } from '@/utils/auth-validation';
import { signUpApi } from '@/module/QuanLyTaiKhoan/api/api-quan-ly-tai-khoan';
import { useRouter } from 'next/navigation';
import { useTaiKhoanStore } from '@/zustand/taikhoan-store';


export default function SignUpForm() {
    
    const router = useRouter();
    const { setTaiKhoan } = useTaiKhoanStore();
    const {language} = useLanguageStore();
    const { toast, showError, showSuccess, removeToast } = useToast();
    const userNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const cccdRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const dateOfBirthRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const name = userNameRef.current?.value;
        const email = emailRef.current?.value;
        const cccd = cccdRef.current?.value;
        const phone = phoneRef.current?.value;
        const address = addressRef.current?.value;
        const dateOfBirth = dateOfBirthRef.current?.value;
        const password = passwordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;

        if(!name || !email || !cccd || !phone || !address || !dateOfBirth || !password || !confirmPassword) {
            showError(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all fields');
            return;
        }

       

        if(!validateCccd(cccd)) {
            showError(language === 'vi' ? 'Cccd không hợp lệ' : 'Invalid cccd');
            return;
        }

        if(!validatePhone(phone)) {
            showError(language === 'vi' ? 'Số điện thoại không hợp lệ' : 'Invalid phone number');
            return;
        }

        if(!validateAddress(address)) {
            showError(language === 'vi' ? 'Địa chỉ không hợp lệ' : 'Invalid address');
            return;
        }

        if(!validateDateOfBirth(new Date(dateOfBirth))) {
            showError(language === 'vi' ? 'Bạn phải từ 18 tuổi trở lên' : 'You must be at least 18 years old');
            return;
        }

        if(password !== confirmPassword) {
            showError(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
            return;
        }

        const response = await signUpApi(email, cccd, password, name, phone, address, new Date(dateOfBirth), 'hoatDong');

        if(response.status === 'success') {
            showSuccess(language === 'vi' ? 'Đăng ký thành công' : 'Registration successful');
            setTaiKhoan(response.user as TaiKhoan);
            router.push("/")
        } else {
            const errorMessage = response.message && (language === 'vi' ? (
                response.message === 'Account with this email is already exist!' ? 'Tài khoản với email này đã tồn tại!' : 
                response.message === 'Error JSON format' ? 'Định dạng JSON không hợp lệ' : 
                response.message === 'Internal server error' ? 'Lỗi máy chủ nội bộ' : response.message
            ) : 'Registration failed');
            setIsSubmitting(false);
            showError(errorMessage);
        }
        
    };

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
            <Card className="shadow-lg min-w-[288px] sm:min-w-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">Get Started</CardTitle>
                    <CardDescription className="text-center">
                        {language === 'vi' ? 'Đăng nhập tài khoản để bắt đầu quản lý thông tin' : 'Create your account to start managing properties'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                            <Label htmlFor="name">
                                {language === 'vi' ? 'Tên' : 'Name'}
                            </Label>
                            <Input
                                ref={userNameRef}
                                id="name"
                                placeholder="John"
                                required
                            />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    ref={emailRef}
                                    id="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                        </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="cccd">Cccd</Label>
                                <Input
                                    ref={cccdRef}
                                    id="cccd"
                                    type="text"
                                    placeholder={ language === 'vi' ? 'Nhập số căn cước công dân ở đây!' : 'Enter cccd code here!'}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    { language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                                </Label>
                                <Input
                                    ref={phoneRef}
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
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
                                    ref={addressRef}
                                    id="address"
                                    type="text"
                                    placeholder={ language === 'vi' ? '123 An Duong Vuong' : '123 No Street'}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">
                                    { language === 'vi' ? 'Ngày sinh' : 'Date of birth'}
                                </Label>
                                <Input ref={dateOfBirthRef} id="dateOfBirth" type="date" required />
                            </div>
                        </div>
                
                        <div className='space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2'>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {language === 'vi' ? 'Mật khẩu' : 'Password'}
                                </Label>
                            <div className="relative">
                                <Input
                                    ref={passwordRef}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                {language === 'vi' ? 'Xác nhận mật khẩu' : 'Confirm Password'}
                            </Label>
                                <div className="relative">
                                    <Input
                                        ref={confirmPasswordRef}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        disabled={isSubmitting}
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="mt-4 flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                            {language === 'vi' ? 'Tạo tài khoản' : 'Create Account'}
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                            {language === 'vi' ? 'Đã có tài khoản' : 'Already have an account?'}{' '}
                            <Link href="/login-page" className="text-blue-600 hover:text-blue-800 font-medium">
                                {language === 'vi' ? 'Đăng nhập tại đây' : 'Sign in here'}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}