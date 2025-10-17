package com.so_tro_online.quan_ly_hoa_don.repository;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Arrays;
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
    @Query(value = """
    SELECT * FROM hoa_don
    WHERE MONTH(ngay_tao) = :thang
      AND YEAR(ngay_tao) = :nam
""", nativeQuery = true)
    List<HoaDon> findByMonthAndYear(Integer thang, Integer nam);

    List<HoaDon> findByHopDongPhong(HopDongPhong hopDongPhong);

    boolean existsByHopDongPhongAndThangAndNam(HopDongPhong item, Integer thang, Integer nam);
}
