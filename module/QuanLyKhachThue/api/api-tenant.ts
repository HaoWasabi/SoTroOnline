// API service for tenant management
import { Tenant } from '../types/Tenant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Get auth token from storage
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        /*console.log('🔍 Checking for auth token in storage. Token found:', !!token);
        if (token) {
            console.log('🔍 Token preview:', token.substring(0, 20) + '...');
        }*/
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
        //console.log('🔑 Auth token found and added to headers:', token.substring(0, 20) + '...');
    } else {
        //console.warn('⚠️ No auth token found in storage');
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
    success: boolean;
    message: string;
    data: Tenant;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Debug function to check authentication status
export const debugAuthStatus = () => {
    if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const user = localStorage.getItem('user');
        
        /*console.log('🔍 Debug Auth Status:');
        console.log('  - Access Token:', accessToken ? accessToken.substring(0, 20) + '...' : 'NOT FOUND');
        console.log('  - Refresh Token:', refreshToken ? refreshToken.substring(0, 20) + '...' : 'NOT FOUND');
        console.log('  - User Data:', user ? JSON.parse(user) : 'NOT FOUND');*/
        
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
export const fetchTenants = async (page: number = 0, search?: string): Promise<TenantResponse> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
        });
        
        if (search && search.trim()) {
            params.append('search', search.trim());
        }

        const headers = getAuthHeaders();
        //console.log('📡 Making request to /api/tenants with headers:', headers);

        const response = await fetch(`${API_BASE_URL}/api/tenants?${params.toString()}`, {
            method: 'GET',
            headers: headers,
        });

        //console.log('📡 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const data = await response.json();
        //console.log('✅ Tenant data received:', data);
        return data;
    } catch (error) {
        //console.error('💥 Error fetching tenants:', error);
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
        //console.error('Error fetching tenant:', error);
        throw error;
    }
};

// Create new tenant
export const createTenant = async (tenantData: Omit<Tenant, 'id'>): Promise<SingleTenantResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tenants/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(tenantData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        //console.error('Error creating tenant:', error);
        throw error;
    }
};

// Update tenant
export const updateTenant = async (id: number, tenantData: Partial<Tenant>): Promise<SingleTenantResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(tenantData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        //console.error('Error updating tenant:', error);
        throw error;
    }
};

// Delete tenant
export const deleteTenant = async (id: number): Promise<ApiResponse<null>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tenants/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        //console.error('Error deleting tenant:', error);
        throw error;
    }
};