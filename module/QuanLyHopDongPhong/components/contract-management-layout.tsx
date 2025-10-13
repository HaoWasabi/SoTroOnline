"use client"

import { useLanguageStore } from "@/zustand/language-tranlator"
import { Search } from "lucide-react"
import TypeOfContractStatus from "./type-of-contract-status"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import FilterComponent from "@/components/filter-component"
import ContractCardComponent from "./contract-card"
import { ContractFormAsDialog } from "./contract-form-as-dialog"


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

const contracts: Contract[] = [
  {
    contract_id: "CTR-202509-001",
    manager_name: "Nguyen Van A",
    room_name: "Room 101",
    contract_tenant: "Tran Thi B",
    base_rent: "4,500,000 VND",
    start_date: "2025-09-01",
    end_date: "2026-09-01",
    status: "Active",
  },
  {
    contract_id: "CTR-202509-002",
    manager_name: "Le Van C",
    room_name: "Room 203",
    contract_tenant: "Pham Van D",
    base_rent: "5,000,000 VND",
    start_date: "2025-08-15",
    end_date: "2026-08-15",
    status: "Pending",
  },
  {
    contract_id: "CTR-202509-003",
    manager_name: "Hoang Thi E",
    room_name: "Room 305",
    contract_tenant: "Nguyen Van F",
    base_rent: "3,800,000 VND",
    start_date: "2024-09-01",
    end_date: "2025-09-01",
    status: "Expired",
  },
  {
    contract_id: "CTR-202509-004",
    manager_name: "Pham Van G",
    room_name: "Room 401",
    contract_tenant: "Do Thi H",
    base_rent: "6,200,000 VND",
    start_date: "2025-09-10",
    end_date: "2026-09-10",
    status: "Active",
  },
  {
    contract_id: "CTR-202509-005",
    manager_name: "Tran Van I",
    room_name: "Room 102",
    contract_tenant: "Le Thi K",
    base_rent: "4,000,000 VND",
    start_date: "2025-07-01",
    end_date: "2026-07-01",
    status: "Pending",
  },
];


export default function ContractManagementLayout() {

    const {language} = useLanguageStore()

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
                <ContractFormAsDialog />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <TypeOfContractStatus contractStatus="Active Contracts" quantity={1} />
                <TypeOfContractStatus contractStatus="Expiring Soon" quantity={1} />
                <TypeOfContractStatus contractStatus="Pending" quantity={1} />
                <TypeOfContractStatus contractStatus="Expired" quantity={1} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map(contract => (
                    <ContractCardComponent key={contract.contract_id} contract={contract} />
                ))}
            </div>
        </main>
    )
}