import { Tenant } from "@/module/QuanLyKhachThue/types/Tenant";
import type { Contract } from "../types/contract";
import { getAuthHeaders } from "@/utils/auth-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Generic response type
interface ApiResponse<T = any> {
    status: string;
    message: string;
    data: T;
}


export async function getAllContracts(): Promise<{ status: string; message: string; data: Contract[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/all-active`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // Normalize different possible response shapes:
        // 1. API returns { status, message, data: [...] }
        // 2. API returns an array directly: [...]
        // 3. API returns { status: 'success', data: [...] } but data may be wrapped differently
        if (Array.isArray(payload)) {
            return {
                status: 'success',
                message: 'Fetched all contracts',
                data: payload as Contract[]
            };
        }

        if (payload && typeof payload === 'object') {
            // some backends return { message: 'success', data: [...] } instead of status
            const isSuccess = payload.status === 'success' || payload.message === 'success' || payload.message === 'ok' || payload.message === 'OK';
            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (status === 'success' ? 'Fetched all contracts' : 'Failed to fetch');
            // prefer payload.data if it's an array
            const rawArr = Array.isArray(payload.data) ? payload.data : null;

            // map backend HopDongPhong -> frontend Contract shape
            const mapped = rawArr
                ? rawArr.map((h: any) => {
                    // helper to pick first existing prop from candidates
                    const pick = (obj: any, keys: string[]) => {
                        if (!obj) return null;
                        for (const k of keys) {
                            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
                        }
                        return null;
                    };

                    const maHopDongPhong = h.maHopDongPhong ?? h.id ?? pick(h, ['maHopDongPhong']);
                    // prefer top-level maQuanLy or nested taiKhoan
                    const maQuanLy = h.maQuanLy ?? pick(h.taiKhoan, ['maTaiKhoan', 'id', 'username', 'maQuanLy']) ?? pick(h, ['maQuanLy']);
                    // prefer top-level maKhachDaiDien or nested khachThue
                    const maKhachDaiDien = h.maKhachDaiDien ?? pick(h.khachThue, ['maKhachThue', 'id', 'ten', 'name']) ?? pick(h, ['maKhachDaiDien', 'maKhachThue']);
                    // prefer top-level maPhong or nested phong object
                    const maPhong = h.maPhong ?? pick(h.phong, ['maPhong', 'id', 'tenPhong', 'name']) ?? pick(h, ['maPhong', 'id', 'tenPhong']);
                    const tienPhong = h.tienPhong != null ? String(h.tienPhong) : null;
                    const tienCoc = h.tienCoc != null ? String(h.tienCoc) : null;
                    const dvRac = h.dvRac != null ? Boolean(h.dvRac) : null;
                    const dvWifi = h.dvWifi != null ? Boolean(h.dvWifi) : null;
                    const dvCap = h.dvCap != null ? Boolean(h.dvCap) : null;
                    const dvKhac = h.dvKhac != null ? Boolean(h.dvKhac) : null;
                    const ngayBatDau = h.ngayBatDau ? String(h.ngayBatDau) : null;
                    const ngayKetThuc = h.ngayKetThuc ? String(h.ngayKetThuc) : null;
                    const ngayTao = h.ngayTao ? String(h.ngayTao) : null;
                    const statusVal = h.trangThai ?? h.status ?? null;

                    // ensure we set both 'status' (used by some mappers) and 'trangThai' (backend name)
                    const mappedContract: any = {
                        maHopDongPhong,
                        maQuanLy,
                        maKhachDaiDien,
                        maPhong,
                        tienPhong,
                        tienCoc,
                        dvRac,
                        dvWifi,
                        dvCap,
                        dvKhac,
                        ngayBatDau,
                        ngayKetThuc,
                        ngayTao,
                    };

                    if (statusVal !== undefined && statusVal !== null) {
                        mappedContract.status = String(statusVal);
                        mappedContract.trangThai = String(statusVal);
                    } else {
                        mappedContract.status = null;
                        mappedContract.trangThai = null;
                    }

                    return mappedContract as Contract;
                })
                : null;

            return {
                status,
                message,
                data: mapped,
            };
        }

        // fallback
        return {
            status: 'error',
            message: 'Unexpected response shape from API',
            data: null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}


export async function getAllActiveContracts(): Promise<{ status: string; message: string; data: Contract[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/active`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // Normalize different possible response shapes:
        // 1. API returns { status, message, data: [...] }
        // 2. API returns an array directly: [...]
        // 3. API returns { status: 'success', data: [...] } but data may be wrapped differently
        if (Array.isArray(payload)) {
            return {
                status: 'success',
                message: 'Fetched all contracts',
                data: payload as Contract[]
            };
        }

        if (payload && typeof payload === 'object') {
            // some backends return { message: 'success', data: [...] } instead of status
            const isSuccess = payload.status === 'success' || payload.message === 'success' || payload.message === 'ok' || payload.message === 'OK';
            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (status === 'success' ? 'Fetched all contracts' : 'Failed to fetch');
            // prefer payload.data if it's an array
            const rawArr = Array.isArray(payload.data) ? payload.data : null;

            // map backend HopDongPhong -> frontend Contract shape
            const mapped = rawArr
                ? rawArr.map((h: any) => {
                    // helper to pick first existing prop from candidates
                    const pick = (obj: any, keys: string[]) => {
                        if (!obj) return null;
                        for (const k of keys) {
                            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
                        }
                        return null;
                    };

                    const maHopDongPhong = h.maHopDongPhong ?? h.id ?? pick(h, ['maHopDongPhong']);
                    // prefer top-level maQuanLy or nested taiKhoan
                    const maQuanLy = h.maQuanLy ?? pick(h.taiKhoan, ['maTaiKhoan', 'id', 'username', 'maQuanLy']) ?? pick(h, ['maQuanLy']);
                    // prefer top-level maKhachDaiDien or nested khachThue
                    const maKhachDaiDien = h.maKhachDaiDien ?? pick(h.khachThue, ['maKhachThue', 'id', 'ten', 'name']) ?? pick(h, ['maKhachDaiDien', 'maKhachThue']);
                    // prefer top-level maPhong or nested phong object
                    const maPhong = h.maPhong ?? pick(h.phong, ['maPhong', 'id', 'tenPhong', 'name']) ?? pick(h, ['maPhong', 'id', 'tenPhong']);
                    const tienPhong = h.tienPhong != null ? String(h.tienPhong) : null;
                    const tienCoc = h.tienCoc != null ? String(h.tienCoc) : null;
                    const dvRac = h.dvRac != null ? Boolean(h.dvRac) : null;
                    const dvWifi = h.dvWifi != null ? Boolean(h.dvWifi) : null;
                    const dvCap = h.dvCap != null ? Boolean(h.dvCap) : null;
                    const dvKhac = h.dvKhac != null ? Boolean(h.dvKhac) : null;
                    const ngayBatDau = h.ngayBatDau ? String(h.ngayBatDau) : null;
                    const ngayKetThuc = h.ngayKetThuc ? String(h.ngayKetThuc) : null;
                    const ngayTao = h.ngayTao ? String(h.ngayTao) : null;
                    const statusVal = h.trangThai ?? h.status ?? null;

                    // ensure we set both 'status' (used by some mappers) and 'trangThai' (backend name)
                    const mappedContract: any = {
                        maHopDongPhong,
                        maQuanLy,
                        maKhachDaiDien,
                        maPhong,
                        tienPhong,
                        tienCoc,
                        dvRac,
                        dvWifi,
                        dvCap,
                        dvKhac,
                        ngayBatDau,
                        ngayKetThuc,
                        ngayTao,
                    };

                    if (statusVal !== undefined && statusVal !== null) {
                        mappedContract.status = String(statusVal);
                        mappedContract.trangThai = String(statusVal);
                    } else {
                        mappedContract.status = null;
                        mappedContract.trangThai = null;
                    }

                    return mappedContract as Contract;
                })
                : null;

            return {
                status,
                message,
                data: mapped,
            };
        }

        // fallback
        return {
            status: 'error',
            message: 'Unexpected response shape from API',
            data: null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}

export async function getAllActiveContractsPaged(page: number = 0, size: number = 6): Promise<{ status: string; message: string; data: { content: Contract[]; page: number; size: number; totalPages: number; totalElements: number; hasNext: boolean; hasPrevious: boolean; } | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/active/paged?page=${page}&size=${size}`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        if (payload && typeof payload === 'object') {
            const isSuccess = payload.status === 'success' || payload.message === 'success';
            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (status === 'success' ? 'Fetched paged contracts' : 'Failed to fetch');
            
            // Handle PagedResponse structure
            const pagedData = payload.data;
            if (pagedData && Array.isArray(pagedData.content)) {
                const mapped = pagedData.content.map((h: any) => {
                    // helper to pick first existing prop from candidates
                    const pick = (obj: any, keys: string[]) => {
                        if (!obj) return null;
                        for (const k of keys) {
                            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
                        }
                        return null;
                    };

                    const maHopDongPhong = h.maHopDongPhong ?? h.id ?? pick(h, ['maHopDongPhong']);
                    const maQuanLy = h.maQuanLy ?? pick(h.taiKhoan, ['maTaiKhoan', 'id', 'username', 'maQuanLy']) ?? pick(h, ['maQuanLy']);
                    const maKhachDaiDien = h.maKhachDaiDien ?? pick(h.khachThue, ['maKhachThue', 'id', 'ten', 'name']) ?? pick(h, ['maKhachDaiDien', 'maKhachThue']);
                    const maPhong = h.maPhong ?? pick(h.phong, ['maPhong', 'id', 'tenPhong', 'name']) ?? pick(h, ['maPhong', 'id', 'tenPhong']);
                    const tienPhong = h.tienPhong != null ? String(h.tienPhong) : null;
                    const tienCoc = h.tienCoc != null ? String(h.tienCoc) : null;
                    const dvRac = h.dvRac != null ? Boolean(h.dvRac) : null;
                    const dvWifi = h.dvWifi != null ? Boolean(h.dvWifi) : null;
                    const dvCap = h.dvCap != null ? Boolean(h.dvCap) : null;
                    const dvKhac = h.dvKhac != null ? Boolean(h.dvKhac) : null;
                    const ngayBatDau = h.ngayBatDau ? String(h.ngayBatDau) : null;
                    const ngayKetThuc = h.ngayKetThuc ? String(h.ngayKetThuc) : null;
                    const ngayTao = h.ngayTao ? String(h.ngayTao) : null;
                    const statusVal = h.trangThai ?? h.status ?? null;

                    const mappedContract: any = {
                        maHopDongPhong,
                        maQuanLy,
                        maKhachDaiDien,
                        maPhong,
                        tienPhong,
                        tienCoc,
                        dvRac,
                        dvWifi,
                        dvCap,
                        dvKhac,
                        ngayBatDau,
                        ngayKetThuc,
                        ngayTao,
                    };

                    if (statusVal !== undefined && statusVal !== null) {
                        mappedContract.status = String(statusVal);
                        mappedContract.trangThai = String(statusVal);
                    } else {
                        mappedContract.status = null;
                        mappedContract.trangThai = null;
                    }

                    return mappedContract as Contract;
                });
                
                return {
                    status,
                    message,
                    data: {
                        content: mapped,
                        page: pagedData.page || 0,
                        size: pagedData.size || size,
                        totalPages: pagedData.totalPages || 0,
                        totalElements: pagedData.totalElements || 0,
                        hasNext: pagedData.hasNext || false,
                        hasPrevious: pagedData.hasPrevious || false
                    }
                };
            }
        }

        return {
            status: 'error',
            message: 'Unexpected response shape from API',
            data: null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}

export async function getContractsByCustomer(customerId: number): Promise<{ status: string; message: string; data: Contract[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/byCustomer/${customerId}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return {
            status: data.status === "success" ? "success" : "error",
            message: data.message || "Fetched customer contracts",
            data: data.data || null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}


export async function getContractById(id: number): Promise<{ status: string; message: string; data: Contract | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${id}`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // payload may be { message, data: {...} } or the contract object directly
        let raw: any = null;
        if (payload && typeof payload === 'object') {
            raw = payload.data ?? payload;
        }

        if (!raw) {
            return {
                status: 'error',
                message: payload?.message || 'Contract not found',
                data: null
            };
        }

        // helper to pick first existing prop from candidates
        const pick = (obj: any, keys: string[]) => {
            if (!obj) return null;
            for (const k of keys) {
                if (obj[k] !== undefined && obj[k] !== null) return obj[k];
            }
            return null;
        };

        const maHopDongPhong = raw.maHopDongPhong ?? raw.id ?? pick(raw, ['maHopDongPhong']);
        const maQuanLy = raw.maQuanLy ?? pick(raw.taiKhoan, ['maTaiKhoan', 'id', 'username', 'maQuanLy']) ?? pick(raw, ['maQuanLy']);
        const maKhachDaiDien = raw.maKhachDaiDien ?? pick(raw.khachThue, ['maKhachThue', 'id', 'ten', 'name']) ?? pick(raw, ['maKhachDaiDien', 'maKhachThue']);
        const maPhong = raw.maPhong ?? pick(raw.phong, ['maPhong', 'id', 'tenPhong', 'name']) ?? pick(raw, ['maPhong', 'id', 'tenPhong']);
        const tienPhong = raw.tienPhong != null ? String(raw.tienPhong) : null;
        const tienCoc = raw.tienCoc != null ? String(raw.tienCoc) : null;
        const dvRac = raw.dvRac != null ? Boolean(raw.dvRac) : null;
        const dvWifi = raw.dvWifi != null ? Boolean(raw.dvWifi) : null;
        const dvCap = raw.dvCap != null ? Boolean(raw.dvCap) : null;
        const dvKhac = raw.dvKhac != null ? Boolean(raw.dvKhac) : null;
        const ngayBatDau = raw.ngayBatDau ? String(raw.ngayBatDau) : null;
        const ngayKetThuc = raw.ngayKetThuc ? String(raw.ngayKetThuc) : null;
        const ngayTao = raw.ngayTao ? String(raw.ngayTao) : null;
        const statusVal = raw.trangThai ?? raw.status ?? null;

        const mappedContract: any = {
            maHopDongPhong,
            maQuanLy,
            maKhachDaiDien,
            maPhong,
            tienPhong,
            tienCoc,
            dvRac,
            dvWifi,
            dvCap,
            dvKhac,
            ngayBatDau,
            ngayKetThuc,
            ngayTao,
        };

        if (statusVal !== undefined && statusVal !== null) {
            mappedContract.status = String(statusVal);
            mappedContract.trangThai = String(statusVal);
        } else {
            mappedContract.status = null;
            mappedContract.trangThai = null;
        }

        return {
            status: payload?.status === 'success' || payload?.message === 'success' ? 'success' : 'success',
            message: payload?.message || 'Fetched contract by ID',
            data: mappedContract as Contract
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}


export async function getActiveContractById(id: number): Promise<{ status: string; message: string; data: Contract | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/active/${id}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return {
            status: data.status === "success" ? "success" : "error",
            message: data.message || "Fetched active contract by ID",
            data: data.data || null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}


export async function createContract(contractData: Partial<Contract>): Promise<{ status: string; message: string; data: Contract | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(contractData)
        });
        const data = await response.json();
        
        // Handle both ApiResponseV2 format and legacy format
        const isSuccess = data.message === "success" || data.status === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Contract created successfully" : "Failed to create contract"),
            data: data.data || null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}


export async function updateContract(id: number, contractData: Partial<Contract>): Promise<{ status: string; message: string; data: Contract | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(contractData)
        });
        
        const data = await response.json();
        console.log("Raw response data:", data);
        console.log("Response ok:", response.ok);
        console.log("Response status:", response.status);
        
        // Check if HTTP response is successful first
        if (!response.ok) {
            return {
                status: "error",
                message: data.message || `HTTP ${response.status}: ${response.statusText}`,
                data: null
            };
        }
        
        // For successful HTTP responses, check various success indicators
        // ApiResponseV2 has structure: { message: "success", data: "..." }
        const isSuccess = response.ok && (
            data.message === "success" || 
            data.message === "ok" || 
            data.message === "OK" ||
            data.message === "Contract updated successfully"
        );
        
        console.log("Is success:", isSuccess);
        console.log("Data message (checking for success):", data.message);
        
        return {
            status: isSuccess ? "success" : "error",
            message: typeof data.data === 'string' ? data.data : data.message || "Contract updated successfully",
            data: typeof data.data === 'object' ? data.data : null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}


export async function deleteContract(id: number): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        
        // Check if the HTTP response is successful
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        
        // More robust success checking - similar to other functions in this file
        const isSuccess = data.status === "success" || 
                         data.message === "success" || 
                         data.message === "ok" || 
                         data.message === "OK" ||
                         response.ok;
                         
        const status = isSuccess ? "success" : "error";
        const message = data.message || (status === "success" ? "Contract deleted successfully" : "Delete failed");
        
        return {
            status,
            message
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Enhanced contract liquidation with debt checking
export async function liquidateContract(id: number): Promise<{ status: string; message: string; data?: any }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${id}/liquidate`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        const isSuccess = data.message === "success" || data.status === "success";
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Contract liquidated successfully" : "Failed to liquidate contract"),
            data: data.data
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Check contract debts before liquidation
export async function checkContractDebts(contractId: number): Promise<{ status: string; message: string; data?: any }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${contractId}/debts`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        const isSuccess = data.message === "success" || data.status === "success";
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Debts checked successfully" : "Failed to check debts"),
            data: data.data
        };
    } catch (error) {
        return {
            status: "error", 
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Calculate deposit refund
export async function calculateDepositRefund(contractId: number): Promise<{ status: string; message: string; data?: any }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${contractId}/deposit-refund`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        const isSuccess = data.message === "success" || data.status === "success";
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Refund calculated successfully" : "Failed to calculate refund"),
            data: data.data
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Update expired contracts
export async function updateExpiredContracts(): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/update-expired`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        const isSuccess = data.message === "success" || data.status === "success";
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Expired contracts updated successfully" : "Failed to update expired contracts")
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Get room status summary
export async function getRoomStatusSummary(): Promise<{ status: string; message: string; data?: any }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/room-status-summary`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        const isSuccess = data.message === "success" || data.status === "success";
        
        return {
            status: isSuccess ? "success" : "error", 
            message: data.message || (isSuccess ? "Room status retrieved successfully" : "Failed to get room status"),
            data: data.data
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Sync room statuses with contracts
export async function syncRoomStatus(): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/sync-room-status`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        const data = await response.json();
        const isSuccess = data.message === "success" || data.status === "success";
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Room status synced successfully" : "Failed to sync room status")
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}


export async function printContract(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contract/print/${id}`, {
            headers: getAuthHeaders()
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hop_dong_${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error printing contract:", error);
    }
}

// Download contract as PDF
export async function downloadContractPDF(id: number): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${id}/pdf`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `Failed to download contract PDF: ${response.status} ${response.statusText}`
            };
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return {
            status: "success",
            message: "PDF downloaded successfully"
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to download PDF"
        };
    }
}

// Download contract as professional DOCX
export async function downloadContractDOCX(id: number): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${id}/professional-docx`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            return {
                status: "error",
                message: `Failed to download contract DOCX: ${response.status} ${response.statusText}`
            };
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract_${id}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return {
            status: "success",
            message: "DOCX downloaded successfully"
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to download DOCX"
        };
    }
}

export async function getContractsWithoutInvoice(thang: number, nam: number): Promise<{ status: string; message: string; data: Contract[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contract/invoice?thang=${thang}&nam=${nam}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return {
            status: data.status === "success" ? "success" : "error",
            message: data.message || "Fetched contracts without invoice",
            data: data.data || null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}

// Enhanced Contract Tenant Management Functions

// Get all active tenants (available for contracts)
export async function getAllActiveTenants(): Promise<{ status: string; message: string; data: any[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tenants?status=active`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const payload = await response.json();
        
        if (payload && typeof payload === 'object') {
            const isSuccess = payload.success === true || payload.status === 'success' || payload.message === 'success';
            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (isSuccess ? 'Fetched active tenants' : 'Failed to fetch active tenants');
            
            // Handle different response formats
            let tenants = null;
            if (Array.isArray(payload.data)) {
                tenants = payload.data;
            } else if (Array.isArray(payload)) {
                tenants = payload;
            } else if (payload.data && Array.isArray(payload.data.content)) {
                tenants = payload.data.content;
            }
            
            return { status, message, data: tenants };
        }
        
        return {
            status: 'error',
            message: 'Unexpected response format',
            data: null
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
            data: null
        };
    }
}

export async function getContractTenants(contractId: number): Promise<{ status: string; message: string; data: any[] | null }> {
    try {
        const url = `${API_BASE_URL}/api/hop-dong-khach-thue/contract/${contractId}/tenants`;
        console.log("Fetching contract tenants from:", url);
        console.log("Auth headers:", getAuthHeaders());
        
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw response data:", data);
        
        // ApiResponseV2 has { message, data } format, not { status, message, data }
        const isSuccess = data.message === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: isSuccess ? "Fetched contract tenants" : (data.message || "Failed to fetch contract tenants"),
            data: data.data || []
        };
    } catch (error) {
        console.error("Error in getContractTenants:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}

// Add a tenant to a contract with validation
export async function addTenantToContract(contractId: number, tenantId: number): Promise<{ status: string; message: string; data?: any }> {
    try {
        console.log(`API: Adding tenant ${tenantId} to contract ${contractId}`);
        const url = `${API_BASE_URL}/api/hop-dong-khach-thue/contract/${contractId}/tenants/${tenantId}`;
        console.log("API: Request URL:", url);
        console.log("API: Request headers:", getAuthHeaders());
        
        // First, verify the contract exists and is active
        console.log("API: Verifying contract exists and is active...");
        const contractCheckResponse = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${contractId}`, {
            headers: getAuthHeaders()
        });
        
        if (!contractCheckResponse.ok) {
            console.error("API: Contract verification failed:", contractCheckResponse.status);
            return {
                status: "error",
                message: `Contract ${contractId} not found or inaccessible`,
                data: null
            };
        }
        
        const contractData = await contractCheckResponse.json();
        console.log("API: Contract verification data:", contractData);
        
        const response = await fetch(url, {
            method: "POST",
            headers: getAuthHeaders()
        });
        
        console.log("API: Response status:", response.status);
        console.log("API: Response ok:", response.ok);
        console.log("API: Response statusText:", response.statusText);
        console.log("API: Response headers:", response.headers);
        
        // Check if response is actually JSON
        const contentType = response.headers.get("content-type");
        console.log("API: Content-Type:", contentType);
        
        if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            console.error("API: Non-JSON response:", textResponse);
            return {
                status: "error",
                message: `Server returned non-JSON response: ${textResponse || response.statusText}`,
                data: null
            };
        }
        
        const data = await response.json();
        console.log("API: Response data:", data);
        console.log("API: Response data type:", typeof data);
        console.log("API: Response data keys:", Object.keys(data));
        console.log("API: data.message:", data.message);
        console.log("API: data.error:", data.error);
        console.log("API: data.data:", data.data);
        console.log("API: data.status:", data.status);
        
        // Handle both success and error responses
        if (response.ok && (data.message === "success" || data.status === "success")) {
            return {
                status: "success",
                message: data.message || "Tenant added to contract successfully",
                data: data.data || null
            };
        } else {
            // Handle error response - extract meaningful error message with fallbacks
            let errorMessage = "Failed to add tenant to contract";
            
            // Try different possible error message locations
            if (data.message && data.message !== "error") {
                errorMessage = data.message;
            } else if (data.error && typeof data.error === "string") {
                errorMessage = data.error;
            } else if (data.data && typeof data.data === "string") {
                errorMessage = data.data;
            } else if (data.message) {
                // If message exists but is just "error", try to get more details
                errorMessage = `Error: ${data.message}` + (data.data ? ` - ${data.data}` : "") + (data.error ? ` - ${data.error}` : "");
            } else {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            // Add common business logic error interpretations
            if (response.status === 409) {
                errorMessage = "Conflict: Tenant already has an active contract or duplicate assignment";
            } else if (response.status === 400) {
                if (errorMessage.toLowerCase().includes("contract not found") || errorMessage.toLowerCase().includes("inactive")) {
                    errorMessage = `Contract ${contractId} is not found or inactive. Please verify the contract exists and is in active status.`;
                } else {
                    errorMessage = "Invalid request - " + errorMessage;
                }
            } else if (response.status === 403) {
                errorMessage = "Access denied - insufficient permissions to add tenants to this contract";
            } else if (response.status === 404) {
                errorMessage = `Contract ${contractId} or tenant ${tenantId} not found in the system`;
            } else if (response.status === 500) {
                errorMessage = "Server error - please check your connection and try again";
            }
            
            console.error("API: Extracted error message:", errorMessage);
            return {
                status: "error",
                message: errorMessage,
                data: data.data || null
            };
        }
    } catch (error) {
        console.error("API: Network error:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Remove a tenant from a contract
export async function removeTenantFromContract(contractId: number, tenantId: number): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-khach-thue/contract/${contractId}/tenants/${tenantId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        const data = await response.json();
        // ApiResponseV2 has { message, data } format, not { status, message, data }
        const isSuccess = data.message === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: isSuccess ? "Tenant removed from contract" : (data.message || "Failed to remove tenant from contract")
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}

// Check if tenant has active contracts (for duplicate validation)
export async function checkTenantActiveContracts(tenantId: number): Promise<{ status: string; message: string; data: { hasActiveContract: boolean; contractDetails?: any } }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/tenants/${tenantId}/active-contracts`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        // ApiResponseV2 has { message, data } format, not { status, message, data }
        const isSuccess = data.message === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: isSuccess ? "Checked tenant active contracts" : (data.message || "Failed to check tenant active contracts"),
            data: data.data || { hasActiveContract: false }
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: { hasActiveContract: false }
        };
    }
}

// Get available tenants (not in any active contract)
export async function getAvailableTenants(): Promise<{ status: string; message: string; data: Tenant[] | null }> {
    try {
        const url = `${API_BASE_URL}/api/hop-dong-khach-thue/available-tenants`;
        console.log("Fetching available tenants from:", url);
        console.log("Auth headers:", getAuthHeaders());
        
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        
        console.log("Available tenants response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Available tenants raw response:", data);
        
        // ApiResponseV2 has { message, data } format, not { status, message, data }
        const isSuccess = data.message === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: isSuccess ? "Fetched available tenants" : (data.message || "Failed to fetch available tenants"),
            data: data.data || []
        };
    } catch (error) {
        console.error("Error in getAvailableTenants:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}

// Initiate early contract termination with deposit warning
export async function initiateEarlyTermination(contractId: number, reason: string, proposedDate: string): Promise<{ status: string; message: string; data: { depositWarning: string; estimatedRefund?: number } }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/${contractId}/terminate`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                reason,
                proposedDate,
                action: "initiate"
            })
        });
        const data = await response.json();
        // ApiResponseV2 has { message, data } format, not { status, message, data }
        const isSuccess = data.message === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: isSuccess ? "Termination initiated" : (data.message || "Failed to initiate termination"),
            data: data.data || { depositWarning: "Please discuss deposit refund with landlord" }
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: { depositWarning: "Error processing termination request" }
        };
    }
}

// Get tenants by room ID
export async function getRoomTenants(roomId: number): Promise<{ status: string; message: string; data: any[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/room/${roomId}/tenants`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        // Handle ApiResponseV2 format
        const isSuccess = data.message === "success" || data.status === "success" || response.ok;
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Fetched room tenants successfully" : "Failed to fetch room tenants"),
            data: data.data || null
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null
        };
    }
}