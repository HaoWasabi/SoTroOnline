"use client"

import { useLanguageStore } from "@/zustand/language-tranlator";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GridOfRoomCard from "./grid-of-room-card";
import FilterComponent from "@/components/filter-component";
import { RoomFormAsDialog } from "./room-form-as-dialog";
import { useState, useEffect } from "react";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [searchParams, setSearchParams] = useState<{
        tenPhong?: string;
        loaiPhong?: string;
        diaChi?: string;
    }>({});

    // Update search params when search term or filter changes
    useEffect(() => {
        const params: any = {};
        
        if (searchTerm.trim()) {
            // Search in room name or address
            params.tenPhong = searchTerm.trim();
        }
        
        if (selectedFilter) {
            // Map filter to status - use the exact values from the menu
            const filterItem = menu.find(item => 
                item.vietnamItem === selectedFilter || 
                item.englishItem === selectedFilter
            );
            
            if (filterItem) {
                params.trangThai = filterItem.value; // Add status filter to search params
            }
        }
        
        setSearchParams(params);
    }, [searchTerm, selectedFilter]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
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
                                placeholder={language === 'vi' ? 'Tìm kiếm phòng...' : 'Search rooms...'}
                                className="pl-10"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <FilterComponent 
                            menu={menu}
                            onFilterChange={setSelectedFilter}
                            selectedFilter={selectedFilter}
                        />
                    </div>
                </CardContent>
            </Card>
            
            <GridOfRoomCard 
                searchParams={searchParams}
            />
        </main>
    )
}