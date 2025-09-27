"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Atom, BadgeDollarSign, Edit, Eye, MoreHorizontal, Trash, Trash2, User, Waves } from "lucide-react"

export default function RoomServiceCard({roomService}: {roomService: RoomService}) {

    const {language} = useLanguageStore()

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                {
                                    roomService.service_name === 'Garbage Collection' ? <Trash className="text-blue-600" /> :
                                    roomService.service_name === 'Electricity Service' ? <Atom className="text-blue-600"/> :
                                    roomService.service_name === 'Water Service' ? <Waves className="text-blue-600"/> : ''
                                }
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {
                                        language === 'vi' ? (
                                            roomService.service_name === 'Garbage Collection' ? "Dịch vụ rác" :
                                            roomService.service_name === 'Electricity Service' ? "Dịch vụ điện" :
                                            roomService.service_name === 'Water Service' ? "Dịch vụ nước" : roomService.service_name
                                        ) : roomService.service_code
                                    }
                                </h3>
                                <p className="text-gray-600">{roomService.service_code}</p>
                            </div>
                            <Badge
                                className={
                                    roomService.status === 'Active' ? 'bg-green-500' : 
                                    roomService.status === 'Maintenance' ? 'bg-red-500 text-white' : ''
                                }
                            >
                                {language === 'vi' ? (
                                    roomService.status === 'Active' ? 'Đang hoạt động' : 
                                    roomService.status === 'Maintenance' ? 'Đã hết hạn' : ''
                                ): roomService.status}
                            </Badge>
                        </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div>
                            <span className="text-gray-500">
                                {language === 'vi' ? 'Người quản lý': 'Manager'}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                    <User className="h-4 w-4 text-gray-400"/>
                                    <span className="font-medium">{roomService.manager_name}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-500">
                                {language === 'vi' ? 'Gía dịch vụ': 'Service cost'}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                                <BadgeDollarSign className="h-4 w-4 text-gray-400"/>
                                <span className="font-medium">{roomService.base_cost}</span>
                            </div>
                        </div>
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
                                {language === 'vi' ? "Xem thông tin" : 'View room service'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                                {language === 'vi' ? "Chỉnh sửa thông tin" : 'Edit room service'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {language === 'vi' ? "Hủy dịch vụ" : 'Terminate'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}


