"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useTaiKhoanStore } from "@/zustand/taikhoan-store"
import { Mail, MapPin, Phone } from "lucide-react"
import React from "react"
import { updateUserInformationApi } from "../api/api-quan-ly-tai-khoan"
import { useToast } from "@/hook/useToast"
import { Toast, ToastContainer } from "@/components/toast"
import { validateAddress, validateCccd, validateDateOfBirth, validateEmail, validatePhone } from "@/utils/auth-validation"

export default function ProfileInformationForm({profile}: {profile: TaiKhoan}) {

    const {taiKhoan, updateTaiKhoan} = useTaiKhoanStore()
    const {toast, showSuccess, showError, removeToast} = useToast()
    const {language} = useLanguageStore()
    const [isChanged, setIsChanged] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const nameRef = React.useRef<HTMLInputElement>(null)
    const emailRef = React.useRef<HTMLInputElement>(null)
    const cccdRef = React.useRef<HTMLInputElement>(null)
    const phoneRef = React.useRef<HTMLInputElement>(null)
    const dateOfBirthRef = React.useRef<HTMLInputElement>(null)
    const addressRef = React.useRef<HTMLTextAreaElement>(null)

    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true)

        if(isSubmitting) {
            setIsChanged(false)
        }

        const email = emailRef.current?.value as string;
        const hoTen = nameRef.current?.value as string;
        const cccdCode = cccdRef.current?.value as string;
        const dienThoai = phoneRef.current?.value as string;
        const thuongTru = addressRef.current?.value as string;
        const ngaySinh = dateOfBirthRef.current?.value as string;

        console.log({maTaiKhoan: taiKhoan?.maTaiKhoan, email, hoTen, cccdCode, dienThoai, thuongTru, ngaySinh});

        if(!validateEmail(email)) {
            showError(language === 'vi' ? 'Email không hợp lệ' : 'Invalid email address');
            setIsSubmitting(false);
            return;
        }

        // Only validate CCCD if it's provided (not required for Google accounts)
        if(cccdCode && !validateCccd(cccdCode)) {
            showError(language === 'vi' ? 'Cccd không hợp lệ' : 'Invalid cccd');
            setIsSubmitting(false);
            return;
        }

        if(!validatePhone(dienThoai)) {
            showError(language === 'vi' ? 'Số điện thoại không hợp lệ' : 'Invalid phone number');
            setIsSubmitting(false);
            return;
        }

        if(!validateAddress(thuongTru)) {
            showError(language === 'vi' ? 'Địa chỉ không hợp lệ' : 'Invalid address');
            setIsSubmitting(false);
            return;
        }

        if(!validateDateOfBirth(new Date(ngaySinh))) {
            showError(language === 'vi' ? 'Ngày sinh không hợp lệ' : 'Invalid date of birth');
            setIsSubmitting(false);
            return;
        }

        const response = await updateUserInformationApi(
            taiKhoan?.maTaiKhoan as number, 
            email, 
            hoTen, 
            cccdCode || '', // Ensure empty string instead of undefined
            dienThoai, 
            thuongTru, 
            ngaySinh
        );
        
        if(response.status === 'success') {
            setIsSubmitting(false)
            setIsChanged(false)
            updateTaiKhoan({
                email: email,
                hoTen: hoTen,
                maCanCuoc: cccdCode || '',
                dienThoai: dienThoai,
                thuongTru: thuongTru,
                ngaySinh: ngaySinh
            });
            showSuccess(language === 'vi' ? "Cập nhật thông tin thành công" : "Update information successfully")
        }else {
            setIsSubmitting(false)
            setIsChanged(true)
            const errorMessage = response.message && (language === 'vi' ? (
                response.message === 'Your account is not exist!' ? 'Tài khoản với email này không tồn tại!' : 
                response.message === 'Internal server error' ? 'Lỗi máy chủ nội bộ' : "something went wrong!"
            ) : response.message);
            showError(errorMessage || (language === 'vi' ? "Đã xảy ra lỗi" : "An error occurred"))
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
            <Card className="min-w-sm md:min-w-md lg:min-w-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm">
                <CardHeader className="pb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Mail className="h-6 w-6 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                                {language === 'vi' ? "Thông tin cá nhân" : "Personal Information"}
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                                {language === 'vi' ? "Cập nhật thông tin cá nhân của bạn" : "Update your personal information"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <form onSubmit={handlesubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    {language === 'vi' ? "Họ và tên" : "Full Name"}
                                </Label>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-1 border border-blue-100">
                                    <Input
                                        ref={nameRef}
                                        type="text"
                                        className="border-0 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        defaultValue={profile && profile.hoTen ? profile.hoTen : ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.value !== (profile.hoTen || '')) { setIsChanged(true) } else { setIsChanged(false) }
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Email
                                </Label>
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-1 border border-gray-200">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            ref={emailRef}
                                            type="email"
                                            className="pl-10 border-0 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm"
                                            defaultValue={profile && profile.email ? profile.email : ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.value !== (profile.email || '')) { setIsChanged(true) } else { setIsChanged(false) }
                                            }}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="cccd" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    {language === 'vi' ? "Mã căn cước công dân" : "CCCD Code"}
                                </Label>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-1 border border-purple-100">
                                    <Input
                                        ref={cccdRef}
                                        type="text"
                                        className="border-0 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                        defaultValue={profile && profile.maCanCuoc ? profile.maCanCuoc : ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.value !== (profile.maCanCuoc || '')) { setIsChanged(true) } else { setIsChanged(false) }
                                        }}
                                        placeholder={language === 'vi' ? "Tùy chọn cho tài khoản Google" : "Optional for Google accounts"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    {language === 'vi' ? "Số điện thoại" : "Phone Number"}
                                </Label>
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-1 border border-emerald-100">
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
                                        <Input
                                            ref={phoneRef}
                                            className="pl-10 border-0 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                                            defaultValue={profile && profile.dienThoai ? profile.dienThoai : ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.value !== (profile.dienThoai || '')) { setIsChanged(true) } else { setIsChanged(false) }
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                {language === 'vi' ? 'Ngày sinh' : 'Date of Birth'}
                            </Label>
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-1 border border-amber-100">
                                <Input 
                                    ref={dateOfBirthRef}
                                    type="date" 
                                    className="border-0 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                                    defaultValue={profile && profile.ngaySinh ? profile.ngaySinh.substring(0, 10) : ''} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== (profile.ngaySinh || '')) { setIsChanged(true) } else { setIsChanged(false) }
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="address" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                {language === 'vi' ? "Địa chỉ" : "Address"}
                            </Label>
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-1 border border-gray-100">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                                    <Textarea
                                        ref={addressRef}
                                        className="pl-10 border-0 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 min-h-[100px]"
                                        defaultValue={profile && profile.thuongTru ? profile.thuongTru : ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            if (e.target.value !== (profile.thuongTru || '')) { setIsChanged(true) } else { setIsChanged(false) }
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button 
                                disabled={!isChanged || isSubmitting} 
                                type="submit" 
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting 
                                    ? (language === 'vi' ? "Đang lưu..." : "Saving...")
                                    : (language === 'vi' ? "Lưu thay đổi" : "Save Changes")
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
} 