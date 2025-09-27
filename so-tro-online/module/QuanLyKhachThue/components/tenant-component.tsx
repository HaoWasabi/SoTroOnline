"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { MoreHorizontal, Edit, Mail, Trash2, Phone } from "lucide-react"

export default function TenantComponent({tenant}: {tenant: Tenant}) {

    const {language} = useLanguageStore();

    return (
        <Card key={tenant.name} className="w-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col items-start">
                        <p className="text-lg font-bold text-blue-600">
                            {tenant.name}
                        </p>
                        {/* <div>
                            <CardTitle className="text-lg">{tenant.name}</CardTitle>
                            <p className="text-sm text-gray-500">{tenant.room}</p>
                        </div> */}
                         <p className="text-sm text-gray-500">{tenant.represent_code}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{language === 'vi' ? "Hành động" : "Actions"}</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? "Chỉnh sửa khách thuê" : "Edit Tenant"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    {language === 'vi' ? "Gửi tin" : "Send Message"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {language === 'vi' ? "Xóa khách thuê" : "Remove Tenant"}
                                </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'vi' ? "Trạng thái" : "Status"}</span>
                    <Badge className={
                        tenant.status === 'isActive' ? "bg-green-400" : 
                        tenant.status === 'isDeleted' ? "bg-red-400" : "bg-gray-400"
                    } variant={
                        tenant.status === 'isActive' ? 'default' : 
                        tenant.status === 'isPending' ? 'secondary' : 'destructive'
                    }>
                    {language === 'vi' ? (
                        tenant.status === 'isActive' ? "Đang hoạt động" : 
                        tenant.status === 'isDeleted' ? "Đã bị xóa" : 
                        "Đang chờ"
                    ) : "Edit Tenant"}
                    </Badge>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-6 w-6 text-gray-400" />
                    <span className="text-gray-600 truncate">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-6 w-6 text-gray-400" />
                    <span className="text-gray-600">{tenant.phone}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}