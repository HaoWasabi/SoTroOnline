package com.so_tro_online.quan_ly_hoa_don.repository;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    Optional<HoaDon> findTopByTrangThaiOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai);
    Optional<HoaDon> findTopByTrangThaiNotOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai);
    Optional<HoaDon> findByMaHoaDonAndTrangThai(Integer maHoaDon, TrangThaiHoaDon trangThai);
    Optional<HoaDon> findByMaHoaDonAndTrangThaiNot(Integer maHoaDon, TrangThaiHoaDon trangThai);
    List<HoaDon> findAllByTrangThai(TrangThaiHoaDon trangThai);
    List<HoaDon> findAllByTrangThaiNot(TrangThaiHoaDon trangThai);
    int countByTrangThai(TrangThaiHoaDon trangThai);
    int countByTrangThaiNot(TrangThaiHoaDon trangThai);
    @Modifying
    @Query("UPDATE HoaDon SET trangThai = :#{T(com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon).DA_HUY} WHERE maHoaDon = :maHoaDon AND trangThai != :#{T(com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon).DA_HUY}")
    Integer softDeleteById(Integer maHoaDon);
    @Modifying
    @Query("UPDATE HoaDon SET trangThai = :#{T(com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon).HOAT_DONG} WHERE maHoaDon = :maHoaDon AND trangThai = :#{T(com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon).DA_HUY}")
    Integer unDeleteById(Integer maHoaDon);
    // Tìm hóa đơn có tiền nợ lớn hơn một số tiền cụ thể
    @Query("SELECT * FROM HoaDon WHERE tienNo > :soTien AND trangThai = :#{T(com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon).HOAT_DONG}")
    List<HoaDon> findByTienNoGreaterThan(@Param("soTien") BigDecimal soTien);
}