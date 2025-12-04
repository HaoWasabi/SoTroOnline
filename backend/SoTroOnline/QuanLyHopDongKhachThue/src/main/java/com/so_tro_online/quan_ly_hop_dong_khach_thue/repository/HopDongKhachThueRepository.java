package com.so_tro_online.quan_ly_hop_dong_khach_thue.repository;

import com.so_tro_online.quan_ly_hop_dong_khach_thue.entity.HopDongKhachThue;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HopDongKhachThueRepository extends JpaRepository<HopDongKhachThue, Integer> {

    /**
     * Find all active tenants for a specific contract by contract ID
     */
    @Query("SELECT hdkt FROM HopDongKhachThue hdkt " +
           "JOIN FETCH hdkt.khachThue kt " +
           "WHERE hdkt.maHopDongPhong = :contractId " +
           "AND hdkt.trangThai = :trangThai " +
           "ORDER BY hdkt.laKhachDaiDien DESC, kt.hoTen ASC")
    List<HopDongKhachThue> findByContractIdAndTrangThai(@Param("contractId") Integer contractId, 
                                                        @Param("trangThai") HopDongKhachThue.TrangThai trangThai);

    /**
     * Find active tenant-contract relationship by IDs
     */
    @Query("SELECT hdkt FROM HopDongKhachThue hdkt " +
           "WHERE hdkt.maHopDongPhong = :contractId " +
           "AND hdkt.khachThue.maKhach = :tenantId " +
           "AND hdkt.trangThai = :trangThai")
    Optional<HopDongKhachThue> findByContractIdAndTenantIdAndTrangThai(@Param("contractId") Integer contractId,
                                                                       @Param("tenantId") Integer tenantId,
                                                                       @Param("trangThai") HopDongKhachThue.TrangThai trangThai);

    @Query("SELECT hdkt.khachThue FROM HopDongKhachThue hdkt WHERE hdkt.maHopDongPhong = :maHopDongPhong")
    List<KhachThue> getAllKhachThueByMaHopDongPhong(Integer maHopDongPhong);

    /**
     * Find active tenant-contract relationships for a tenant
     * Note: Contract validity (dates, status) should be checked by calling service
     */
    @Query("SELECT hdkt FROM HopDongKhachThue hdkt " +
           "WHERE hdkt.khachThue.maKhach = :tenantId " +
           "AND hdkt.trangThai = :trangThai")
    List<HopDongKhachThue> findActiveContractsByTenantId(@Param("tenantId") Integer tenantId,
                                                         @Param("trangThai") HopDongKhachThue.TrangThai trangThai);

    /**
     * Count active tenants in a contract
     */
    @Query("SELECT COUNT(hdkt) FROM HopDongKhachThue hdkt " +
           "WHERE hdkt.maHopDongPhong = :contractId " +
           "AND hdkt.trangThai = :trangThai")
    Long countActiveTenantsInContract(@Param("contractId") Integer contractId,
                                      @Param("trangThai") HopDongKhachThue.TrangThai trangThai);

    /**
     * Check if tenant already exists in contract by IDs
     */
    @Query("SELECT CASE WHEN COUNT(hdkt) > 0 THEN true ELSE false END FROM HopDongKhachThue hdkt " +
           "WHERE hdkt.maHopDongPhong = :contractId " +
           "AND hdkt.khachThue.maKhach = :tenantId " +
           "AND hdkt.trangThai = :trangThai")
    boolean existsByMaHopDongPhongAndKhachThueIdAndTrangThai(@Param("contractId") Integer contractId,
                                                           @Param("tenantId") Integer tenantId,
                                                           @Param("trangThai") HopDongKhachThue.TrangThai trangThai);

    /**
     * Find main tenant (representative) for a contract
     */
    @Query("SELECT hdkt FROM HopDongKhachThue hdkt " +
           "WHERE hdkt.maHopDongPhong = :contractId " +
           "AND hdkt.laKhachDaiDien = true " +
           "AND hdkt.trangThai = :trangThai")
    Optional<HopDongKhachThue> findMainTenantByContractId(@Param("contractId") Integer contractId,
                                                          @Param("trangThai") HopDongKhachThue.TrangThai trangThai);

    /**
     * Simple query - room tenants should be handled by QuanLyHopDongPhong service
     * This method is temporarily disabled to break circular dependency
     */
    // List<HopDongKhachThue> findTenantsByRoomId(Integer roomId, ...);

    /**
     * Simple tenant check - returns all tenants with any active tenant-contract relationships
     */
    @Query("SELECT DISTINCT hdkt.khachThue.maKhach FROM HopDongKhachThue hdkt " +
           "WHERE hdkt.trangThai = :tenantStatus")
    List<Integer> findTenantsWithActiveContracts(@Param("tenantStatus") HopDongKhachThue.TrangThai tenantStatus);

    /**
     * Simplified getAllActiveWithDetails - complex contract details should be handled by calling service
     */
    // Page<HopDongKhachThue> findAllActiveWithDetails(...);

    /**
     * Update tenant status to "moved out" 
     */
    @Query("UPDATE HopDongKhachThue hdkt SET hdkt.trangThai = :newStatus, hdkt.ngayRaO = :moveOutDate " +
           "WHERE hdkt.maHopDongPhong = :contractId " +
           "AND hdkt.khachThue.maKhach = :tenantId")
    void updateTenantStatus(@Param("contractId") Integer contractId,
                           @Param("tenantId") Integer tenantId,
                           @Param("newStatus") HopDongKhachThue.TrangThai newStatus,
                           @Param("moveOutDate") LocalDate moveOutDate);
}
