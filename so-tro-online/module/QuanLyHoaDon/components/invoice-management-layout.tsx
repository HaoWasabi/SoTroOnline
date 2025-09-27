"use client"

import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Plus, Search } from "lucide-react";
import CategoryOfInvoiceStatus from "./category-of-invoice-status";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FilterComponent from "@/components/filter-component";
import GridOfContractCard from "@/module/QuanLyHopDongPhong/components/grid-of-contract";


const menu = [
    {
        vietnamItem: "Đã thanh toán",
        englishItem: "Paid"
    },
    {
        vietnamItem: "Đang chờ",
        englishItem: "Pending"
    },
    {
        vietnamItem: "Qúa hạn",
        englishItem: "Overdue"
    }
]

export default function InvoiceManagementLayout() {

    const {language} = useLanguageStore();

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === 'vi' ? 'Quản lý hóa đơn' : 'Invoice Management'}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? 'Theo dõi thanh toán tiền thuê nhà và hóa đơn' : 'Track rent payments and billing'}
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'vi' ? 'Thêm hóa đơn' : 'Add Invoice'}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CategoryOfInvoiceStatus categoryName="Total Revenue" quantity={10}/>
                <CategoryOfInvoiceStatus categoryName="Pending Payments" quantity={8}/>
                <CategoryOfInvoiceStatus categoryName="Overdue Amount" quantity={20}/>
                <CategoryOfInvoiceStatus categoryName="Total Invoices" quantity={15}/>
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
            <GridOfContractCard />
        </main>
    )
}