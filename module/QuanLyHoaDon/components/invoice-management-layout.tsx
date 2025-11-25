"use client"

import { useState, useEffect, useCallback } from "react";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FilterComponent from "@/components/filter-component";
import { InvoiceFormAsDialog } from "./invoice-form-adding";
import InvoiceCardComponent from "./invoice-card";
import PeriodicInvoiceGeneration from "./periodic-invoice-generation";
import DebtTracking from "./debt-tracking";
import InvoiceStatusTracking from "./invoice-status-tracking";
import NotificationSystem from "./notification-system";
import RevenueReporting from "./revenue-reporting";
import { getAllActiveInvoices } from "../api/api-quan-ly-hoa-don";
import type { Invoice } from "../types/invoice";


const menu = [
    { vietnamItem: "Đã thanh toán", englishItem: "Paid" },
    { vietnamItem: "Còn nợ", englishItem: "Owing" },
    { vietnamItem: "Đã xóa", englishItem: "Deleted" }
];

export default function InvoiceManagementLayout() {
    const { language } = useLanguageStore();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllActiveInvoices();
            if (res.status === "success" && Array.isArray(res.data)) {
                setInvoices(res.data as Invoice[]);
            } else {
                setInvoices([]);
                setError(
                    res.message ||
                        (language === "vi" ? "Không có hóa đơn" : "No invoices found")
                );
            }
        } catch (e: any) {
            setInvoices([]);
            setError(
                e?.message ||
                    (language === "vi"
                        ? "Không thể tải dữ liệu"
                        : "Failed to fetch invoices")
            );
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (mounted) await fetchInvoices();
        })();
        return () => {
            mounted = false;
        };
    }, [fetchInvoices]);

        return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === "vi"
                            ? "Quản lý hóa đơn"
                            : "Invoice Management"}
                    </h1>
                    <p className="text-gray-600">
                        {language === "vi"
                            ? "Theo dõi thanh toán tiền thuê nhà và hóa đơn"
                            : "Track rent payments and billing"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <InvoiceFormAsDialog onSuccess={fetchInvoices} />
                </div>
            </div>

            {/* Management Tools */}
            <Card className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            {language === "vi" ? "Công cụ quản lý" : "Management Tools"}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            <PeriodicInvoiceGeneration onSuccess={fetchInvoices} />
                            <DebtTracking />
                            <InvoiceStatusTracking />
                            <NotificationSystem />
                            <RevenueReporting />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search / Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={
                                    language === "vi"
                                        ? "Tìm kiếm khách thuê..."
                                        : "Search tenants..."
                                }
                                className="pl-10"
                            />
                        </div>
                        <FilterComponent menu={menu} />
                    </div>
                </CardContent>
            </Card>

            {/* Danh sách hóa đơn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full p-6">
                        {language === "vi" ? "Đang tải..." : "Loading..."}
                    </div>
                ) : error ? (
                    <div className="col-span-full p-6 text-red-600">{error}</div>
                ) : invoices.length === 0 ? (
                    <div className="col-span-full p-6">
                        {language === "vi"
                            ? "Không có hóa đơn"
                            : "No invoices found"}
                    </div>
                ) : (
                    invoices.map((inv) => (
                        <InvoiceCardComponent
                            key={inv.maHoaDon}
                            invoice={inv}
                            onDelete={fetchInvoices}
                        />
                    ))
                )}
            </div>
        </main>
    );
}