import { authenticatedFetch } from '@/utils/auth-api';
import type { UtilityUsageRequest, UtilityUsageResponse, ApiResponseV2 } from '../types/utility-usage-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Get all utility usage records
export async function getAllUtilityUsage(): Promise<ApiResponseV2<UtilityUsageResponse[]>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service-using/all`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to retrieve utility usage records`);
        }

        const result: ApiResponseV2<UtilityUsageResponse[]> = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching utility usage:', error);
        throw error;
    }
}

// Get utility usage records by room
export async function getUtilityUsageByRoom(maPhong: number): Promise<ApiResponseV2<UtilityUsageResponse[]>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service-using/room/${maPhong}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to retrieve utility usage for room ${maPhong}`);
        }

        const result: ApiResponseV2<UtilityUsageResponse[]> = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching utility usage by room:', error);
        throw error;
    }
}

// Get single utility usage record
export async function getUtilityUsage(id: number): Promise<ApiResponseV2<UtilityUsageResponse>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service-using/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to retrieve utility usage record`);
        }

        const result: ApiResponseV2<UtilityUsageResponse> = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching utility usage:', error);
        throw error;
    }
}

// Create new utility usage record
export async function createUtilityUsage(utilityUsageRequest: UtilityUsageRequest): Promise<ApiResponseV2<UtilityUsageResponse>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service-using`, {
            method: 'POST',
            body: JSON.stringify(utilityUsageRequest)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to create utility usage record`);
        }

        const result: ApiResponseV2<UtilityUsageResponse> = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating utility usage:', error);
        throw error;
    }
}

// Update utility usage record
export async function updateUtilityUsage(id: number, utilityUsageRequest: UtilityUsageRequest): Promise<ApiResponseV2<UtilityUsageResponse>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service-using/${id}`, {
            method: 'PUT',
            body: JSON.stringify(utilityUsageRequest)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to update utility usage record`);
        }

        const result: ApiResponseV2<UtilityUsageResponse> = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating utility usage:', error);
        throw error;
    }
}

// Delete utility usage record
export async function deleteUtilityUsage(id: number): Promise<ApiResponseV2<null>> {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/service-using/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to delete utility usage record`);
        }

        const result: ApiResponseV2<null> = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting utility usage:', error);
        throw error;
    }
}