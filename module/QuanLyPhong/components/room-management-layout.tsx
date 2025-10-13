"use client"

import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Plus, Search } from "lucide-react";
import TypeOfRoomCard from "./type-of-room-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GridOfRoomCard from "./grid-of-room-card";
import FilterComponent from "@/components/filter-component";
import { RoomFormAsDialog } from "./room-form-as-dialog";

const menu = [
    {
        vietnamItem: "Phòng trống",
        englishItem: "Available"
    },
    {
        vietnamItem: "Phòng có người ở",
        englishItem: "Occupied"
    },
    {
        vietnamItem: "Phòng đang bảo trì",
        englishItem: "In Maintenance"
    }
]

export default function RoomManagementLayout() {

    const {language} = useLanguageStore();

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <TypeOfRoomCard roomName="All Available" quantity={1} />
                <TypeOfRoomCard roomName="Occupied Rooms" quantity={0} />
                <TypeOfRoomCard roomName="In Maintenance" quantity={0} />
                <TypeOfRoomCard roomName="Total Rooms" quantity={0} />
            </div>
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search tenants..."
                                className="pl-10"
                            />
                        </div>
                        <FilterComponent menu={menu}/>
                    </div>
                </CardContent>
            </Card>
            <GridOfRoomCard />
        </main>
    )
}