package com.so_tro_online.quan_ly_phieu_thu.service;

import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuDTO;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public interface IPhieuThuService {
    @Autowired
    private PhieuThuRepository phieuThuRepository;
    private TrangThaiPhieuThu trangThai;
    public PhieuThuDTO create(PhieuThuDTO phieuThu);
    public PhieuThuDTO softDelete(Integer maPhieuThu);
    public PhieuThuDTO unDelete(Integer maPhieuThu);
    public int countActive();
    public int countByTrangThai(TrangThaiPhieuThu trangThai);
    public int countByTrangThaiNot(TrangThaiPhieuThu trangThai);
    public Optional<PhieuThuDTO> findTopActive();
    public Optional<PhieuThuDTO> findTopByTrangThaiOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai);
    public Optional<PhieuThuDTO> findTopByTrangThaiNotOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai);
    public Optional<PhieuThuDTO> findByMaPhieuThuAndTrangThai(Integer maPhieuThu, TrangThaiPhieuThu trangThai);
    public Optional<PhieuThuDTO> findByMaPhieuThuAndTrangThaiNot(Integer maPhieuThu, TrangThaiPhieuThu trangThai);
    public List<PhieuThuDTO> findAllActive();
    public List<PhieuThuDTO> findAllByTrangThai(TrangThaiPhieuThu trangThai);
    public List<PhieuThuDTO> findAllByTrangThaiNot(TrangThaiPhieuThu trangThai);
    public List<PhieuThuDTO> findByTrangThaiActiveAndTienNoGreaterThan(BigDecimal soTien);
}