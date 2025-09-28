'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Building, 
  FileText, 
  Receipt, 
  Wrench,
  User,
  LogOut,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/zustand/language-tranlator';


const navigation = [
    { vietnam_name: 'Dashboard', english_name: 'Dashboard', href: '/', icon: Home },
    { vietnam_name: 'Khách thuê', english_name: 'Tenants', href: '/tenants', icon: Users },
    { vietnam_name: 'Phòng', english_name: 'Rooms', href: '/rooms', icon: Building },
    { vietnam_name: 'Hợp đồng', english_name: 'Contracts', href: '/contracts', icon: FileText },
    { vietnam_name: 'Hóa đơn', english_name: 'Invoices', href: '/invoices', icon: Receipt },
    { vietnam_name: 'Dịch vụ phòng', english_name: 'Services', href: '/room-services', icon: Wrench },
];

export function Sidebar() {
    const pathname = usePathname();
    const {language} = useLanguageStore();

    return (
        <div className={`hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 bg-white border-r border-gray-200`}>
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
                    const isActive = pathname === item.href;
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

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-8 space-y-2">
                {/* <Link href="/profile" className='flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900'>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm text-left font-medium text-gray-900 truncate">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">Property Manager</p>
                    </div>
                </Link> */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-700 hover:text-gray-900"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                    </Button>
            </div>
        </div>
    );
}