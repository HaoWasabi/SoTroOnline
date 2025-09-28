"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Calendar, DollarSign, Download, Edit, Eye, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { useCallback } from "react";


export default function ContractCardComponent({contract}: {contract: Contract}) {

    const {language} = useLanguageStore();

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'Active':
                return 'default';
            case 'Pending':
                return 'secondary';
            case 'Expired':
                return 'outline';
            default:
                return 'outline';
        }
    }, [])
        

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {contract.contract_id}
                                </h3>
                                <p className="text-gray-600">{contract.contract_tenant} • {contract.room_name}</p>
                            </div>
                            <Badge
                                variant={getStatusColor(contract.status)}
                                className={
                                    contract.status === 'Active' ? 'bg-green-500' : 
                                    contract.status === 'Expired' ? 'bg-red-500 text-white' : ''
                                }
                            >
                                {language === 'vi' ? (
                                    contract.status === 'Active' ? 'Đang hoạt động' : 
                                    contract.status === 'Expired' ? 'Đã hết hạn' : 
                                    contract.status === 'Pending' ? 'Đang chờ' : ''
                                ): contract.status}
                            </Badge>
                        </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                        <span className="text-gray-500">
                            {language === 'vi' ? 'Ngày bắt đầu': 'Start Date'}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{contract.start_date}</span>
                        </div>
                        </div>
                        <div>
                            <span className="text-gray-500">
                                {language === 'vi' ? 'Ngày kết thúc': 'End Date'}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{contract.end_date}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-500">
                                {language === 'vi' ? "Tiền phòng" : 'Monthly Rent'}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-green-600">{contract.base_rent}</span>
                            </div>
                        </div>
                        {/* <div>
                            <span className="text-gray-500">Days Left</span>
                            <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className={`font-medium ${
                                contract.daysLeft < 0 ? 'text-red-600' :
                                contract.daysLeft < 90 ? 'text-yellow-600' : 'text-gray-900'
                                }`}>
                                {contract.daysLeft < 0 ? `${Math.abs(contract.daysLeft)} days overdue` : 
                                `${contract.daysLeft} days`}
                                </span>
                            </div>
                        </div> */}
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
                            <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                {language === 'vi' ? "Xem thông tin" : 'View Contract'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                                {language === 'vi' ? "Chỉnh sửa hợp đồng" : 'Edit Contract'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            {language === 'vi' ? "Tải file PDF" : 'Download PDF'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {language === 'vi' ? "Hủy hợp đồng" : 'Terminate Contract'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}