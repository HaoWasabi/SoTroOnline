package com.so_tro_online.quan_ly_hop_dong_phong.repository;


import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;


import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface HopDongPhongRepository extends JpaRepository<HopDongPhong,Integer> {

    List<HopDongPhong> findByTrangThai(TrangThai trangThai);

    List<HopDongPhong> findByKhachThueMaKhach(Integer maKhachThue);

    Optional<HopDongPhong> findByMaHopDongPhongAndTrangThai(Integer id, TrangThai trangThai);

    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END " +
            "FROM HopDongPhong h " +
            "WHERE h.phong.maPhong = :maPhong " +
            "AND h.khachThue.maKhach = :maKhach " +
            "AND h.trangThai = :trangThai")
    boolean existsHopDong(@Param("maPhong") Integer maPhong,
                               @Param("maKhach") String maKhach,
                               @Param("trangThai") TrangThai trangThai);
}
