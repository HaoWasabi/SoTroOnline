package com.so_tro_online.quan_ly_hoa_don.repository;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface HoaDonRepository extends JpaRepository<HoaDon,Integer> {
    @Query(value = """
    SELECT * FROM hoa_don 
    WHERE ma_hop_dong_phong = :maHopDongPhong 
      AND tien_con_no > :soTien
    ORDER BY ngay_tao ASC
""", nativeQuery = true)
    List<HoaDon> findHoaDonConNo(
            @Param("maHopDongPhong") Integer maHopDongPhong,
            @Param("soTien") BigDecimal soTien);

}
