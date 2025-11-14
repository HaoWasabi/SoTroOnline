export interface Invoice {
    maHoaDon: number,
    maHopDongPhong: number,
    chiTietHoaDons?: InvoiceDetails[],
    tienPhong: number,
    tienDichVu: number,
    tongTien: number,
    tienConNo: number,
    ngayTao: string,
    capNhatLanCuoi: string,
    thang: number,
    nam: number,
    noiDung: string,
    trangThai: string,
}

export interface InvoiceDetails {
    id: number,
    maHoaDon: number,
    tenDichVu: string,
    donGia: number,
    thanhTien: number,
    soLuong: number,
    heSo: number,
    tienThucTue: number,
}