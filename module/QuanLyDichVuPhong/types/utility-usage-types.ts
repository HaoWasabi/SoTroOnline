export interface UtilityUsage {
    id: number;
    maPhong: number;
    tenPhong: string;
    thangNam: string; // Format: "YYYY-MM-DD"
    chiSoDienCu: number;
    chiSoDienMoi: number;
    chiSoNuocCu: number;
    chiSoNuocMoi: number;
    trangThai: 'hoatDong' | 'daXoa';
}

export interface UtilityUsageRequest {
    maPhong: number;
    thangNam: string; // Format: "YYYY-MM-DD"
    chiSoDienCu: number;
    chiSoDienMoi: number;
    chiSoNuocCu: number;
    chiSoNuocMoi: number;
    trangThai: 'hoatDong' | 'daXoa';
}

export interface UtilityUsageResponse {
    id: number;
    maPhong: number;
    tenPhong: string;
    thangNam: string;
    chiSoDienCu: number;
    chiSoDienMoi: number;
    chiSoNuocCu: number;
    chiSoNuocMoi: number;
    trangThai: 'hoatDong' | 'daXoa';
}

export interface ApiResponseV2<T = any> {
    message: string;
    data: T;
}