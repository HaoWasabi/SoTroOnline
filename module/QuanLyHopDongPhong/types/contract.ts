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
    trangThai?: string; // backend enum name
    
    // Enhanced fields for tenant management
    tenants?: ContractTenant[]; // List of tenants associated with this contract
    tenPhong?: string; // Room name for display
    tenQuanLy?: string; // Manager name for display  
    tenTaiKhoan?: string; // Manager name for display
    tenKhachThue?: string; // Main tenant name for display
    maxTenants?: number; // Maximum number of tenants allowed
}

// Tenant representation in contract context
export interface ContractTenant {
    maKhach: number;
    hoTen: string;
    maCanCuoc?: string;
    dienThoai?: string;
    ngaySinh?: string;
    thuongTru?: string;
    trangThai?: string;
    ngayVaoO?: string; // Date tenant joined the contract
    isMainTenant?: boolean; // Whether this is the main contract tenant
}

// Contract creation/update request
export interface ContractRequest extends Omit<Contract, 'maHopDongPhong' | 'tenants'> {
    tenantIds?: number[]; // Array of tenant IDs to include in contract
}