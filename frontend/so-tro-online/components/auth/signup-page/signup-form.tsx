'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff} from 'lucide-react';
import { useLanguageStore } from '@/zustand/language-tranlator';
import { DatePicker } from '@/components/date-picker';

export default function SignUpForm() {
    
    const {language} = useLanguageStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cccd: '',
        phone: '',
        address: '',
        dateOfBirth: Date,
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
        }
        // Handle sign up logic here
        console.log('Sign up attempt:', formData);
    };

    return (
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
                            id="name"
                            placeholder="John"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                        <Label htmlFor="cccd">Cccd</Label>
                        <Input
                            id="cccd"
                            type="text"
                            placeholder={ language === 'vi' ? 'Nhập số căn cước công dân ở đây!' : 'Enter cccd code here!'}
                            value={formData.cccd}
                            onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                            required
                        />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                { language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                                type="text"
                                placeholder={ language === 'vi' ? '123 An Duong Vuong' : '123 No Street'}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">
                                { language === 'vi' ? 'Ngày sinh' : 'Date of birth'}
                            </Label>
                            <DatePicker date={new Date()} />
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="property-manager">Property Manager</SelectItem>
                            <SelectItem value="landlord">Landlord</SelectItem>
                            <SelectItem value="agent">Real Estate Agent</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                        </Select>
                    </div> */}
                

                    <div className='space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2'>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {language === 'vi' ? 'Mật khẩu' : 'Password'}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 space-y-4">
                        <input
                            id="terms"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded mt-1"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            required
                        />
                        <Label htmlFor="terms" className="text-sm leading-5">
                            {language === 'vi' ? 'Tôi đồng ý với' : 'I agree to the'}{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                            {language === 'vi' ? 'Chính sách dịch vụ' : 'Terms of Service'}
                        </Link>
                        and
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                            {language === 'vi' ? 'Điều khoản cá nhân' : 'Privacy Policy'}
                        </Link>
                        </Label>
                    </div>
                </CardContent>
                    
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full">
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
  );
}