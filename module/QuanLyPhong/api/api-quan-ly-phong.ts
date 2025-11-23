import { authenticatedFetch, getAuthHeaders, getAuthToken } from '@/utils/auth-api';

// Get current manager ID from user session for SAAS support
export const getCurrentManagerId = (): number | null => {
    if (typeof window !== 'undefined') {
        const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
        
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const managerId = user.maTaiKhoan || user.id || null;
                return managerId;
            } catch (error) {
                console.warn('Failed to parse user data:', error);
                return null;
            }
        }
    }
    return null;
};

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
    // Get all rooms (non-paginated) - SAAS enabled
    getAllRooms: async (managerId?: number): Promise<ApiResponse<RoomResponse[]>> => {
        const currentManagerId = managerId ?? getCurrentManagerId();
        const url = currentManagerId ? `${API_BASE_URL}/all?managerId=${currentManagerId}` : `${API_BASE_URL}/all`;
        const response = await authenticatedFetch(url);
        if (!response.ok) {
        throw new Error('Failed to fetch rooms');
        }
        return response.json();
    },

    // Get all rooms with pagination - SAAS enabled
    getAllRoomsPaged: async (page: number = 0, size: number = 6, managerId?: number): Promise<ApiResponse<PagedResponse<RoomResponse>>> => {
        const currentManagerId = managerId ?? getCurrentManagerId();
        let url = `${API_BASE_URL}/all/paged?page=${page}&size=${size}`;
        if (currentManagerId) {
            url += `&managerId=${currentManagerId}`;
        }
        const response = await authenticatedFetch(url);
        if (!response.ok) {
        throw new Error('Failed to fetch paged rooms');
        }
        return response.json();
    },

    // Get all active rooms (non-paginated) - SAAS enabled
    getAllRoomsActive: async (managerId?: number): Promise<ApiResponse<RoomResponse[]>> => {
        const currentManagerId = managerId ?? getCurrentManagerId();
        const url = currentManagerId ? `${API_BASE_URL}/active?managerId=${currentManagerId}` : `${API_BASE_URL}/active`;
        const response = await authenticatedFetch(url);
        if (!response.ok) {
        throw new Error('Failed to fetch active rooms');
        }
        return response.json();
    },

    // Get all active rooms with pagination - SAAS enabled
    getAllRoomsActivePaged: async (page: number = 0, size: number = 6, managerId?: number): Promise<ApiResponse<PagedResponse<RoomResponse>>> => {
        const currentManagerId = managerId ?? getCurrentManagerId();
        let url = `${API_BASE_URL}/active/paged?page=${page}&size=${size}`;
        if (currentManagerId) {
            url += `&managerId=${currentManagerId}`;
        }
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
    deleteRoom: async (id: number): Promise<ApiResponse<null> | { error: string }> => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            });
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = 'Failed to delete room';
                try {
                    const errorData = await response.json();
                    // Check for different possible error response structures
                    errorMessage = errorData.message || errorData.data || errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, try to get text
                    try {
                        const textResponse = await response.text();
                        if (textResponse) {
                            errorMessage = textResponse;
                        } else {
                            errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
                        }
                    } catch (textError) {
                        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
                    }
                }
                return { error: errorMessage };
            }
            return response.json();
        } catch (error) {
            return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    },

    // Search rooms (non-paginated) - SAAS enabled
    searchRooms: async (searchTerm: string, managerId?: number): Promise<ApiResponse<RoomResponse[]>> => {
        const params = new URLSearchParams();
        if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
            params.append('search', searchTerm.trim());
        }
        
        // Add manager filter for SAAS support
        const currentManagerId = managerId ?? getCurrentManagerId();
        if (currentManagerId) {
            params.append('managerId', currentManagerId.toString());
        }
        
        const response = await authenticatedFetch(`${API_BASE_URL}/search?${params.toString()}`);
        if (!response.ok) {
        throw new Error('Failed to search rooms');
        }
        return response.json();
    },

    // Search rooms with pagination - SAAS enabled
    searchRoomsPaged: async (
        searchTerm: string,
        page: number = 0,
        size: number = 6,
        managerId?: number,
        statusFilter?: string
    ): Promise<ApiResponse<PagedResponse<RoomResponse>>> => {
        const params = new URLSearchParams();
        if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
            params.append('search', searchTerm.trim());
        }
        if (statusFilter && typeof statusFilter === 'string' && statusFilter.trim()) {
            params.append('status', statusFilter.trim());
        }
        params.append('page', page.toString());
        params.append('size', size.toString());
        
        // Add manager filter for SAAS support
        const currentManagerId = managerId ?? getCurrentManagerId();
        if (currentManagerId) {
            params.append('managerId', currentManagerId.toString());
        }
        
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

    // Tenant Management Functions
    getRoomTenants: async (roomId: number): Promise<ApiResponse<any[]>> => {
        const response = await authenticatedFetch(`${API_BASE_URL}/${roomId}/tenants`);
        if (!response.ok) {
            throw new Error('Failed to fetch room tenants');
        }
        return response.json();
    },

    addTenantToRoom: async (roomId: number, tenantId: number, managerId: number): Promise<ApiResponse<any> | { error: string }> => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/${roomId}/tenants/${tenantId}?managerId=${managerId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                let errorMessage = 'Failed to add tenant to room';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.data || errorData.message || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
                }
                return { error: errorMessage };
            }
            return response.json();
        } catch (error) {
            return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    },

    removeTenantFromRoom: async (roomId: number, tenantId: number): Promise<ApiResponse<string> | { error: string }> => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/${roomId}/tenants/${tenantId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                let errorMessage = 'Failed to remove tenant from room';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.data || errorData.message || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
                }
                return { error: errorMessage };
            }
            return response.json();
        } catch (error) {
            return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    },
};

// Get available rooms for contract creation (rooms with 'phongTrong' status) - SAAS enabled
export async function getAvailableRoomsForContract(): Promise<{ status: string; message: string; data: RoomResponse[] | null }> {
    try {
        // Get current manager ID for SAAS filtering
        const managerId = getCurrentManagerId();
        let url = `${API_BASE_URL}/search?trangThai=phongTrong`;
        
        if (managerId) {
            url += `&managerId=${managerId}`;
        }
        
        const response = await authenticatedFetch(url)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.message === 'success' && result.data) {
            return {
                status: 'success',
                message: 'Available rooms fetched successfully',
                data: result.data
            }
        }
        
        return {
            status: 'error',
            message: 'Failed to fetch available rooms',
            data: null
        }
    } catch (error) {
        console.error('Error fetching available rooms:', error)
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to fetch available rooms',
            data: null
        }
    }
}

// Convenience methods for current user's manager scope (SAAS-friendly)
export const currentManagerRoomApi = {
    // Get all rooms for current manager
    getAllRooms: () => roomApi.getAllRooms(),
    getAllRoomsPaged: (page?: number, size?: number) => roomApi.getAllRoomsPaged(page, size),
    getAllRoomsActive: () => roomApi.getAllRoomsActive(),
    getAllRoomsActivePaged: (page?: number, size?: number) => roomApi.getAllRoomsActivePaged(page, size),
    
    // Search rooms for current manager
    searchRooms: (searchTerm: string) => roomApi.searchRooms(searchTerm),
    
    searchRoomsPaged: (searchTerm: string, page?: number, size?: number) => roomApi.searchRoomsPaged(searchTerm, page, size),
};