"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import RoomCardComponent from "./room-card";
import PaginationComponent from "@/components/pagination";
import { roomApi } from "../api/api-quan-ly-phong";
import { Room, RoomResponse, PagedResponse, ApiResponse, mapRoomResponseToRoom } from "../types/room-types";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Search, Filter, Download, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/useToast";

interface GridOfRoomCardProps {
  searchTerm?: string;
  statusFilter?: string;
  onRoomUpdate?: (room: Room) => void;
  onRoomDelete?: (room: Room) => void;
}

export default function GridOfRoomCard({ 
  searchTerm,
  statusFilter, 
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
    const { taiKhoan } = useTaiKhoanStore();
    const { showSuccess, showError } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pageSize = 6;

    // Get current manager ID for SAAS filtering
    const currentManagerId = taiKhoan?.maTaiKhoan;

    const fetchRooms = useCallback(async (page: number, showLoading: boolean = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);

            // Validate manager context for SAAS
            if (!currentManagerId) {
                const errorMessage = language === 'vi' 
                    ? 'Không thể xác định người quản lý hiện tại. Vui lòng đăng nhập lại.' 
                    : 'Unable to identify current manager. Please login again.';
                setError(errorMessage);
                showError(errorMessage);
                setLoading(false);
                return;
            }

            console.log('🏠 Room Search - Manager ID:', currentManagerId, '| Search Term:', searchTerm, '| Status Filter:', statusFilter);

            let response: ApiResponse<PagedResponse<RoomResponse>>;
            
            // Determine if we have any search/filter criteria
            const hasSearchTerm = searchTerm && searchTerm.trim();
            const hasStatusFilter = statusFilter && statusFilter.trim();
            
            console.log('Fetching rooms for manager:', currentManagerId, 'searchTerm:', hasSearchTerm, 'statusFilter:', hasStatusFilter);
        
            if (hasSearchTerm || hasStatusFilter) {
                // Use search API with both search term and status filter
                response = await roomApi.searchRoomsPaged(
                    hasSearchTerm ? searchTerm.trim() : '', 
                    page, 
                    pageSize, 
                    currentManagerId,
                    hasStatusFilter ? statusFilter : undefined
                );
            } else {
                // Fetch all rooms when no search parameters - ensure manager filtering
                response = await roomApi.getAllRoomsPaged(page, pageSize, currentManagerId);
            }
            
            const pagedData = response.data;
            
            // Debug: Log raw API response to check manager fields
            if (pagedData.content && pagedData.content.length > 0) {
                console.log('🔍 DEBUG - Raw API response (first room):', pagedData.content[0]);
                console.log('🔍 DEBUG - Manager fields:', {
                    hoTenQuanLy: pagedData.content[0].hoTenQuanLy,
                    maQuanLy: pagedData.content[0].maQuanLy
                });
            }
            
            const mappedRooms = pagedData.content.map((roomResponse: RoomResponse) => {
                const mapped = mapRoomResponseToRoom(roomResponse);
                console.log('🔄 Mapping:', { 
                    original: { hoTenQuanLy: roomResponse.hoTenQuanLy, maQuanLy: roomResponse.maQuanLy },
                    mapped: { managerName: mapped.managerName, managerId: mapped.managerId }
                });
                return mapped;
            });
            
            setRooms(mappedRooms);
            setCurrentPage(pagedData.page);
            setTotalPages(pagedData.totalPages);
            setTotalElements(pagedData.totalElements);
            setHasNext(pagedData.hasNext);
            setHasPrevious(pagedData.hasPrevious);
            setRetryCount(0);

            // Show success toast for search results
            if ((hasSearchTerm || hasStatusFilter) && mappedRooms.length > 0) {
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
    }, [searchTerm, statusFilter, pageSize, language, showError, showSuccess, currentManagerId]);

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

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            const blob = await roomApi.exportExcel();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `rooms_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showSuccess(
                language === 'vi' 
                    ? 'Xuất file Excel thành công' 
                    : 'Excel export successful'
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Export failed';
            showError(
                language === 'vi' 
                    ? 'Có lỗi xảy ra khi xuất file Excel' 
                    : 'Failed to export Excel file'
            );
            console.error('Export error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImportExcel = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('File selected:', file);
        if (!file) {
            console.log('No file selected');
            return;
        }

        // Validate file type
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            console.log('Invalid file type:', file.name);
            showError(
                language === 'vi' 
                    ? 'Vui lòng chọn file Excel (.xlsx hoặc .xls)' 
                    : 'Please select an Excel file (.xlsx or .xls)'
            );
            return;
        }

        try {
            console.log('Starting import process...');
            setLoading(true);
            const response = await roomApi.importExcel(file);
            console.log('Import response:', response);
            
            showSuccess(
                language === 'vi' 
                    ? `Nhập file Excel thành công: ${response.message}` 
                    : `Excel import successful: ${response.message}`
            );
            
            // Refresh the room list after successful import
            await fetchRooms(0);
        } catch (error) {
            console.error('Import error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Import failed';
            showError(
                language === 'vi' 
                    ? 'Có lỗi xảy ra khi nhập file Excel' 
                    : 'Failed to import Excel file'
            );
        } finally {
            setLoading(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const getSearchSummary = () => {
        if (!searchTerm && !statusFilter) return null;

        const activeFilters = [];
        if (searchTerm) {
            activeFilters.push({ label: language === 'vi' ? 'Tìm kiếm' : 'Search', value: searchTerm });
        }
        if (statusFilter) {
            const statusNames: { [key: string]: string } = {
                phongTrong: language === 'vi' ? 'Phòng trống' : 'Available',
                hoatDong: language === 'vi' ? 'Phòng có người ở' : 'Occupied',
                baoTri: language === 'vi' ? 'Phòng đang bảo trì' : 'In Maintenance'
            };
            activeFilters.push({ label: language === 'vi' ? 'Trạng thái' : 'Status', value: statusNames[statusFilter] || statusFilter });
        }
        
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
                                            {filter.label}: {filter.value}
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
                        disabled={loading}
                    >
                        <RefreshCw className="w-4 h-4" />
                        {language === 'vi' ? 'Làm mới' : 'Refresh'}
                    </Button>
                    <Button 
                        onClick={handleImportExcel}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <Upload className="w-4 h-4" />
                        {language === 'vi' ? 'Nhập Excel' : 'Import Excel'}
                    </Button>
                    <Button 
                        onClick={handleExportExcel}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <Download className="w-4 h-4" />
                        {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
                    </Button>
                </div>

                {/* Hidden file input for Excel import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                />
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
                                            {filter.label}: {filter.value}
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
                <div className="flex justify-center py-4">
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