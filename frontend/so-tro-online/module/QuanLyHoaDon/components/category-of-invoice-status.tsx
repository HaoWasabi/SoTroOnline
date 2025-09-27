"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguageStore } from "@/zustand/language-tranlator"

export default function CategoryOfInvoiceStatus({categoryName,  quantity}: {categoryName: string, quantity: number}) {

    const {language} = useLanguageStore();

    return (
        <Card className="">
            <CardContent className="">
                <p className={`text-4xl font-bold ${
                    categoryName === "Total Revenue" ? "text-green-600" : 
                    categoryName === "Pending Payments" ? "text-blue-600" : 
                    categoryName === "Overdue Amount"? "text-yellow-600" : "text-gray-900"
                }`
                }>
                    {quantity}
                </p>
                <p className="text-sm text-gray-600">
                    {language === 'vi' ? (
                        categoryName === 'Total Revenue' ? 'Tổng doanh thu' : 
                        categoryName === 'Pending Payments' ? 'Thanh toán đang chờ xử lý' : 
                        categoryName === 'Overdue Amount' ? 'Số tiền quá hạn' : 'Tổng số hóa đơn'
                    ) : categoryName}
                </p>
            </CardContent>
        </Card>
    )
}