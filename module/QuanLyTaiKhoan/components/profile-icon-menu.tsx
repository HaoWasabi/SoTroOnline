"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { CircleUser, LogOut,  SquareUserRound } from "lucide-react"
import { useTaiKhoanStore } from "@/zustand/taikhoan-store"
import { useCallback } from "react"
import { useRouter } from "next/navigation"


export default function ProfileIconMenu() {

    const router = useRouter()
    const { clearTaiKhoan} = useTaiKhoanStore()
    const {language} = useLanguageStore()

    const handleLogout = useCallback(() => {
        clearTaiKhoan()
        router.push('/login-page')
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md transition-colors hover:bg-muted">
                    <CircleUser className="h-6 w-6 text-blue-500" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Link href="/user-profile" className="flex items-center gap-2">
                        <SquareUserRound className="w-4 h-4" />
                        {language === 'vi' ? "Thông tin cá nhân" : 'User Profile'}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
                <DropdownMenuItem >
                    <button onClick={handleLogout}  className="p-0 w-full flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        {language === 'vi' ? "Đăng xuất" : 'Log Out'}
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}