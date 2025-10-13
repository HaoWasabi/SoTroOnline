"use client"

import Link from "next/link";

import { useLanguageStore } from "@/zustand/language-tranlator"
import { Key, Shield } from "lucide-react";
import ProfileInformationForm from "./profile-information-form";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function ProfileManagementLayout() {

    const {taiKhoan} = useTaiKhoanStore();
    const {language} = useLanguageStore();

    return (
      <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
        <div className="flex flex-col items-center justify-center gap-4">
          <ProfileInformationForm profile={taiKhoan as TaiKhoan} />
          <Card className="min-w-sm md:min-w-md lg:min-w-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>{language === 'vi' ? 'Quản lý bảo mật tài khoản của bạn' : 'Manage your account security'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/user-profile/change-password" className="w-full flex items-center px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors">
                <Key className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
}