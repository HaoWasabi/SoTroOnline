"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useState, useEffect } from "react";
import { Toast } from "@/components/toast";
import { useToast } from "@/hook/useToast";
import { Search, Filter, Plus, Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUtilityUsage, getUtilityUsageForCurrentManager} from "../api/api-utility-usage";
import { currentManagerRoomApi } from "@/module/QuanLyPhong/api/api-quan-ly-phong";
import { UtilityUsageResponse } from "../types/utility-usage-types";
import UtilityUsageCard from "./utility-usage-card";
import UtilityUsageFormDialog from "./utility-usage-form-dialog";

interface Room {
    maPhong: number;
    tenPhong: string;
    trangThai: string;
}

export default function UtilityUsageLayout() {
    const { language } = useLanguageStore();
    const { toast, showError, showSuccess, removeToast } = useToast();
    const [utilityUsageData, setUtilityUsageData] = useState<UtilityUsageResponse[]>([]);
    const [filteredData, setFilteredData] = useState<UtilityUsageResponse[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        filterData();
    }, [utilityUsageData, searchQuery, selectedRoom, selectedStatus, selectedMonth]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch utility usage data and rooms concurrently
            // Use manager-specific endpoint for SAAS multi-tenant filtering
            const [utilityResult, roomsResult] = await Promise.all([
                getUtilityUsageForCurrentManager(), // Only get data for current manager
                currentManagerRoomApi.getAllRoomsActivePaged(0, 1000) // Get all active rooms
            ]);

            // Handle utility usage data
            if (utilityResult.message === 'success' && Array.isArray(utilityResult.data)) {
                setUtilityUsageData(utilityResult.data);
            } else {
                console.warn('Unexpected utility usage response:', utilityResult);
                setUtilityUsageData([]);
            }

            // Handle rooms data
            if (roomsResult.data && Array.isArray(roomsResult.data.content)) {
                setRooms(roomsResult.data.content);
            } else {
                console.warn('Unexpected rooms response:', roomsResult);
                setRooms([]);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            showError(language === 'vi' ? 'Có lỗi xảy ra khi tải dữ liệu' : 'Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchInitialData();
        showSuccess(language === 'vi' ? 'Dữ liệu của bạn đã được làm mới' : 'Your data refreshed');
    };

    const filterData = () => {
        let filtered = [...utilityUsageData];

        // Filter by search query (room name)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.tenPhong.toLowerCase().includes(query) ||
                item.maPhong.toString().includes(query)
            );
        }

        // Filter by selected room
        if (selectedRoom !== "all") {
            filtered = filtered.filter(item => item.maPhong.toString() === selectedRoom);
        }

        // Filter by status
        if (selectedStatus !== "all") {
            filtered = filtered.filter(item => item.trangThai === selectedStatus);
        }

        // Filter by month
        if (selectedMonth !== "all") {
            filtered = filtered.filter(item => {
                const itemMonth = new Date(item.thangNam).toISOString().slice(0, 7);
                return itemMonth === selectedMonth;
            });
        }

        setFilteredData(filtered);
    };

    const getUniqueMonths = () => {
        const months = utilityUsageData.map(item => {
            const date = new Date(item.thangNam);
            return date.toISOString().slice(0, 7);
        });
        return [...new Set(months)].sort().reverse();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-600 font-medium">
                        {language === 'vi' ? 'Đang tải dữ liệu...' : 'Loading data...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Building2 className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {language === 'vi' ? 'Quản lý chỉ số điện nước' : 'Utility Usage Management'}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {language === 'vi' ? 'Theo dõi và quản lý chỉ số điện, nước của các phòng bạn quản lý' : 'Track and manage electricity and water readings for your managed rooms'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleRefresh}
                            variant="outline"
                            className="rounded-xl border-2 border-gray-300 hover:border-gray-400"
                        >
                            {language === 'vi' ? 'Làm mới' : 'Refresh'}
                        </Button>
                        <UtilityUsageFormDialog onSuccess={handleRefresh} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-0 rounded-2xl bg-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {language === 'vi' ? 'Bộ lọc' : 'Filters'}
                        </h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {language === 'vi' ? 'Tìm kiếm' : 'Search'}
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder={language === 'vi' ? 'Tìm theo tên phòng...' : 'Search by room name...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Room Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {language === 'vi' ? 'Phòng' : 'Room'}
                            </label>
                            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {language === 'vi' ? 'Tất cả phòng' : 'All rooms'}
                                    </SelectItem>
                                    {rooms.map((room) => (
                                        <SelectItem key={room.maPhong} value={room.maPhong.toString()}>
                                            {room.tenPhong} ({room.maPhong})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {language === 'vi' ? 'Trạng thái' : 'Status'}
                            </label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {language === 'vi' ? 'Tất cả trạng thái' : 'All statuses'}
                                    </SelectItem>
                                    <SelectItem value="hoatDong">
                                        {language === 'vi' ? 'Đang hoạt động' : 'Active'}
                                    </SelectItem>
                                    <SelectItem value="daXoa">
                                        {language === 'vi' ? 'Đã xóa' : 'Deleted'}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Month Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {language === 'vi' ? 'Tháng' : 'Month'}
                            </label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {language === 'vi' ? 'Tất cả tháng' : 'All months'}
                                    </SelectItem>
                                    {getUniqueMonths().map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {new Date(month + '-01').toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {language === 'vi' ? 'Danh sách chỉ số' : 'Utility Readings'} 
                        <span className="ml-2 text-sm font-normal text-gray-600">
                            ({filteredData.length} {language === 'vi' ? 'bản ghi' : 'records'})
                        </span>
                    </h2>
                </div>

                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredData.map((utilityUsage) => (
                            <UtilityUsageCard
                                key={utilityUsage.id}
                                utilityUsage={utilityUsage}
                                onUpdate={handleRefresh}
                                onDelete={handleRefresh}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="border-2 border-dashed border-gray-300 rounded-2xl">
                        <CardContent className="py-16">
                            <div className="text-center">
                                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {language === 'vi' ? 'Không có dữ liệu' : 'No data found'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {language === 'vi' 
                                        ? 'Không tìm thấy bản ghi nào khớp với bộ lọc hiện tại.'
                                        : 'No records found matching the current filters.'
                                    }
                                </p>
                                <UtilityUsageFormDialog onSuccess={handleRefresh}>
                                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        {language === 'vi' ? 'Thêm chỉ số đầu tiên' : 'Add first reading'}
                                    </Button>
                                </UtilityUsageFormDialog>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={removeToast}
                />
            )}
        </div>
    );
}