package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.ChiTietHoaDonDichVu;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiChiTietHoaDonDichVu;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface IChiTietHoaDonDichVuService {
    @Autowired
    private ChiTietHoaDonDichVuRepository chiTietHoaDonDichVuRepository;
    public ChiTietHoaDonDichVu create(ChiTietHoaDonDichVu chiTietHoaDonDichVu);
    public ChiTietHoaDonDichVu update(Integer maChiTietHoaDonDichVu, ChiTietHoaDonDichVu chiTietHoaDonDichVu);
    public ChiTietHoaDonDichVu softDelete(Integer maChiTietHoaDonDichVu);
    public ChiTietHoaDonDichVu unDelete(Integer maChiTietHoaDonDichVu);
    public int countByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai);
    public int countByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVu> findTopActive();
    public Optional<ChiTietHoaDonDichVu> findTopByTrangThaiOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVu> findTopByTrangThaiNotOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVu> findByMaChiTietHoaDonDichVuAndTrangThai(Integer maChiTietHoaDonDichVu, TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVu> findByMaChiTietHoaDonDichVuAndTrangThaiNot(Integer maChiTietHoaDonDichVu, TrangThaiChiTietHoaDonDichVu trangThai);
    public List<ChiTietHoaDonDichVu> findAll();
    public List<ChiTietHoaDonDichVu> findAllActive();
    public List<ChiTietHoaDonDichVu> findAllByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai);
    public List<ChiTietHoaDonDichVu> findAllByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai);
}