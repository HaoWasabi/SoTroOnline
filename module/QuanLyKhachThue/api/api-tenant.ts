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
export const fetchTenants = async (page: number = 0, search?: string, status?: string, managerId?: number): Promise<TenantResponse> => {
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

        // Add manager ID for SAAS multi-tenant support
        if (managerId) {
            params.append('managerId', managerId.toString());
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

// Convenience function to fetch tenants for current manager (SAAS support)
export const fetchTenantsForCurrentManager = async (page: number = 0, search?: string, status?: string): Promise<TenantResponse> => {
    const managerId = getCurrentManagerId();
    return fetchTenants(page, search, status, managerId || undefined);
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

// Create new tenant with manager ID
export const createTenant = async (tenantData: Omit<Tenant, 'maKhach'>, managerId?: number): Promise<SingleTenantResponse> => {
    try {
        // Add manager ID to tenant data for SAAS support
        // Use provided managerId or get from current user session
        const finalManagerId = managerId || tenantData.maNguoiQuanLy || getCurrentManagerId();
        
        const tenantWithManager = {
            ...tenantData,
            maNguoiQuanLy: finalManagerId
        };
        
        console.log('🆕 Creating tenant with data:', tenantWithManager);
        console.log('🔑 Manager ID:', finalManagerId);
        console.log('🔑 Current user:', getCurrentManagerId());
        
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/tenants/create`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(tenantWithManager),
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
export const deleteTenant = async (id: number): Promise<ApiResponse<null> | { error: string }> => {
    try {
        
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = 'Failed to delete tenant';
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
        return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
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