"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Search, Calendar, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FilterComponent from "@/components/filter-component";
import PaginationComponent from "@/components/pagination";
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
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemsPerPage] = useState<number>(4); // At least 4 items per page
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<string>("");

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

    // Filter invoices based on search criteria
    const filteredInvoices = useMemo(() => {
        let result = invoices;

        // Filter by search query (invoice code or tenant name)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(invoice => 
                String(invoice.maHoaDon).toLowerCase().includes(query) ||
                (invoice.tenKhachThue || '').toLowerCase().includes(query) ||
                (invoice.tenPhong || '').toLowerCase().includes(query)
            );
        }

        // Filter by date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            
            result = result.filter(invoice => {
                const invoiceDate = new Date(invoice.ngayTao);
                return invoiceDate >= start && invoiceDate <= end;
            });
        }

        // Filter by status
        if (selectedFilter) {
            result = result.filter(invoice => {
                switch (selectedFilter) {
                    case "Paid":
                    case "Đã thanh toán":
                        return invoice.trangThai === "DA_THANH_TOAN";
                    case "Owing":
                    case "Còn nợ":
                        return invoice.trangThai === "CON_NO";
                    case "Deleted":
                    case "Đã xóa":
                        return invoice.trangThai === "DA_XOA";
                    default:
                        return true;
                }
            });
        }

        return result;
    }, [invoices, searchQuery, startDate, endDate, selectedFilter]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (mounted) await fetchInvoices();
        })();
        return () => {
            mounted = false;
        };
    }, [fetchInvoices]);

    // Pagination calculations using filtered invoices
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvoices = filteredInvoices.slice(startIndex, endIndex);
    const hasNext = currentPage < totalPages - 1;
    const hasPrevious = currentPage > 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setStartDate("");
        setEndDate("");
        setSelectedFilter("");
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(0);
    }, [searchQuery, startDate, endDate, selectedFilter]);

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
                            {/* <PeriodicInvoiceGeneration onSuccess={fetchInvoices} /> */}
                            <DebtTracking />
                            <InvoiceStatusTracking />
                            <NotificationSystem />
                            <RevenueReporting />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Search / Filter */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {language === "vi" ? "Tìm kiếm & Lọc" : "Search & Filter"}
                            </h3>
                            {(searchQuery || startDate || endDate || selectedFilter) && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    {language === "vi" ? "Xóa bộ lọc" : "Clear Filters"}
                                </Button>
                            )}
                        </div>
                        
                        {/* Search by invoice code and tenant */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder={
                                        language === "vi"
                                            ? "Tìm theo mã hóa đơn, tên khách thuê, phòng..."
                                            : "Search by invoice code, tenant name, room..."
                                    }
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <FilterComponent 
                                menu={menu} 
                                selectedFilter={selectedFilter}
                                onFilterChange={setSelectedFilter}
                            />
                        </div>

                        {/* Date Range Filter */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {language === "vi" ? "Từ ngày" : "Start Date"}
                                </Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {language === "vi" ? "Đến ngày" : "End Date"}
                                </Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full"
                                    min={startDate} // Ensure end date is not before start date
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    {language === "vi" ? "Kết quả" : "Results"}
                                </Label>
                                <div className="flex items-center h-10 px-3 bg-gray-50 border border-gray-200 rounded-md">
                                    <span className="text-sm text-gray-600">
                                        {language === "vi" 
                                            ? `${filteredInvoices.length} hóa đơn`
                                            : `${filteredInvoices.length} invoice${filteredInvoices.length !== 1 ? 's' : ''}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchQuery || startDate || endDate || selectedFilter) && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                                <span className="text-sm text-gray-600">
                                    {language === "vi" ? "Bộ lọc đang áp dụng:" : "Active filters:"}
                                </span>
                                {searchQuery && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                        {language === "vi" ? "Tìm kiếm:" : "Search:"} {searchQuery}
                                    </span>
                                )}
                                {startDate && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                        {language === "vi" ? "Từ:" : "From:"} {new Date(startDate).toLocaleDateString()}
                                    </span>
                                )}
                                {endDate && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                        {language === "vi" ? "Đến:" : "To:"} {new Date(endDate).toLocaleDateString()}
                                    </span>
                                )}
                                {selectedFilter && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                        {language === "vi" ? "Trạng thái:" : "Status:"} {selectedFilter}
                                    </span>
                                )}
                            </div>
                        )}
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
                ) : filteredInvoices.length === 0 ? (
                    <div className="col-span-full p-6">
                        {language === "vi"
                            ? "Không tìm thấy hóa đơn phù hợp với bộ lọc"
                            : "No invoices match the current filters"}
                    </div>
                ) : (
                    currentInvoices.map((inv) => (
                        <InvoiceCardComponent
                            key={inv.maHoaDon}
                            invoice={inv}
                            onDelete={fetchInvoices}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {!loading && !error && filteredInvoices.length > 0 && totalPages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-gray-600 text-center">
                                {language === "vi" 
                                    ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredInvoices.length)} trong tổng số ${filteredInvoices.length} hóa đơn`
                                    : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredInvoices.length)} of ${filteredInvoices.length} invoices`
                                }
                            </div>
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                hasNext={hasNext}
                                hasPrevious={hasPrevious}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}