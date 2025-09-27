"use client"

import { Card, CardContent } from "@/components/ui/card";
import { useLanguageStore } from "@/zustand/language-tranlator";

export default function TypeOfRoomCard({roomName,  quantity}: {roomName: string, quantity: number}) {

    const {language} = useLanguageStore()

    return (
        <Card className="">
            <CardContent className="">
                <p className={`text-4xl font-bold ${
                    roomName === "All Available" ? "text-green-600" : 
                    roomName === "Occupied Rooms" ? "text-blue-600" : 
                    roomName === "In Maintenance"? "text-yellow-600" : "text-gray-900"
                }`
                }>
                    {quantity}
                </p>
                <p className="text-sm text-gray-600">
                    {language === 'vi' ? (
                        roomName === 'All Available' ? 'Phòng trống' : 
                        roomName === 'Occupied Rooms' ? 'Phòng có người ở' : 
                        roomName === 'In Maintenance' ? 'Phòng đang bảo trì' : 'Tất cả phòng'
                    ) : roomName}
                </p>
            </CardContent>
        </Card>
    )
}