package com.so_tro_online.quan_ly_hop_dong_dich_vu.repository;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.SuDungDichVu;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SuDungDichVuRepository extends JpaRepository<SuDungDichVu,Integer> {
    @Query("""
    SELECT s FROM SuDungDichVu s
    WHERE s.phong.maPhong = :maPhong
      AND FUNCTION('MONTH', s.thangNam) = :thang
      AND FUNCTION('YEAR', s.thangNam) = :nam
      And s.trangThai = :trangThai
""")
    Optional<SuDungDichVu> findByPhongAndThangNam(
            @Param("maPhong") Integer maPhong,
            @Param("thang") int thang,
            @Param("nam") int nam,
            @Param("trangThai") TrangThai trangThai);

    List<SuDungDichVu> findByPhongMaPhongAndTrangThaiOrderByThangNamDesc(Integer maPhong, TrangThai trangThai);
}
