"use client"

import Link from "next/link"

import { useState } from "react"
import { EyeOff, Eye} from "lucide-react"
import { Button } from "../../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"

export default function LoginForm() {

    const {language} = useLanguageStore();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Card className="shadow-lg w-80 sm:min-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                    {language === 'vi' ? 'Chào mừng quay trở lại' : 'Welcome back'}
                </CardTitle>
                <CardDescription className="text-center">
                    {language === 'vi' ? 'Đăng nhập để tiếp tục' : 'Sign in to your account to continue'}
                </CardDescription>
            </CardHeader>
            <form className="space-y-4">
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={language === 'vi' ? 'Nhập email ở đây' : "Enter your email"}
                        //value={formData.email}
                        //onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="password">
                        {language === 'vi' ? 'Mật khẩu' : 'Password'}
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={language === 'vi' ? 'Nhập mật khẩu' : 'Enter your password'}
                            //value={formData.password}
                            //onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <input
                            id="remember"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded"
                            //checked={formData.rememberMe}
                            //onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        />
                        <Label htmlFor="remember" className="text-sm">
                            {language === 'vi' ? 'Nhớ tài khoản' : 'Remember me'}
                        </Label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                        {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                    </Link>
                </div>
                </CardContent>
            
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full cursor-pointer">
                        {language === 'vi' ? 'Đăng nhập' : 'Sign In'}
                    </Button>
                <div className="text-center text-sm text-gray-600">
                    {language === 'vi' ? 'Chưa có tài khoản?' : 'Do not have an account?'}
                    <Link href="/signup-page" className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                         {language === 'vi' ? ' Đăng ký ở đây' : ' Sign up here'}
                    </Link>
                </div>
                </CardFooter>
            </form>
        </Card>
    )
}   