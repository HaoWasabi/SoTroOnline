"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useCallback } from "react";

export default function RoomCardComponent({room} : {room: Room}) {

    const {language} = useLanguageStore();

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'Available':
                return 'default';
            case 'Phòng trống': 
                return 'default';
            case 'Occupied':
                return 'secondary';
            case 'Phòng có người ở':
                return 'secondary';
            case 'In Maintenance':
                return 'destructive';
            case 'Bảo trì': 
                return 'destructive';
            default:
                return 'outline';
        }
    }, []);


    return (
        <Card className="hover:shadow-md transition-shadow">
            {/* <div className="aspect-video bg-gray-100">
                <img
                    src={room.images[0]}
                    alt={room.number}
                    className="w-full h-full object-cover"
                />
            </div> */}
            <CardHeader className="">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <CardTitle className="text-lg">{room.name}</CardTitle>
                            <span>{room.room_id}</span>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                            
                            <Badge variant={getStatusColor(room.roomStatus)}>
                                {   
                                    language === 'vi' ?
                                    (
                                        room.roomStatus === 'Available' ? 'Phòng trống' :
                                        room.roomStatus === 'Occupied' ? 'Phòng có người ở' :
                                        room.roomStatus === 'In Maintenance' ? 'Bảo trì' : ''
                                    ) : room.roomStatus
                                }
                            </Badge>
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {language === 'vi' ? 'Hành động' : 'Actions'}    
                            </DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Xem thông tin' : 'View Details'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Chỉnh sửa' : 'Edit Room'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Xóa phòng' : 'Delete Room'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="">
                <span className="text-2xl font-bold text-green-600">{room.baseRent} VND</span>
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <p className="text-gray-500">
                            {language === 'vi' ? 'Địa chỉ: ' : 'Address: '}{room.address}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-gray-500">
                            {language === 'vi' ? 'Chiều dài: ' : 'Width: '}{room.width}m
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-gray-500">
                            {language === 'vi' ? 'Chiều rộng: ' : 'height: '}{room.height}m
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    
                    
                </div>

                {/* <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{room.floor}</span>
                    <span>•</span>
                    <span>{room.furnished ? 'Furnished' : 'Unfurnished'}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                    </Badge>
                    ))}
                </div> */}
            </CardContent>
        </Card>
    )
}