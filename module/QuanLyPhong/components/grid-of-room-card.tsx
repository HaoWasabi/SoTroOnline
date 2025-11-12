"use client"

import { useState, useEffect, useCallback } from "react";
import RoomCardComponent from "./room-card";
import PaginationComponent from "@/components/pagination";
import { roomApi } from "../api/api-quan-ly-phong";
import { Room, RoomResponse, PagedResponse, ApiResponse, mapRoomResponseToRoom } from "../types/room-types";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/useToast";

interface GridOfRoomCardProps {
  searchParams?: {
    tenPhong?: string;
    loaiPhong?: string;
    diaChi?: string;
    chieuDai?: number;
    chieuRong?: number;
    vatDung?: string;
    giaThueCoBan?: number;
    trangThai?: string; // Add status filter
  };
  onRoomUpdate?: (room: Room) => void;
  onRoomDelete?: (room: Room) => void;
}

export default function GridOfRoomCard({ 
  searchParams, 
  onRoomUpdate,
  onRoomDelete
}: GridOfRoomCardProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    
    const { language } = useLanguageStore();
    const { showSuccess, showError } = useToast();
    const pageSize = 6;

    const fetchRooms = useCallback(async (page: number, showLoading: boolean = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);
        
            let response: ApiResponse<PagedResponse<RoomResponse>>;
            
            // Check if we have search parameters (excluding trangThai for backend)
            const backendSearchParams = searchParams ? { ...searchParams } : {};
            delete backendSearchParams.trangThai; // Remove status filter for backend search
            
            const hasSearchParams = backendSearchParams && Object.values(backendSearchParams)
                .some(value => value !== undefined && value !== null && value !== '');
        
            if (hasSearchParams) {
                response = await roomApi.searchRoomsPaged(backendSearchParams, page, pageSize);
            } else {
                // Always fetch active rooms by default
                response = await roomApi.getAllRoomsActivePaged(page, pageSize);
            }
            
            const pagedData = response.data;
            let mappedRooms = pagedData.content.map(mapRoomResponseToRoom);
            
            // Apply client-side status filtering if trangThai is specified
            if (searchParams?.trangThai) {
                mappedRooms = mappedRooms.filter(room => room.status === searchParams.trangThai);
            }
            
            setRooms(mappedRooms);
            setCurrentPage(pagedData.page);
            setTotalPages(pagedData.totalPages);
            setTotalElements(searchParams?.trangThai ? mappedRooms.length : pagedData.totalElements); // Adjust count for filtered results
            setHasNext(pagedData.hasNext);
            setHasPrevious(pagedData.hasPrevious);
            setRetryCount(0);

            // Show success toast for search results
            const effectiveSearchParams = hasSearchParams || searchParams?.trangThai;
            if (effectiveSearchParams && mappedRooms.length > 0) {
                showSuccess(
                    language === 'vi' 
                        ? `Tìm thấy ${mappedRooms.length} phòng` 
                        : `Found ${mappedRooms.length} rooms`
                );
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching rooms';
            setError(errorMessage);
            console.error('Error fetching rooms:', err);
            
            // Show error toast
            showError(errorMessage);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [searchParams, pageSize, language, showError, showSuccess]);

    useEffect(() => {
        fetchRooms(0);
    }, [fetchRooms]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRooms(page, false);
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        fetchRooms(currentPage);
    };

    const handleRefresh = () => {
        fetchRooms(currentPage, false);
        showSuccess(
            language === 'vi' ? 'Danh sách phòng đã được cập nhật' : 'Room list has been updated'
        );
    };

    const getSearchSummary = () => {
        if (!searchParams) return null;
        
        const activeFilters = Object.entries(searchParams)
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => {
                const fieldNames: { [key: string]: string } = {
                    tenPhong: language === 'vi' ? 'Tên phòng' : 'Room name',
                    loaiPhong: language === 'vi' ? 'Loại phòng' : 'Room type',
                    diaChi: language === 'vi' ? 'Địa chỉ' : 'Address',
                    chieuDai: language === 'vi' ? 'Chiều dài' : 'Length',
                    chieuRong: language === 'vi' ? 'Chiều rộng' : 'Width',
                    vatDung: language === 'vi' ? 'Vật dụng' : 'Items',
                    giaThueCoBan: language === 'vi' ? 'Giá thuê' : 'Base rent',
                    trangThai: language === 'vi' ? 'Trạng thái' : 'Status'
                };
                return `${fieldNames[key] || key}: ${value}`;
            });
        
        return activeFilters.length > 0 ? activeFilters : null;
    };

    const searchSummary = getSearchSummary();

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            {language === 'vi' ? 'Đang tải danh sách phòng...' : 'Loading rooms...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-8">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                            {language === 'vi' ? 'Có lỗi xảy ra' : 'Something went wrong'}
                        </h3>
                        <p className="text-red-600 mb-6">
                            {error}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button 
                                onClick={handleRetry}
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-100"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {language === 'vi' ? 'Thử lại' : 'Try again'}
                            </Button>
                        </div>
                        {retryCount > 0 && (
                            <p className="text-sm text-red-500 mt-3">
                                {language === 'vi' ? `Đã thử ${retryCount} lần` : `Tried ${retryCount} times`}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Empty state
    if (rooms.length === 0) {
        return (
            <Card className="border-gray-200">
                <CardContent className="p-12">
                    <div className="text-center">
                        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {language === 'vi' ? 'Không tìm thấy phòng nào' : 'No rooms found'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchSummary ? (
                                language === 'vi' 
                                    ? 'Không có phòng nào phù hợp với tiêu chí tìm kiếm của bạn'
                                    : 'No rooms match your search criteria'
                            ) : (
                                language === 'vi'
                                    ? 'Hiện tại chưa có phòng nào được tạo'
                                    : 'No rooms have been created yet'
                            )}
                        </p>
                        {searchSummary && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    <Filter className="w-4 h-4 inline mr-1" />
                                    {language === 'vi' ? 'Tiêu chí tìm kiếm:' : 'Search criteria:'}
                                </p>
                                <div className="space-y-1">
                                    {searchSummary.map((filter, index) => (
                                        <p key={index} className="text-xs text-gray-500">
                                            {filter}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button 
                            onClick={handleRefresh}
                            variant="outline"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {language === 'vi' ? 'Làm mới' : 'Refresh'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Success state with rooms
    return (
        <div className="space-y-6">
            {/* Header with stats and actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-lg font-semibold text-gray-900">
                        {language === 'vi' ? 
                            `${totalElements} phòng` :
                            `${totalElements} room${totalElements !== 1 ? 's' : ''}`
                        }
                    </p>
                    <p className="text-sm text-gray-600">
                        {language === 'vi' ? 
                            `Hiển thị ${rooms.length} trong tổng số ${totalElements} phòng` :
                            `Showing ${rooms.length} of ${totalElements} rooms`
                        }
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {language === 'vi' ? 'Làm mới' : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Search summary */}
            {searchSummary && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Filter className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-800 mb-1">
                                    {language === 'vi' ? 'Kết quả tìm kiếm' : 'Search Results'}
                                </p>
                                <div className="space-y-1">
                                    {searchSummary.map((filter, index) => (
                                        <p key={index} className="text-sm text-blue-700">
                                            {filter}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Room grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rooms.map(room => (
                    <RoomCardComponent 
                        key={room.room_id}
                        room={room}
                        onUpdate={() => {
                            // Refresh the room list when a room is updated
                            fetchRooms(currentPage, false);
                            onRoomUpdate?.(room);
                        }}
                        onDelete={() => {
                            // Refresh the room list when a room is deleted
                            fetchRooms(currentPage, false);
                            onRoomDelete?.(room);
                        }}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                    />
                </div>
            )}
        </div>
    );
}