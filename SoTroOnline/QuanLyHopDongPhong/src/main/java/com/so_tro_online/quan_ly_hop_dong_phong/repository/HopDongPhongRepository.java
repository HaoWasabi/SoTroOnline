package com.so_tro_online.quan_ly_hop_dong_phong.repository;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HopDongPhongRepository extends JpaRepository<HopDongPhong,Integer> {

    List<HopDongPhong>  findByTrangThai(TrangThai trangThai);

    Page<HopDongPhong> findByTrangThai(TrangThai trangThai, Pageable pageable);

    Optional<HopDongPhong> findByMaHopDongPhongAndTrangThai(Integer id, TrangThai trangThai);

    boolean existsByPhongAndTrangThai(Phong phong, TrangThai trangThai);

    // Find active contracts by room ID
    @Query("SELECT hdp FROM HopDongPhong hdp WHERE hdp.phong.maPhong = :roomId AND hdp.trangThai = :trangThai")
    List<HopDongPhong> findByPhongMaPhongAndTrangThai(@Param("roomId") Integer roomId, @Param("trangThai") TrangThai trangThai);

    @Query(value = """
    SELECT * FROM hop_dong_phong hdp where trang_thai = 'hoatDong' AND NOT EXISTS (
        SELECT 1 FROM hoa_don hd
        WHERE hd.ma_hop_dong_phong = hdp.ma_hop_dong_phong
        AND hd.thang = :thang AND hd.nam = :nam
    )
""", nativeQuery = true)
    List<HopDongPhong> findAllNotHasHoaDonByThangAndNam(@Param("thang") int thang, @Param("nam") int nam);
}