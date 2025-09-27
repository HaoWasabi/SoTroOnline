"use client"

import { Card, CardContent } from "@/components/ui/card";
import { useLanguageStore } from "@/zustand/language-tranlator";

export default function TypeOfContractStatus({contractStatus,  quantity}: {contractStatus: string, quantity: number}) {

    const {language} = useLanguageStore()

    return (
        <Card className="">
            <CardContent className="">
                <p className={`text-4xl font-bold ${
                    contractStatus === "Active Contracts" ? "text-green-600" : 
                    contractStatus === "Expiring Soon" ? "text-blue-600" : 
                    contractStatus === "Pending"? "text-yellow-600" : "text-gray-900"
                }`
                }>
                    {quantity}
                </p>
                <p className="text-sm text-gray-600">
                    {language === 'vi' ? (
                        contractStatus === 'Active Contracts' ? 'Hợp đồng đang hoạt động' : 
                        contractStatus === 'Expiring Soon' ? 'Sắp hết hạn' : 
                        contractStatus === 'Pending' ? 'Đang chờ' : 'Tất cả phòng'
                    ) : contractStatus}
                </p>
            </CardContent>
        </Card>
    )
}