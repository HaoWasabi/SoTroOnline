package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonDTO;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public interface IHoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;
    private TrangThaiHoaDon trangThai;
    public HoaDonDTO create(HoaDonDTO hoaDon);
    public HoaDonDTO softDelete(Integer maHoaDon);
    public HoaDonDTO unDelete(Integer maHoaDon);
    public int countActive();
    public int countByTrangThai(TrangThaiHoaDon trangThai);
    public int countByTrangThaiNot(TrangThaiHoaDon trangThai);
    public Optional<HoaDonDTO> findTopActive();
    public Optional<HoaDonDTO> findTopByTrangThaiOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai);
    public Optional<HoaDonDTO> findTopByTrangThaiNotOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai);
    public Optional<HoaDonDTO> findByMaHoaDonAndTrangThai(Integer maHoaDon, TrangThaiHoaDon trangThai);
    public Optional<HoaDonDTO> findByMaHoaDonAndTrangThaiNot(Integer maHoaDon, TrangThaiHoaDon trangThai);
    public List<HoaDonDTO> findAllActive();
    public List<HoaDonDTO> findAllByTrangThai(TrangThaiHoaDon trangThai);
    public List<HoaDonDTO> findAllByTrangThaiNot(TrangThaiHoaDon trangThai);
    public List<HoaDonDTO> findByTrangThaiActiveAndTienNoGreaterThan(BigDecimal soTien);
}