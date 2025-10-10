-- Tạo database
-- Bảng Tài khoản (người quản lý)
CREATE TABLE TaiKhoan (
    maTaiKhoan    INT AUTO_INCREMENT PRIMARY KEY,
    maCanCuoc     VARCHAR(50),
    email         VARCHAR(255) not null,
    hoTen         VARCHAR(100),
    dienThoai     VARCHAR(20),
    thuongTru     VARCHAR(255),
    ngaySinh      DATE,
    matKhau       VARCHAR(255),
    ngayTao       DATETIME DEFAULT CURRENT_TIMESTAMP,
    trangThai     ENUM('hoatDong','daXoa') DEFAULT 'hoatDong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Phòng
CREATE TABLE Phong (
    maPhong       INT AUTO_INCREMENT PRIMARY KEY,
    maQuanLy      INT NOT NULL,
    tenPhong      VARCHAR(100) NOT NULL,
    loaiPhong     VARCHAR(50),
    diaChi        VARCHAR(255),
    chieuDai      FLOAT,
    chieuRong     FLOAT,
    dienTich      FLOAT,
    vatDung       TEXT,
    giaThueCoBan  FLOAT,
    trangThai     ENUM('hoatDong','baoTri','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_Phong_QuanLy FOREIGN KEY (maQuanLy) REFERENCES TaiKhoan(maTaiKhoan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Dịch vụ
CREATE TABLE DichVu (
    maDichVu      INT AUTO_INCREMENT PRIMARY KEY,
    maQuanLy      INT NOT NULL,
    tenDichVu     VARCHAR(100) NOT NULL,
    donGiaCoBan   FLOAT NOT NULL,
    donViCoBan    VARCHAR(50),
    moTa          VARCHAR(255),
    trangThai     ENUM('hoatDong','baoTri','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_DichVu_QuanLy FOREIGN KEY (maQuanLy) REFERENCES TaiKhoan(maTaiKhoan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Khách thuê
CREATE TABLE KhachThue (
    maKhach        INT AUTO_INCREMENT PRIMARY KEY,
    maKhachDaiDien INT NOT NULL,
    maCanCuoc      VARCHAR(50) NOT NULL,
    hoTen          VARCHAR(100) NOT NULL,
    dienThoai      VARCHAR(20),
    thuongTru      VARCHAR(255),
    ngaySinh       DATE,
    ngayTao        DATETIME DEFAULT CURRENT_TIMESTAMP,
    trangThai      ENUM('hoatDong','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_KhachThue_DaiDien FOREIGN KEY (maKhachDaiDien) REFERENCES KhachThue(maKhach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Hợp đồng phòng
CREATE TABLE HopDongPhong (
    maHopDongPhong INT AUTO_INCREMENT PRIMARY KEY,
    maQuanLy       INT NOT NULL,
    maKhachDaiDien INT NOT NULL,
    maPhong        INT NOT NULL,
    tienPhong      FLOAT NOT NULL,
    tienCoc        FLOAT DEFAULT 0,
    ngayBatDau     DATE NOT NULL,
    ngayKetThuc    DATE NOT NULL,
    ngayTao        DATETIME DEFAULT CURRENT_TIMESTAMP,
    trangThai      ENUM('hoatDong','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_HopDong_QuanLy FOREIGN KEY (maQuanLy) REFERENCES TaiKhoan(maTaiKhoan),
    CONSTRAINT fk_HopDong_Khach FOREIGN KEY (maKhachDaiDien) REFERENCES KhachThue(maKhach),
    CONSTRAINT fk_HopDong_Phong FOREIGN KEY (maPhong) REFERENCES Phong(maPhong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Hợp đồng dịch vụ
CREATE TABLE HopDongDichVu (
    maHopDongDichVu INT AUTO_INCREMENT PRIMARY KEY,
    maHopDongPhong  INT NOT NULL,
    maDichVu        INT NOT NULL,
    soLuong         INT DEFAULT 1,
    donGia          FLOAT NOT NULL,
    ngayBatDau      DATE NOT NULL,
    ngayKetThuc     DATE NOT NULL,
    trangThai       ENUM('hoatDong','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_HDDV_HopDongPhong FOREIGN KEY (maHopDongPhong) REFERENCES HopDongPhong(maHopDongPhong),
    CONSTRAINT fk_HDDV_DichVu FOREIGN KEY (maDichVu) REFERENCES DichVu(maDichVu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Bảng Hóa đơn
CREATE TABLE HoaDon (
    maHoaDon       INT AUTO_INCREMENT PRIMARY KEY,
    maPhong        INT NOT NULL,
    maKhachDaiDien INT NOT NULL,
    tienPhong      FLOAT NOT NULL,
    tienNoCu       FLOAT DEFAULT 0,
    tongTien       FLOAT NOT NULL,
    thangNam       DATE NOT NULL,
    ngayTao        DATETIME DEFAULT CURRENT_TIMESTAMP,
    capNhatLanCuoi DATETIME,
    trangThai      ENUM('hoatDong','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_HoaDon_Phong FOREIGN KEY (maPhong) REFERENCES Phong(maPhong),
    CONSTRAINT fk_HoaDon_Khach FOREIGN KEY (maKhachDaiDien) REFERENCES KhachThue(maKhach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Chi tiết hợp đồng dịch vụ
CREATE TABLE ChiTietHopDongDichVu (
    maChiTietHDDV   INT AUTO_INCREMENT PRIMARY KEY,
    maHopDongDichVu INT NOT NULL,
    thangNam        DATE NOT NULL,
    chiSoCu         FLOAT NOT NULL,
    chiSoMoi        FLOAT NOT NULL,
    soLuongTieuThu  FLOAT NOT NULL,
    thanhTien       FLOAT NOT NULL,
    capNhatLanCuoi  DATETIME NOT NULL,
    CONSTRAINT fk_CT_HDDV FOREIGN KEY (maHopDongDichVu) REFERENCES HopDongDichVu(maHopDongDichVu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Phiếu thu
CREATE TABLE PhieuThu (
    maPhieuThu     INT AUTO_INCREMENT PRIMARY KEY,
    maHoaDon       INT NOT NULL,
    maKhachDaiDien INT NOT NULL,
    soTienNo       FLOAT DEFAULT 0,
    soTienDaTra    FLOAT DEFAULT 0,
    ghiChu         VARCHAR(255),
    hanThanhToan   DATE,
    capNhatLanCuoi DATETIME,
    trangThai      ENUM('hoatDong','daTra','daXoa') DEFAULT 'hoatDong',
    CONSTRAINT fk_PhieuThu_HoaDon FOREIGN KEY (maHoaDon) REFERENCES HoaDon(maHoaDon),
    CONSTRAINT fk_PhieuThu_Khach FOREIGN KEY (maKhachDaiDien) REFERENCES KhachThue(maKhach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;