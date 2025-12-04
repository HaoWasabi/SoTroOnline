"use client"

import { useLanguageStore } from "@/zustand/language-tranlator";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GridOfRoomCard from "./grid-of-room-card";
import FilterComponent from "@/components/filter-component";
import { RoomFormAsDialog } from "./room-form-as-dialog";
import { useState } from "react";

const menu = [
    {
        vietnamItem: "Phòng trống",
        englishItem: "Available",
        value: "phongTrong"
    },
    {
        vietnamItem: "Phòng có người ở",
        englishItem: "Occupied",
        value: "hoatDong"
    },
    {
        vietnamItem: "Phòng đang bảo trì",
        englishItem: "In Maintenance",
        value: "baoTri"
    }
]

export default function RoomManagementLayout() {
    const { language } = useLanguageStore();
    const { taiKhoan } = useTaiKhoanStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
    };

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === 'vi' ? 'Quản lý phòng' : 'Room Management'}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? 'Quản lý thông tin phòng' : 'Manage all your rooms and their availability'}
                        {taiKhoan && (
                            <span className="text-sm text-blue-600 ml-2">
                                ({language === 'vi' ? 'Quản lý bởi' : 'Managed by'}: {taiKhoan.hoTen})
                            </span>
                        )}
                    </p>
                </div>
                <RoomFormAsDialog />
            </div>
            
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={language === 'vi' ? 'Tìm theo mã phòng, tên phòng hoặc địa chỉ...' : 'Search by room ID, name or address...'}
                                className="pl-10"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <FilterComponent 
                            menu={menu}
                            onFilterChange={handleStatusFilter}
                            selectedFilter={statusFilter}
                        />
                    </div>
                </CardContent>
            </Card>
            
            <GridOfRoomCard 
                searchTerm={searchTerm}
                statusFilter={statusFilter}
            />
        </main>
    )
}