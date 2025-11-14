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
        const response = await fetch(`${API_BASE_URL}/api/hop-dong-phong/all`, {
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
        return {
            status: data.status === "success" ? "success" : "error",
            message: data.message || "Contract created successfully",
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
        return {
            status: data.status === "success" ? "success" : "error",
            message: data.message || "Contract updated successfully",
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