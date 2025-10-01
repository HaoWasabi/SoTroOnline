package com.so_tro_online.quan_ly_hop_dong_dich_vu.repository;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.HopDongDichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface HopDongDichVuRepository extends JpaRepository<HopDongDichVu,Integer> {
    // Tìm theo mã Khách Đại Diện
    List<HopDongDichVu> findByKhachThue_MaKhach(Integer maKhachDaiDien);

    // Tìm theo mã Dịch Vụ
    List<HopDongDichVu> findByDichVu_MaDichVu(Integer maDichVu);

    // Tìm theo mã Quản Lý (Tài Khoản)
    List<HopDongDichVu> findByTaiKhoan_MaTaiKhoan(Integer maQuanLy);

    // Tìm theo ngày bắt đầu
    List<HopDongDichVu> findByNgayBatDau(Date ngayBatDau);

    // Tìm theo ngày kết thúc
    List<HopDongDichVu> findByNgayKetThuc(Date ngayKetThuc);
    // Tìm theo trạng thái
    List<HopDongDichVu> findByTrangThai(TrangThai trangThai);
    boolean existsByKhachThue_MaKhachAndDichVu_MaDichVuAndNgayBatDauBeforeAndNgayKetThucAfterAndMaHopDongDichVuNot(
            Integer maKhachThue,
            Integer maDichVu,
            Date ngayKetThuc,
            Date ngayBatDau,
            Integer maHopDongDichVu
    );
    boolean existsByKhachThue_MaKhachAndDichVu_MaDichVuAndNgayBatDauBeforeAndNgayKetThucAfter(Integer maKhach, Integer maDichVu,Date ngayBatDau,Date ngayKetThuc);
    Optional<HopDongDichVu> findByMaHopDongDichVuAndTrangThai(Integer id,TrangThai trangThai);
}
