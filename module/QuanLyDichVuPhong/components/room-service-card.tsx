"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { BadgeDollarSign, Edit, MoreHorizontal, Trash2, Zap, Droplets, Trash } from "lucide-react"
import { DichVuResponse } from "../types/dich-vu-types"
import { useState } from "react"
import ServiceEditDialog from "./service-edit-dialog"

export default function RoomServiceCard({dichVu, onUpdateSuccess}: {dichVu: DichVuResponse, onUpdateSuccess: () => void}) {

    const {language} = useLanguageStore()
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const serviceItems = [
        {
            key: 'electricity',
            nameEn: 'Electricity Service',
            nameVi: 'Dịch vụ điện',
            price: dichVu.donGiaDien,
            icon: <Zap className="text-yellow-600" />,
            unit: language === 'vi' ? 'VNĐ/kWh' : 'VND/kWh'
        },
        {
            key: 'water',
            nameEn: 'Water Service', 
            nameVi: 'Dịch vụ nước',
            price: dichVu.donGiaNuoc,
            icon: <Droplets className="text-blue-600" />,
            unit: language === 'vi' ? 'VNĐ/m³' : 'VND/m³'
        },
        {
            key: 'garbage',
            nameEn: 'Garbage Collection',
            nameVi: 'Dịch vụ rác',
            price: dichVu.donGiaRac,
            icon: <Trash className="text-green-600" />,
            unit: language === 'vi' ? 'VNĐ/tháng' : 'VND/month'
        }
    ];

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <BadgeDollarSign className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {language === 'vi' ? `Bảng giá dịch vụ #${dichVu.maDichVu}` : `Service Price Table #${dichVu.maDichVu}`}
                                    </h3>
                                    <Badge className="bg-green-500">
                                        {language === 'vi' ? 'Đang áp dụng' : 'Active'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {serviceItems.map((service) => (
                                    <div key={service.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {service.icon}
                                            <div>
                                                <span className="font-medium text-sm">
                                                    {language === 'vi' ? service.nameVi : service.nameEn}
                                                </span>
                                                <div className="text-xs text-gray-500">{service.unit}</div>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-sm">
                                            {formatCurrency(service.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {language === 'vi' ? "Hành động" : 'Actions'}
                                </DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? "Chỉnh sửa giá" : 'Edit prices'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            <ServiceEditDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                dichVuData={dichVu}
                onUpdateSuccess={onUpdateSuccess}
            />
        </>
    )
}


