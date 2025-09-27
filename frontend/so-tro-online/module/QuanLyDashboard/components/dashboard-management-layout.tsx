"use client"

import { useLanguageStore } from "@/zustand/language-tranlator"
import { DollarSign, FileText, Home, Users } from "lucide-react";
import CategoryOfStatistic from "./category-of-statistic";


const categoriesOfStatistic: CategoryOfStatistic[] = [
    {
        category_title: "Total Users",
        category_vietnam_title: "Tổng số  người dùng",
        value: 128,
        short_description: "Registered tenants and managers",
        icon: <Users className="h-6 w-6 text-gray-400" />,
        changeType: "positive",
        changeValue: 14, // e.g., +14 new users this month
    },
    {
        category_title: "Available Rooms",
        category_vietnam_title: "Số phòng trống",
        value: 12,
        short_description: "Rooms currently vacant",
        icon: <Home className="h-6 w-6 text-gray-400" />,
        changeType: "negative",
        changeValue: -3, // e.g., 3 fewer available rooms compared to last month
    },
    {
        category_title: "Active Contracts",
        category_vietnam_title: "Số hợp đồng đang có hiệu lực",
        value: 56,
        short_description: "Ongoing rental agreements",
        icon: <FileText className="h-6 w-6 text-gray-400" />,
        changeType: "positive",
        changeValue: 5, // e.g., 5 new contracts signed
    },
    {
        category_title: "Monthly Revenue",
        category_vietnam_title: "Tổng doanh thu",
        value: 78500000,
        short_description: "VND collected this month",
        icon: <DollarSign className="h-6 w-6 text-gray-400" />,
        changeType: "positive",
        changeValue: 12, // e.g., +12% compared to last month
    },
];

export default function DashboardManagementLayout() {

    const {language} = useLanguageStore();

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                </h1>
                <p className="text-gray-600">
                    {language === 'vi' ? "Chào mừng bạn trở lại! Sau đây là những gì đang diễn ra với tài sản của bạn." : "Welcome back! Here's what's happening with your properties."}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoriesOfStatistic.map(categoryOfStatistic => (
                    <CategoryOfStatistic key={categoryOfStatistic.category_title} categoryOfStatistic={categoryOfStatistic} />
                ))}
            </div>
        </main>
    )
}