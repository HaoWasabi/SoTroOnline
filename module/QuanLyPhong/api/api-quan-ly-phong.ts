import { authenticatedFetch, getAuthHeaders, getAuthToken } from '@/utils/auth-api';

const API_BASE_URL = 'http://localhost:8080/api/rooms';

// Types for API responses
export interface RoomResponse {
  maPhong: number;
  hoTenQuanLy: string;
  maQuanLy: number;
  tenPhong: string;
  loaiPhong: string;
  diaChi: string;
  chieuDai: number;
  chieuRong: number;
  vatDung: string;
  giaThueCoBan: number;
  trangThai: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface RoomRequest {
  tenPhong: string;
  loaiPhong: string;
  diaChi: string;
  chieuDai: number;
  chieuRong: number;
  vatDung: string;
  giaThueCoBan: number;
  trangThai: string // Use union type for better type safety
  maQuanLy: number;
}

// Room API functions
export const roomApi = {
    // Get all rooms (non-paginated)
    getAllRooms: async (): Promise<ApiResponse<RoomResponse[]>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/all`);
        if (!response.ok) {
        throw new Error('Failed to fetch rooms');
        }
        return response.json();
    },

    // Get all rooms with pagination
    getAllRoomsPaged: async (page: number = 0, size: number = 6): Promise<ApiResponse<PagedResponse<RoomResponse>>> => {
        const url = `${API_BASE_URL}/all/paged?page=${page}&size=${size}`;
        const response = await authenticatedFetch(url);
        if (!response.ok) {
        throw new Error('Failed to fetch paged rooms');
        }
        return response.json();
    },

    // Get all active rooms (non-paginated)
    getAllRoomsActive: async (): Promise<ApiResponse<RoomResponse[]>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/active`);
        if (!response.ok) {
        throw new Error('Failed to fetch active rooms');
        }
        return response.json();
    },

    // Get all active rooms with pagination
    getAllRoomsActivePaged: async (page: number = 0, size: number = 6): Promise<ApiResponse<PagedResponse<RoomResponse>>> => {
        const url = `${API_BASE_URL}/active/paged?page=${page}&size=${size}`;
        const response = await authenticatedFetch(url);
        if (!response.ok) {
        throw new Error('Failed to fetch paged active rooms');
        }
        return response.json();
    },

    // Get room by ID
    getRoomById: async (id: number): Promise<ApiResponse<RoomResponse>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
        throw new Error('Failed to fetch room');
        }
        return response.json();
    },

    // Get active room by ID
    getRoomActiveById: async (id: number): Promise<ApiResponse<RoomResponse>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/active/${id}`);
        if (!response.ok) {
        throw new Error('Failed to fetch active room');
        }
        return response.json();
    },

    // Create room
    createRoom: async (roomRequest: RoomRequest): Promise<ApiResponse<RoomResponse>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(roomRequest),
        });
        if (!response.ok) {
            throw new Error('Failed to create room');
        }
        return response.json();
    },

    // Update room
    updateRoom: async (id: number, roomRequest: RoomRequest): Promise<ApiResponse<RoomResponse>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(roomRequest),
        });
        if (!response.ok) {
        throw new Error('Failed to update room');
        }
        return response.json();
    },

    // Delete room
    deleteRoom: async (id: number): Promise<ApiResponse<null>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        });
        if (!response.ok) {
        throw new Error('Failed to delete room');
        }
        return response.json();
    },

    // Search rooms (non-paginated)
    searchRooms: async (searchParams: {
        tenPhong?: string;
        loaiPhong?: string;
        diaChi?: string;
        chieuDai?: number;
        chieuRong?: number;
        vatDung?: string;
        giaThueCoBan?: number;
    }): Promise<ApiResponse<RoomResponse[]>> => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
        });
        
        const response = await authenticatedFetch(`${API_BASE_URL}/search?${params.toString()}`);
        if (!response.ok) {
        throw new Error('Failed to search rooms');
        }
        return response.json();
    },

    // Search rooms with pagination
    searchRoomsPaged: async (
        searchParams: {
            tenPhong?: string;
            loaiPhong?: string;
            diaChi?: string;
            chieuDai?: number;
            chieuRong?: number;
            vatDung?: string;
            giaThueCoBan?: number;
        },
        page: number = 0,
        size: number = 6
    ): Promise<ApiResponse<PagedResponse<RoomResponse>>> => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });
        params.append('page', page.toString());
        params.append('size', size.toString());
        
        const response = await authenticatedFetch(`${API_BASE_URL}/search/paged?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to search paged rooms');
        }
        return response.json();
    },

    // Import Excel
    importExcel: async (file: File): Promise<ApiResponse<null>> => {
        console.log('API: Starting import for file:', file.name, 'Size:', file.size);
        const formData = new FormData();
        formData.append('file', file);
        
        // For FormData uploads, we need to avoid setting Content-Type header
        // Let the browser set it automatically with proper boundary
        const token = getAuthToken();
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}/import`, {
            method: 'POST',
            headers: headers, // Only auth header, no Content-Type for FormData
            body: formData,
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API: Error response:', errorText);
            throw new Error(`Failed to import Excel file: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('API: Success response:', result);
        return result;
    },

    // Export Excel
    exportExcel: async (): Promise<Blob> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/export`);
        if (!response.ok) {
        throw new Error('Failed to export Excel file');
        }
        return response.blob();
    },
};