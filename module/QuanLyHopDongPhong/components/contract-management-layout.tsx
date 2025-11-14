"use client"

import type { Contract } from "../types/contract";
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Search } from "lucide-react"
import { useState } from "react";
import TypeOfContractStatus from "./type-of-contract-status"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import FilterComponent from "@/components/filter-component"
import { ContractFormAsDialog } from "./contract-form-adding"
import GridOfContractCard from "./grid-of-contract"


const menu = [
    {
        vietnamItem: "Đang hoạt động",
        englishItem: "Active"
    },
    {
        vietnamItem: "Đã hết hạn",
        englishItem: "Expired"
    },
]

export default function ContractManagementLayout() {
    const {language} = useLanguageStore()
    const [refreshKey, setRefreshKey] = useState(0)

    const handleContractUpdate = () => {
        // Force refresh of the grid component
        setRefreshKey(prev => prev + 1)
    }

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === 'vi' ? 'Quản lý hợp đồng' : 'Contract Management'}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? 'Quản lý hợp đồng cho thuê và hợp đồng thuê nhà' : 'Manage rental agreements and lease contracts'}
                    </p>
                </div>
                <ContractFormAsDialog onSuccess={handleContractUpdate} />
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
            
            {/* Use the paginated grid component */}
            <GridOfContractCard refreshTrigger={refreshKey} />
        </main>
    )
}