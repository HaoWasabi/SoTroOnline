package com.so_tro_online.quan_ly_hop_dong_dich_vu.repository;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.SuDungDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;

@Repository
public interface SuDungDichVuRepository extends JpaRepository<SuDungDichVu,Integer> {
    @Query("""
    SELECT s FROM SuDungDichVu s
    WHERE s.hopDongDichVu.id = :hopDongDichVuId
      AND FUNCTION('MONTH', s.thangNam) = :thang
      AND FUNCTION('YEAR', s.thangNam) = :nam
""")
    SuDungDichVu findByHopDongDichVuIdAndThangNam(
            @Param("hopDongDichVuId") Integer hopDongDichVuId,
            @Param("thang") int thang,
            @Param("nam") int nam);
}
