import { Receipt } from "../types/Receipt";
import { getAuthHeaders } from "@/utils/auth-api";

const BASE_URL = "http://localhost:8080/api/receipt";

interface ApiResponse<T> {
    status: "success" | "error";
    message: string;
    data?: T;
}

export interface ReceiptRequest {
    maHoaDon: number;
    maKhachHang: number;
    soTienThu: number;
    ghiChu?: string;
    trangThai: string;
}

export interface AutoReceiptRequest {
    maHopDongPhong: number;
    soTienThu: number;
}

export interface RevenueReport {
    totalRevenue: number;
    period: string;
    receiptCount: number;
    averageAmount: number;
}

export interface ReconciliationReport {
    totalInvoiceAmount: number;
    totalReceiptAmount: number;
    difference: number;
    reconciliationStatus: "balanced" | "deficit" | "surplus";
}

// Get all receipts
export async function getAllReceipts(): Promise<ApiResponse<Receipt[]>> {
    try {
        const response = await fetch(`${BASE_URL}/all`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Receipts retrieved successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error fetching receipts:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to fetch receipts"
        };
    }
}

// Get all active receipts
export async function getAllActiveReceipts(): Promise<ApiResponse<Receipt[]>> {
    try {
        const response = await fetch(`${BASE_URL}/active`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            // Handle specific HTTP status codes
            if (response.status === 401) {
                return {
                    status: "error",
                    message: "Unauthorized access. Please login again."
                };
            } else if (response.status === 404) {
                return {
                    status: "error",
                    message: "Receipt service endpoint not found."
                };
            } else if (response.status === 500) {
                return {
                    status: "error",
                    message: "Internal server error. Please try again later."
                };
            } else {
                return {
                    status: "error",
                    message: `HTTP error! status: ${response.status}`
                };
            }
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Active receipts retrieved successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error fetching active receipts:", error);
        
        // Handle network errors
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            return {
                status: "error",
                message: "Network error. Please check your internet connection and try again."
            };
        }
        
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to fetch active receipts"
        };
    }
}

// Get receipt by ID
export async function getReceiptById(id: number): Promise<ApiResponse<Receipt>> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Receipt retrieved successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error fetching receipt:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to fetch receipt"
        };
    }
}

// Create receipt
export async function createReceipt(receiptData: ReceiptRequest): Promise<ApiResponse<Receipt>> {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(receiptData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Receipt created successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error creating receipt:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to create receipt"
        };
    }
}

// Update receipt
export async function updateReceipt(id: number, receiptData: Partial<ReceiptRequest>): Promise<ApiResponse<Receipt>> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(receiptData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Receipt updated successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error updating receipt:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to update receipt"
        };
    }
}



// Get receipts by invoice ID
export async function getReceiptsByInvoice(invoiceId: number): Promise<ApiResponse<Receipt[]>> {
    try {
        const response = await fetch(`${BASE_URL}/invoice/${invoiceId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Receipts retrieved successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error fetching receipts by invoice:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to fetch receipts by invoice"
        };
    }
}

// Get receipts by tenant ID
export async function getReceiptsByTenant(tenantId: number): Promise<ApiResponse<Receipt[]>> {
    try {
        const response = await fetch(`${BASE_URL}/guest/${tenantId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Receipts retrieved successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error fetching receipts by tenant:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to fetch receipts by tenant"
        };
    }
}

// Auto receipt collection for contract
export async function createAutoReceipt(autoReceiptData: AutoReceiptRequest): Promise<ApiResponse<Receipt[]>> {
    try {
        const response = await fetch(`${BASE_URL}/debt-collection`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(autoReceiptData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();
        // Backend returns ApiResponseV2 with { message: string, data: any }
        return {
            status: "success",
            message: backendResponse.message || "Auto receipt created successfully",
            data: backendResponse.data
        };
    } catch (error) {
        console.error("Error creating auto receipt:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to create auto receipt"
        };
    }
}

// Generate revenue report
export async function generateRevenueReport(
    startDate: string, 
    endDate: string
): Promise<ApiResponse<RevenueReport>> {
    try {
        // Mock implementation - replace with actual API call when available
        const mockData: RevenueReport = {
            totalRevenue: 0,
            period: `${startDate} to ${endDate}`,
            receiptCount: 0,
            averageAmount: 0
        };

        return {
            status: "success",
            message: "Revenue report generated successfully",
            data: mockData
        };
    } catch (error) {
        console.error("Error generating revenue report:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to generate revenue report"
        };
    }
}

// Generate reconciliation report
export async function generateReconciliationReport(
    startDate: string, 
    endDate: string
): Promise<ApiResponse<ReconciliationReport>> {
    try {
        // Mock implementation - replace with actual API call when available
        const mockData: ReconciliationReport = {
            totalInvoiceAmount: 0,
            totalReceiptAmount: 0,
            difference: 0,
            reconciliationStatus: "balanced"
        };

        return {
            status: "success",
            message: "Reconciliation report generated successfully",
            data: mockData
        };
    } catch (error) {
        console.error("Error generating reconciliation report:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to generate reconciliation report"
        };
    }
}

// Print receipt (download)
export async function printReceipt(id: number): Promise<ApiResponse<void>> {
    try {
        const response = await fetch(`${BASE_URL}/print/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `receipt_${id}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return {
            status: "success",
            message: "Receipt downloaded successfully"
        };
    } catch (error) {
        console.error("Error printing receipt:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to print receipt"
        };
    }
}