import type { Invoice, InvoiceDetails } from "../types/invoice";
import { Receipt } from "../types/receipt";
import { getAuthHeaders } from "../../../utils/auth-api";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Generic response type
interface ApiResponse<T = any> {
    status: string;
    message: string;
    data: T;
}
export async function getAllInvoices(): Promise<{ status: string; message: string; data: Invoice[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice/all`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // Trường hợp backend trả về mảng trực tiếp
        if (Array.isArray(payload)) {
            return {
                status: 'success',
                message: 'Fetched all invoices',
                data: payload as Invoice[],
            };
        }

        // Trường hợp backend trả về dạng object { status, message, data }
        if (payload && typeof payload === 'object') {
            const isSuccess =
                payload.status === 'success' ||
                payload.message === 'success' ||
                payload.message === 'ok' ||
                payload.message === 'OK';

            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (isSuccess ? 'Fetched all invoices' : 'Failed to fetch invoices');

            // Nếu payload.data là mảng
            const rawArr = Array.isArray(payload.data) ? payload.data : null;

            const mapped = rawArr
                ? rawArr.map((h: any) => {
                    // map dữ liệu backend → interface Invoice
                    const invoice: Invoice = {
                        maHoaDon: Number(h.maHoaDon ?? h.id ?? 0),
                        maHopDongPhong: Number(h.maHopDongPhong ?? h.hopDongPhong?.id ?? 0),
                        tienPhong: Number(h.tienPhong ?? 0),
                        tienDichVu: Number(h.tienDichVu ?? 0),
                        tongTien: Number(h.tongTien ?? 0),
                        tienConNo: Number(h.tienConNo ?? 0),
                        ngayTao: String(h.ngayTao ?? ''),
                        capNhatLanCuoi: String(h.capNhatLanCuoi ?? ''),
                        thang: Number(h.thang ?? 0),
                        nam: Number(h.nam ?? 0),
                        noiDung: String(h.noiDung ?? ''),
                        trangThai: String(h.trangThai ?? h.status ?? ''),

                        // map chi tiết hóa đơn nếu có
                        chiTietHoaDons: Array.isArray(h.chiTietHoaDons)
                            ? h.chiTietHoaDons.map((d: any): InvoiceDetails => ({
                                id: Number(d.id ?? 0),
                                maHoaDon: Number(d.maHoaDon ?? h.maHoaDon ?? 0),
                                tenDichVu: String(d.tenDichVu ?? ''),
                                donGia: Number(d.donGia ?? 0),
                                thanhTien: Number(d.thanhTien ?? 0),
                                soLuong: Number(d.soLuong ?? 0),
                                heSo: Number(d.heSo ?? 1),
                                tienThucTue: Number(d.tienThucTue ?? 0),
                            }))
                            : [],
                    };

                    return invoice;
                })
                : null;

            return {
                status,
                message,
                data: mapped,
            };
        }

        // fallback nếu payload không hợp lệ
        return {
            status: 'error',
            message: 'Unexpected response shape from API',
            data: null,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
            data: null,
        };
    }
}

export async function getAllActiveInvoices(): Promise<{ status: string; message: string; data: Invoice[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice/active`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // Trường hợp backend trả về mảng trực tiếp
        if (Array.isArray(payload)) {
            return {
                status: 'success',
                message: 'Fetched all invoices',
                data: payload as Invoice[],
            };
        }

        // Trường hợp backend trả về dạng object { status, message, data }
        if (payload && typeof payload === 'object') {
            const isSuccess =
                payload.status === 'success' ||
                payload.message === 'success' ||
                payload.message === 'ok' ||
                payload.message === 'OK';

            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (isSuccess ? 'Fetched all invoices' : 'Failed to fetch invoices');

            // Nếu payload.data là mảng
            const rawArr = Array.isArray(payload.data) ? payload.data : null;

            const mapped = rawArr
                ? rawArr.map((h: any) => {
                    // map dữ liệu backend → interface Invoice
                    const invoice: Invoice = {
                        maHoaDon: Number(h.maHoaDon ?? h.id ?? 0),
                        maHopDongPhong: Number(h.maHopDongPhong ?? h.hopDongPhong?.id ?? 0),
                        tienPhong: Number(h.tienPhong ?? 0),
                        tienDichVu: Number(h.tienDichVu ?? 0),
                        tongTien: Number(h.tongTien ?? 0),
                        tienConNo: Number(h.tienConNo ?? 0),
                        ngayTao: String(h.ngayTao ?? ''),
                        capNhatLanCuoi: String(h.capNhatLanCuoi ?? ''),
                        thang: Number(h.thang ?? 0),
                        nam: Number(h.nam ?? 0),
                        noiDung: String(h.noiDung ?? ''),
                        trangThai: String(h.trangThai ?? h.status ?? ''),

                        // map chi tiết hóa đơn nếu có
                        chiTietHoaDons: Array.isArray(h.chiTietHoaDons)
                            ? h.chiTietHoaDons.map((d: any): InvoiceDetails => ({
                                id: Number(d.id ?? 0),
                                maHoaDon: Number(d.maHoaDon ?? h.maHoaDon ?? 0),
                                tenDichVu: String(d.tenDichVu ?? ''),
                                donGia: Number(d.donGia ?? 0),
                                thanhTien: Number(d.thanhTien ?? 0),
                                soLuong: Number(d.soLuong ?? 0),
                                heSo: Number(d.heSo ?? 1),
                                tienThucTue: Number(d.tienThucTue ?? 0),
                            }))
                            : [],
                    };

                    return invoice;
                })
                : null;

            return {
                status,
                message,
                data: mapped,
            };
        }

        // fallback nếu payload không hợp lệ
        return {
            status: 'error',
            message: 'Unexpected response shape from API',
            data: null,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
            data: null,
        };
    }
}

export async function getActiveInvoice(maHoaDon: number): Promise<{ status: string; message: string; data: Invoice | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice/active/${maHoaDon}`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // Trường hợp backend trả về object trực tiếp
        if (payload && typeof payload === "object" && !Array.isArray(payload)) {
            const isSuccess =
                payload.status === "success" ||
                payload.message === "success" ||
                payload.message === "ok" ||
                payload.message === "OK";

            const status = isSuccess ? "success" : "error";
            const message = payload.message || (isSuccess ? "Fetched active invoice" : "Failed to fetch active invoice");

            // dữ liệu chính (backend có thể trả về { data: {...} } hoặc object trực tiếp)
            const h = payload.data ?? payload;

            if (!h || typeof h !== "object") {
                return { status: "error", message: "Invalid invoice data", data: null };
            }

            // map backend → interface Invoice
            const invoice: Invoice = {
                maHoaDon: Number(h.maHoaDon ?? h.id ?? 0),
                maHopDongPhong: Number(h.maHopDongPhong ?? h.hopDongPhong?.id ?? 0),
                tienPhong: Number(h.tienPhong ?? 0),
                tienDichVu: Number(h.tienDichVu ?? 0),
                tongTien: Number(h.tongTien ?? 0),
                tienConNo: Number(h.tienConNo ?? 0),
                ngayTao: String(h.ngayTao ?? ""),
                capNhatLanCuoi: String(h.capNhatLanCuoi ?? ""),
                thang: Number(h.thang ?? 0),
                nam: Number(h.nam ?? 0),
                noiDung: String(h.noiDung ?? ""),
                trangThai: String(h.trangThai ?? h.status ?? ""),

                chiTietHoaDons: Array.isArray(h.chiTietHoaDons)
                    ? h.chiTietHoaDons.map((d: any): InvoiceDetails => ({
                        id: Number(d.id ?? 0),
                        maHoaDon: Number(d.maHoaDon ?? h.maHoaDon ?? 0),
                        tenDichVu: String(d.tenDichVu ?? ""),
                        donGia: Number(d.donGia ?? 0),
                        thanhTien: Number(d.thanhTien ?? 0),
                        soLuong: Number(d.soLuong ?? 0),
                        heSo: Number(d.heSo ?? 1),
                        tienThucTue: Number(d.tienThucTue ?? 0),
                    }))
                    : [],
            };

            return { status, message, data: invoice };
        }

        return { status: "error", message: "Unexpected response shape from API", data: null };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred",
            data: null,
        };
    }
}

export async function createInvoice(contractData: Partial<Invoice>): Promise<{ status: string; message: string; data: Invoice | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(contractData)
        });
        const data = await response.json();
        
        // Check for multiple success indicators like other functions in this file
        const isSuccess = 
            response.ok && (
                data.status === "success" || 
                data.message === "success" || 
                data.message === "ok" || 
                data.message === "OK" ||
                response.status === 200
            );
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Invoice created successfully" : "Failed to create invoice"),
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

export async function deleteInvoice(id: number): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        // Check for multiple success indicators like other functions in this file
        const isSuccess = 
            response.ok && (
                data.status === "success" || 
                data.message === "success" || 
                data.message === "ok" || 
                data.message === "OK" ||
                response.status === 200
            );
        
        return {
            status: isSuccess ? "success" : "error",
            message: data.message || (isSuccess ? "Invoice deleted successfully" : "Failed to delete invoice")
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Network error occurred"
        };
    }
}


export async function printInvoice(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice/print/${id}`, {
            headers: getAuthHeaders()
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hoa_don_${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error printing invoice:", error);
    }
}


export async function getAllActiveReceipts(): Promise<{ status: string; message: string; data: Receipt[] | null }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/receipt/active`, {
            headers: getAuthHeaders()
        });
        const payload = await response.json();

        // Trường hợp backend trả về mảng trực tiếp
        if (Array.isArray(payload)) {
            return {
                status: 'success',
                message: 'Fetched all receipts',
                data: payload as Receipt[],
            };
        }

        // Trường hợp backend trả về dạng object { status, message, data }
        if (payload && typeof payload === 'object') {
            const isSuccess =
                payload.status === 'success' ||
                payload.message === 'success' ||
                payload.message === 'ok' ||
                payload.message === 'OK';

            const status = isSuccess ? 'success' : 'error';
            const message = payload.message || (isSuccess ? 'Fetched all receipts' : 'Failed to fetch receipts');

            // Nếu payload.data là mảng
            const rawArr = Array.isArray(payload.data) ? payload.data : null;

            const mapped = rawArr
                ? rawArr.map((h: any) => {
                    // map dữ liệu backend → interface Receipt
                    const receipt: Receipt = {
                        maPhieuThu: Number(h.maPhieuThu ?? h.id ?? 0),
                        maHoaDon: Number(h.maHoaDon ?? h.phieuThu.id ?? 0),
                        maKhachThue: Number(h.maKhachThue ?? h.khachThue?.id ?? 0),
                        soTienThu: Number(h.soTienThu ?? 0),
                        ghiChu: String(h.ghiChu ?? ''),
                        ngayThu: String(h.ngayThu ?? ''),
                        capNhatLanCuoi: String(h.capNhatLanCuoi ?? ''),
                        trangThai: String(h.trangThai ?? h.status ?? ''),
                    };

                    return receipt;
                })
                : null;

            return {
                status,
                message,
                data: mapped,
            };
        }

        // fallback nếu payload không hợp lệ
        return {
            status: 'error',
            message: 'Unexpected response shape from API',
            data: null,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
            data: null,
        };
    }
}

export async function createReceipt(payload: { maHoaDon: number; soTienThu: number; ghiChu?: string }): Promise<{ status: string; message: string; data?: any }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/receipt`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        })
        const data = await response.json()
        return {
            status: data.status === 'success' ? 'success' : 'error',
            message: data.message || (data.status === 'success' ? 'Receipt created' : 'Failed to create receipt'),
            data: data.data || null,
        }
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
        }
    }
}

export async function deleteReceipt(id: number): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/receipt/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        const data = await response.json()
        return {
            status: data.status === 'success' ? 'success' : 'error',
            message: data.message || 'Delete failed',
        }
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error occurred',
        }
    }
}