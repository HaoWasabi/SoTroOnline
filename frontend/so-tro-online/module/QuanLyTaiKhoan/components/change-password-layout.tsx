"use client"

import { useTaiKhoanStore } from "@/zustand/taikhoan-store";
import ChangePasswordForm from "./change-password-form";
import { profile } from "console";


export default function AccountInformationLayout() {
    const {taiKhoan} = useTaiKhoanStore();
    
    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex items-center justify-center">
                <ChangePasswordForm />
            </div>
        </main>
    )
}