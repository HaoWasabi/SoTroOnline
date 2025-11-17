// API service for tenant management
import { Tenant } from '../types/Tenant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Get auth token from storage
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        return token;
    }
    return null;
};

// Create headers with authentication
const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export interface TenantResponse {
    success: boolean;
    message: string;
    data: {
        content: Tenant[];
        totalElements: number;
        totalPages: number;
        currentPage: number;
        size: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

export interface SingleTenantResponse {
    success?: boolean;
    message?: string;
    data?: Tenant;
    // Backend ApiResponse format
    status?: number;
}

export interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    data?: T;
    // Backend ApiResponse format  
    status?: number;
}

// Debug function to check authentication status
export const debugAuthStatus = () => {
    if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const user = sessionStorage.getItem('user');
        
        return {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasUser: !!user,
            accessToken: accessToken?.substring(0, 20) + '...',
        };
    }
    return null;
};

// Fetch all tenants with pagination
export const fetchTenants = async (page: number = 0, search?: string, status?: string): Promise<TenantResponse> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
        });
        
        if (search && search.trim()) {
            params.append('search', search.trim());
        }

        if (status && status.trim()) {
            params.append('status', status.trim());
        }

        const headers = getAuthHeaders();
        const url = `${API_BASE_URL}/api/tenants?${params.toString()}`;
        
        // Debug logging
        console.log('🌐 API Call:', {
            url,
            method: 'GET',
            params: Object.fromEntries(params),
            headers: headers
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', { status: response.status, errorText });
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ API Success Response:', data);
        return data;
    } catch (error) {
        console.error('💥 API Fetch Error:', error);
        throw error;
    }
};

// Fetch single tenant by ID
export const fetchTenantById = async (id: number): Promise<SingleTenantResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Create new tenant
export const createTenant = async (tenantData: Omit<Tenant, 'id'>): Promise<SingleTenantResponse> => {
    try {
        console.log('🆕 Creating tenant with data:', tenantData);
        
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/tenants/create`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(tenantData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            // Try to parse JSON error response
            try {
                const errorData = JSON.parse(errorText);
                return {
                    success: false,
                    message: errorData.message || `HTTP error! status: ${response.status}`,
                    data: undefined,
                    status: response.status
                };
            } catch {
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }
        }

        const data = await response.json();
        
        // Handle backend ApiResponse format
        if (data.status && data.status >= 200 && data.status < 300) {
            return {
                success: true,
                message: data.message || 'Creation successful',
                data: data.data,
                status: data.status
            };
        } else if (data.success !== undefined) {
            return data;
        } else {
            // Fallback for direct data response
            return {
                success: true,
                message: 'Creation successful',
                data: data,
                status: 201
            };
        }
    } catch (error) {
        console.error('💥 Error creating tenant:', error);
        throw error;
    }
};

// Update tenant
export const updateTenant = async (id: number, tenantData: Partial<Tenant>): Promise<SingleTenantResponse> => {
    try {
        
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(tenantData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const data = await response.json();
        
        // Handle backend ApiResponse format
        if (data.status && data.status >= 200 && data.status < 300) {
            return {
                success: true,
                message: data.message || 'Update successful',
                data: data.data
            };
        } else if (data.success !== undefined) {
            return data;
        } else {
            // Fallback for direct data response
            return {
                success: true,
                message: 'Update successful',
                data: data
            };
        }
    } catch (error) {
        throw error;
    }
};

// Delete tenant
export const deleteTenant = async (id: number): Promise<ApiResponse<null>> => {
    try {
        
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}`, {
            method: 'DELETE',
            headers: headers,
        });



        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const data = await response.json();
        
        // Handle backend response format
        if (data.success !== undefined) {
            return data;
        } else {
            // Fallback
            return {
                success: true,
                message: 'Delete successful',
                data: null
            };
        }
    } catch (error) {
        throw error;
    }
};

// Restore deleted tenant
export const restoreTenant = async (id: number): Promise<SingleTenantResponse> => {
    try {
        console.log('🔄 Restoring tenant with ID:', id);
        
        const headers = getAuthHeaders();
        console.log('🔑 Restore request headers:', headers);

        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}/restore`, {
            method: 'PUT',
            headers: headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const data = await response.json();
        
        // Handle backend ApiResponse format
        if (data.status && data.status >= 200 && data.status < 300) {
            return {
                success: true,
                message: data.message || 'Restore successful',
                data: data.data
            };
        } else if (data.success !== undefined) {
            return data;
        } else {
            // Fallback for direct data response
            return {
                success: true,
                message: 'Restore successful',
                data: data
            };
        }
    } catch (error) {
        console.error('❌ Error restoring tenant:', error);
        throw error;
    }
};