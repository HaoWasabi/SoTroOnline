"use client"

import FilterComponent from "@/components/filter-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Plus, Search } from "lucide-react";
import RoomServiceCard from "./room-service-card";

const menu = [
    {
        vietnamItem: "Active",
        englishItem: "Đang hoạt động"
    },
    {
        vietnamItem: "Maintenacne",
        englishItem: "Bảo trì"
    },
]

const roomServices: RoomService[] = [
    {
        service_code: "SVC-201",
        manager_name: "Nguyen Van A",
        service_name: "Electricity Service",
        base_cost: 3500,
        description: "Electricity usage charged per kWh, including maintenance of electrical systems.",
        status: "Active",
    },
    {
        service_code: "SVC-202",
        manager_name: "Tran Thi B",
        service_name: "Water Service",
        base_cost: 15000,
        description: "Monthly water supply service, charged per cubic meter.",
        status: "Active",
    },
    {
        service_code: "SVC-203",
        manager_name: "Le Van C",
        service_name: "Garbage Collection",
        base_cost: 20000,
        description: "Weekly garbage collection and waste management service.",
        status: "Active",
    },
];


export default function RoomServiceManagementLayout() {

    const {language} = useLanguageStore();

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === 'vi' ? "Quản lý dịch vụ phòng" : "Service Management"}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? "Theo dõi yêu cầu bảo trì và dịch vụ phòng" : "Track maintenance requests and room services"}
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'vi' ? "Thêm dịch vụ phòng" : "New Service Request"}
                </Button>   
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {roomServices.map(roomService => (
                    <RoomServiceCard key={roomService.service_name} roomService={roomService} />
                ))}
            </div>
        </main>
    )
}