"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { BadgeDollarSign, Edit, MoreHorizontal, Zap, Droplets, Trash, Wifi, Cable, Settings } from "lucide-react"
import { DichVuResponse } from "../types/dich-vu-types"
import { useState } from "react"
import ServiceEditDialog from "./service-edit-dialog"

export default function RoomServiceCard({dichVu, onUpdateSuccess}: {dichVu: DichVuResponse, onUpdateSuccess: () => void}) {

    const {language} = useLanguageStore()
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const serviceItems = [
        {
            key: 'electricity',
            nameEn: 'Electricity',
            nameVi: 'Dịch vụ điện',
            price: dichVu.donGiaDien || 0,
            icon: <Zap className="h-5 w-5" />,
            unit: language === 'vi' ? 'VNĐ/kWh' : 'VND/kWh',
            bgColor: 'from-yellow-500 to-orange-500',
            textColor: 'text-white'
        },
        {
            key: 'water',
            nameEn: 'Water',
            nameVi: 'Dịch vụ nước',
            price: dichVu.donGiaNuoc || 0,
            icon: <Droplets className="h-5 w-5" />,
            unit: language === 'vi' ? 'VNĐ/m³' : 'VND/m³',
            bgColor: 'from-blue-500 to-cyan-500',
            textColor: 'text-white'
        },
        {
            key: 'wifi',
            nameEn: 'Internet/WiFi',
            nameVi: 'Dịch vụ WiFi',
            price: dichVu.donGiaWifi || 0,
            icon: <Wifi className="h-5 w-5" />,
            unit: language === 'vi' ? 'VNĐ/tháng' : 'VND/month',
            bgColor: 'from-purple-500 to-indigo-500',
            textColor: 'text-white'
        },
        {
            key: 'cable',
            nameEn: 'Cable TV',
            nameVi: 'Dịch vụ truyền hình',
            price: dichVu.donGiaCap || 0,
            icon: <Cable className="h-5 w-5" />,
            unit: language === 'vi' ? 'VNĐ/tháng' : 'VND/month',
            bgColor: 'from-pink-500 to-rose-500',
            textColor: 'text-white'
        },
        {
            key: 'garbage',
            nameEn: 'Garbage Collection',
            nameVi: 'Dịch vụ rác',
            price: dichVu.donGiaRac || 0,
            icon: <Trash className="h-5 w-5" />,
            unit: language === 'vi' ? 'VNĐ/tháng' : 'VND/month',
            bgColor: 'from-green-500 to-emerald-500',
            textColor: 'text-white'
        },
        {
            key: 'other',
            nameEn: 'Other Services',
            nameVi: 'Dịch vụ khác',
            price: dichVu.donGiaKhac || 0,
            icon: <Settings className="h-5 w-5" />,
            unit: language === 'vi' ? 'VNĐ/tháng' : 'VND/month',
            bgColor: 'from-gray-500 to-slate-500',
            textColor: 'text-white'
        }
    ];

    return (
        <>
            <Card className="w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                    <BadgeDollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                        {language === 'vi' ? 'Bảng Giá Dịch Vụ' : 'Service Price Table'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <span>{language === 'vi' ? 'Mã dịch vụ:' : 'Service ID:'} #{dichVu.maDichVu}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-green-200">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                                    {language === 'vi' ? 'Đang áp dụng' : 'Active'}
                                </div>
                            </Badge>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>
                                        {language === 'vi' ? "Hành động" : 'Actions'}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        {language === 'vi' ? "Chỉnh sửa giá" : 'Edit prices'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0">
                    {/* Services Grid */}
                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            <h4 className="font-bold text-sm text-gray-900">
                                {language === 'vi' ? 'Bảng giá dịch vụ' : 'Service Pricing'}
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {serviceItems.map((service) => (
                                <div key={service.key} className="group relative">
                                    <div className={`bg-gradient-to-br ${service.bgColor} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-0`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                {service.icon}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white/90 text-xs font-medium">{service.unit}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="text-white font-semibold text-sm leading-tight">
                                                {language === 'vi' ? service.nameVi : service.nameEn}
                                            </h5>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white text-lg font-bold">
                                                    {formatCurrency(service.price)}
                                                </span>
                                                <span className="text-white/80 text-xs font-medium">
                                                    VND
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Hover effect overlay */}
                                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Summary Section */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-500 to-slate-500"></div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {language === 'vi' ? 'Tổng cộng các dịch vụ' : 'Total Services'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-gray-900">
                                    {serviceItems.length} {language === 'vi' ? 'dịch vụ' : 'services'}
                                </span>
                            </div>
                        </div>
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


