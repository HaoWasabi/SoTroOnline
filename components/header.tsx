'use client';

import Link from 'next/link';
import React from 'react';

import { Building, Building2, FileText, Home, Menu, Receipt, Search, Settings, User, Users, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './language-switcher';
import { useLanguageStore } from '@/zustand/language-tranlator';
import { useTaiKhoanStore } from '@/zustand/taikhoan-store';
import ProfileIconMenu from '@/module/QuanLyTaiKhoan/components/profile-icon-menu';

const navigation = [
    { vietnam_name: 'Dashboard', english_name: 'Dashboard', href: '/', icon: Home },
    { vietnam_name: 'Khách thuê', english_name: 'Tenants', href: '/tenants', icon: Users },
    { vietnam_name: 'Phòng', english_name: 'Rooms', href: '/rooms', icon: Building },
    { vietnam_name: 'Hợp đồng', english_name: 'Contracts', href: '/contracts', icon: FileText },
    { vietnam_name: 'Hóa đơn', english_name: 'Invoices', href: '/invoices', icon: Receipt },
    { vietnam_name: 'Dịch vụ phòng', english_name: 'Services', href: '/room-services', icon: Wrench },
    { vietnam_name: 'Quản lý thông tin cá nhân', english_name: 'Profile', href: '/user-profile', icon: User },
    { vietnam_name: 'Cài đặt', english_name: 'Settings', href: '/settings', icon: Settings },
    { vietnam_name: 'Thay đổi mật khẩu', english_name: 'Change Password', href: '/user-profile/change-password', icon: Building2 },
];

export function Header() {

    const pathName = usePathname();
    const {taiKhoan} = useTaiKhoanStore();
    const {language} = useLanguageStore();
    const [open, setOpen] = React.useState(false);
    const title = navigation.filter((item) => item.href === pathName)

    return (
        <>
            {open && (
                <div className="lg:hidden fixed inset-0 z-10 bg-black/75 bg-opacity-50" onClick={() => setOpen(false)}>
                    <div className='z-20'>
                         <div className={`h-screen w-64 flex flex-col bg-white border-r border-gray-200`}>
                            {/* Header */}
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
                                <Building2 className="h-8 w-8 text-blue-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">SoTroOnline</h1>
                                    <p className="text-xs text-gray-500">Property Management</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 py-4 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathName === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                                isActive
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        )}
                                        >
                                        <item.icon className="h-5 w-5" />
                                        {language === 'vi' ? item.vietnam_name : item.english_name}
                                        </Link>
                                    );
                                })}
                            </nav>
                         </div>
                    </div>
                </div>
            )}
            <header className="lg:pl-64 bg-white border-b border-gray-200 py-4">
                <div className="px-4 lg:px-6 flex items-center justify-between">
                    <Menu 
                        className='lg:hidden font-semibold' 
                        onClick={() => setOpen(!open)}
                    />
                    
                    <h2 className="text-lg font-semibold text-gray-900">
                        {language === 'vi' ? title[0].vietnam_name : title[0].english_name}
                                
                    </h2>   
                    
                    <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="hidden lg:relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                        placeholder="Search..."
                        className="pl-10 w-64"
                        />
                    </div>

                    {taiKhoan?.email ? (
                        <ProfileIconMenu />
                    ) : (
                        <Button className='bg-blue-500 text-white'>
                            <Link href="/login-page">
                                Sign in
                            </Link>
                        </Button>
                    )}
                    
                    <LanguageSwitcher />                   
                    </div>
                </div>
            </header>
        </>
    );
}