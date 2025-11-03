"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Search } from "lucide-react"
import FilterComponent from "@/components/filter-component"
import { TenantForm } from "./tenant-form"
import ListOfTenants from "./list-of-tenants"
import { useState } from "react"


const menu = [
    {
        vietnamItem: "Đang hoạt động",
        englishItem: "Active",
        value: "hoatDong"
    },
    {
        vietnamItem: "Không xác định",
        englishItem: "Unknown",
        value: "unknown"
    },
    {
        vietnamItem: "Đã xóa",
        englishItem: "Deleted",
        value: "daXoa"
    },
]

export default function TenantManagementLayout() {

    const {language} = useLanguageStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status)
    }

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === 'vi' ? 'Quản lý khách thuê' : 'Tenant Management'}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? 'Quản lý thông tin khách thuê' : 'Manage all your tenants and their information'}
                    </p>
                </div>
                <TenantForm />
            </div>
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={
                                    language === 'vi' 
                                        ? "Tìm kiếm theo mã khách, mã đại diện, CCCD, hoặc tên..."
                                        : "Search by tenant ID, representative ID, ID card, or name..."
                                }
                                className="pl-10"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <FilterComponent 
                            menu={menu}
                            onFilterChange={handleStatusFilter}
                            selectedFilter={statusFilter}
                        />
                    </div>
                </CardContent>
            </Card>
            <ListOfTenants searchTerm={searchTerm} statusFilter={statusFilter} />
        </main>
    )
}