package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface IHoaDonService {
    @Autowired
    private HoaDonRepository hoaDonRepository;
    public HoaDon create(HoaDon hoaDon);
    public HoaDon update(Integer maHoaDon, HoaDon hoaDon);
    public HoaDon softDelete(Integer maHoaDon);
    public HoaDon unDelete(Integer maHoaDon);
    public int countByTrangThai(TrangThaiHoaDon trangThai);
    public int countByTrangThaiNot(TrangThaiHoaDon trangThai);
    public Optional<HoaDon> findTopActive();
    public Optional<HoaDon> findTopByTrangThaiOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai);
    public Optional<HoaDon> findTopByTrangThaiNotOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai);
    public Optional<HoaDon> findByMaHoaDonAndTrangThai(Integer maHoaDon, TrangThaiHoaDon trangThai);
    public Optional<HoaDon> findByMaHoaDonAndTrangThaiNot(Integer maHoaDon, TrangThaiHoaDon trangThai);
    public List<HoaDon> findAll();
    public List<HoaDon> findAllActive();    
    public List<HoaDon> findAllByTrangThai(TrangThaiHoaDon trangThai);
    public List<HoaDon> findAllByTrangThaiNot(TrangThaiHoaDon trangThai);
    public List<HoaDon> findByTienNoGreaterThan(BigDecimal soTien);
}