import { authenticatedFetch } from '@/utils/auth-api';

const API_BASE_URL = 'http://localhost:8080';

export interface DichVuResponse {
    maDichVu: number;
    donGiaDien: number;
    donGiaNuoc: number;
    donGiaRac: number;
}

export interface DichVuRequest {
    donGiaDien: number;
    donGiaNuoc: number;
    donGiaRac: number;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Get single service information
export async function getDichVuApi(): Promise<ApiResponse<DichVuResponse>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to retrieve service information`);
        }

        const result: ApiResponse<DichVuResponse> = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching DichVu:', error);
        throw error;
    }
}

// Update service information
export async function updateDichVuApi(id: number, dichVuRequest: DichVuRequest): Promise<ApiResponse<DichVuResponse>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dichVuRequest)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to update service information`);
        }

        const result: ApiResponse<DichVuResponse> = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating DichVu:', error);
        throw error;
    }
}