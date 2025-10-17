package com.so_tro_online.quan_ly_hop_dong_phong.repository;


import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;


import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface HopDongPhongRepository extends JpaRepository<HopDongPhong,Integer> {

    List<HopDongPhong>  findByTrangThai(TrangThai trangThai);

    List<HopDongPhong> findByKhachThueMaKhach(Integer maKhachThue);

    Optional<HopDongPhong> findByMaHopDongPhongAndTrangThai(Integer id, TrangThai trangThai);

    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END " +
            "FROM HopDongPhong h " +
            "WHERE h.phong.maPhong = :maPhong " +
            "AND h.khachThue.maKhach = :maKhach " +
            "AND h.trangThai = :trangThai")
    boolean existsHopDong(@Param("maPhong") Integer maPhong,
                               @Param("maKhach") Integer maKhach,
                               @Param("trangThai") TrangThai trangThai);

    boolean existsByPhongAndTrangThai(Phong phong, TrangThai trangThai);

    @Query(value = """
    SELECT * FROM hop_dong_phong hdp where trang_thai = 'hoat_dong' AND NOT EXISTS (
        SELECT 1 FROM hoa_don hd
        WHERE hd.ma_hop_dong_phong = hdp.ma_hop_dong_phong
        AND hd.thang = :thang AND hd.nam = :nam
    )
""", nativeQuery = true)
    List<HopDongPhong> findAllNotHasHoaDonByThangAndNam(@Param("thang") int thang, @Param("nam") int nam);
}
