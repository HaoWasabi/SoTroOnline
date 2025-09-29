package com.so_tro_online.quan_ly_phieu_thu.service;

import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface IPhieuThuService {
    @Autowired
    private PhieuThuRepository phieuThuRepository;
    public PhieuThu create(PhieuThu phieuThu);
    public PhieuThu update(Integer maPhieuThu, PhieuThu phieuThu);
    public PhieuThu softDelete(Integer maPhieuThu);
    public PhieuThu unDelete(Integer maPhieuThu);
    public int countByTrangThai(TrangThaiPhieuThu trangThai);
    public int countByTrangThaiNot(TrangThaiPhieuThu trangThai);
    public Optional<PhieuThu> findTopActive();
    public Optional<PhieuThu> findTopByTrangThaiOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai);
    public Optional<PhieuThu> findTopByTrangThaiNotOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai);
    public Optional<PhieuThu> findByMaPhieuThuAndTrangThai(Integer maPhieuThu, TrangThaiPhieuThu trangThai);
    public Optional<PhieuThu> findByMaPhieuThuAndTrangThaiNot(Integer maPhieuThu, TrangThaiPhieuThu trangThai);
    public List<PhieuThu> findAll();
    public List<PhieuThu> findAllActive();
    public List<PhieuThu> findAllByTrangThai(TrangThaiPhieuThu trangThai);
    public List<PhieuThu> findAllByTrangThaiNot(TrangThaiPhieuThu trangThai);
    public List<PhieuThu> findByTienNoGreaterThan(BigDecimal soTien);
}