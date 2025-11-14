export interface Contract {
    maHopDongPhong: number | string;
    maQuanLy?: number | string; // could be nested taiKhoan.id or username
    maKhachThue?: number | string; // nested khachThue id or name
    maKhachDaiDien?: number | string;
    maPhong?: number | string; // nested phong id or name
    tienPhong?: number | string; // BigDecimal from backend -> string or number
    tienCoc?: number | string;
    dvRac?: boolean | null;
    dvWifi?: boolean | null;
    dvCap?: boolean | null;
    dvKhac?: boolean | null;
    ngayBatDau?: string; // LocalDate -> ISO string
    ngayKetThuc?: string;
    ngayTao?: string;
    trangThai?: string // backend enum name
}