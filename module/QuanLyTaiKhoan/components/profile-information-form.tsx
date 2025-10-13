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
            return;
        }

        if(!validateCccd(cccdCode)) {
            showError(language === 'vi' ? 'Cccd không hợp lệ' : 'Invalid cccd');
            return;
        }

        if(!validatePhone(dienThoai)) {
            showError(language === 'vi' ? 'Số điện thoại không hợp lệ' : 'Invalid phone number');
            return;
        }

        if(!validateAddress(thuongTru)) {
            showError(language === 'vi' ? 'Địa chỉ không hợp lệ' : 'Invalid address');
            return;
        }

        if(!validateDateOfBirth(new Date(ngaySinh))) {
            showError(language === 'vi' ? 'Bạn phải từ 18 tuổi trở lên' : 'You must be at least 18 years old');
            return;
        }

        const response = await updateUserInformationApi(taiKhoan?.maTaiKhoan as number, email, hoTen, cccdCode, dienThoai, thuongTru, ngaySinh);
        
        if(response.status === 'success') {
            setIsSubmitting(false)
            setIsChanged(false)
            updateUserInformationApi(taiKhoan?.maTaiKhoan as number, email, hoTen, cccdCode, dienThoai, thuongTru, ngaySinh)
            updateTaiKhoan({
                email: email,
                hoTen: hoTen,
                maCanCuoc: cccdCode,
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
            <Card className="min-w-sm md:min-w-md lg:min-w-xl">
                <CardHeader>
                    <CardTitle>
                        {language === 'vi' ? "Thông tin cá nhân" : "Personal Information"}
                    </CardTitle>
                    <CardDescription>{language === 'vi' ? "Cập nhật thông tin cá nhân của bạn" : "Update your personal information"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlesubmit} className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="name">{language === 'vi' ? "Họ và tên" : "Full Name"}</Label>
                            <Input
                                ref={nameRef}
                                type="text"
                                defaultValue={profile && profile.hoTen ? profile.hoTen : ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== profile.hoTen) { setIsChanged(true) } else { setIsChanged(false) }
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    ref={emailRef}
                                    type="email"
                                    className="pl-10"
                                    defaultValue={profile && profile.email ? profile.email : ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== profile.email) { setIsChanged(true) } else { setIsChanged(false) }
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="firstName">{language === 'vi' ? "Mã căn cước công dân" : "Cccd code"}</Label>
                            <Input
                                ref={cccdRef}
                                type="text"
                                defaultValue={profile && profile.maCanCuoc ? profile.maCanCuoc : ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== profile.maCanCuoc) { setIsChanged(true) } else { setIsChanged(false) }
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{language === 'vi' ? "Số điện thoại" : "Phone Number"}</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    ref={phoneRef}
                                    className="pl-10"
                                    defaultValue={profile && profile.dienThoai ? profile.dienThoai : ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== profile.dienThoai) { setIsChanged(true) } else { setIsChanged(false) }
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">
                                { language === 'vi' ? 'Ngày sinh' : 'Date of birth'}
                            </Label>
                            <Input 
                                ref={dateOfBirthRef}
                                type="date" 
                                defaultValue={profile && profile.ngaySinh ? profile.ngaySinh.substring(0, 10) : ''} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== profile.ngaySinh) { setIsChanged(true) } else { setIsChanged(false) }
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">{language === 'vi' ? "Địa chỉ" : "Address"}</Label>
                                <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Textarea
                                    ref={addressRef}
                                    className="pl-10"
                                    defaultValue={profile && profile.thuongTru ? profile.thuongTru : ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                        if (e.target.value !== profile.thuongTru) { setIsChanged(true) } else { setIsChanged(false) }
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button disabled={!isChanged} type="submit" className="text-white bg-blue-500 hover:bg-blue-600">
                                {language === 'vi' ? "Lưu thay đổi" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
} 