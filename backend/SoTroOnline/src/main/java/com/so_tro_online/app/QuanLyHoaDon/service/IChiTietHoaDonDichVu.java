package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.ChiTietHoaDonDichVuDTO;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiChiTietHoaDonDichVu;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public interface IChiTietHoaDonDichVuService {
    @Autowired
    private ChiTietHoaDonDichVuRepository chiTietHoaDonDichVuRepository;
    private TrangThaiChiTietHoaDonDichVu trangThai;
    public ChiTietHoaDonDichVuDTO create(ChiTietHoaDonDichVuDTO chiTietHoaDonDichVu);
    public ChiTietHoaDonDichVuDTO softDelete(Integer maChiTietHoaDonDichVu);
    public ChiTietHoaDonDichVuDTO unDelete(Integer maChiTietHoaDonDichVu);
    public int countActive();
    public int countByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai);
    public int countByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVuDTO> findTopActive();
    public Optional<ChiTietHoaDonDichVuDTO> findTopByTrangThaiOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVuDTO> findTopByTrangThaiNotOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVuDTO> findByMaChiTietHoaDonDichVuAndTrangThai(Integer maChiTietHoaDonDichVu, TrangThaiChiTietHoaDonDichVu trangThai);
    public Optional<ChiTietHoaDonDichVuDTO> findByMaChiTietHoaDonDichVuAndTrangThaiNot(Integer maChiTietHoaDonDichVu, TrangThaiChiTietHoaDonDichVu trangThai);
    public List<ChiTietHoaDonDichVuDTO> findAll();
    public List<ChiTietHoaDonDichVuDTO> findAllActive();
    public List<ChiTietHoaDonDichVuDTO> findAllByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai);
    public List<ChiTietHoaDonDichVuDTO> findAllByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai);
}