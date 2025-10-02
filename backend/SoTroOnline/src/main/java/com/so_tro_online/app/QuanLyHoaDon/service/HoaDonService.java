package com.so_tro_online.quan_ly_hoa_don.service;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonDTO;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;

import java.util.List;
import java.util.Optional;

@Service
class HoaDonService implements IHoaDonService {
    public HoaDonDTO create(HoaDonDTO hoaDon) {
        return hoaDonRepository.save(hoaDon);
    }

    public HoaDonDTO softDelete(Integer maHoaDon) {
        Optional<HoaDonDTO> existingHoaDon = hoaDonRepository.findById(maHoaDon);
        if (existingHoaDon.isPresent()) {
            HoaDonDTO hoaDon = existingHoaDon.get();
            hoaDon.setTrangThai(TrangThaiHoaDon.DA_HUY);
            return hoaDonRepository.save(hoaDon);
        }
        return null;
    }

    public HoaDonDTO unDelete(Integer maHoaDon) {
        Optional<HoaDonDTO> existingHoaDon = hoaDonRepository.findById(maHoaDon);
        if (existingHoaDon.isPresent()) {
            HoaDonDTO hoaDon = existingHoaDon.get();
            hoaDon.setTrangThai(TrangThaiHoaDon.HOAT_DONG);
            return hoaDonRepository.save(hoaDon);
        }
        return null;
    }

    public int countByTrangThai(TrangThaiHoaDon trangThai) {
        return hoaDonRepository.countByTrangThai(trangThai);
    }

    public int countByTrangThaiNot(TrangThaiHoaDon trangThai) {
        return hoaDonRepository.countByTrangThaiNot(trangThai);
    }

    public Optional<HoaDonDTO> findTopActive() {
        return hoaDonRepository.findTopByTrangThaiOrderByMaHoaDonDesc(TrangThaiHoaDon.ACTIVE);
    }
    public Optional<HoaDonDTO> findTopByTrangThaiOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai) {
        return hoaDonRepository.findTopByTrangThaiOrderByMaHoaDonDesc(trangThai);
    }

    public Optional<HoaDonDTO> findTopByTrangThaiNotOrderByMaHoaDonDesc(TrangThaiHoaDon trangThai) {
        return hoaDonRepository.findTopByTrangThaiNotOrderByMaHoaDonDesc(trangThai);
    }

    public Optional<HoaDonDTO> findByMaHoaDonAndTrangThai(Integer maHoaDon, TrangThaiHoaDon trangThai) {
        return hoaDonRepository.findByMaHoaDonAndTrangThai(maHoaDon, trangThai);
    }

    public Optional<HoaDonDTO> findByMaHoaDonAndTrangThaiNot(Integer maHoaDon, TrangThaiHoaDon trangThai) {
        return hoaDonRepository.findByMaHoaDonAndTrangThaiNot(maHoaDon, trangThai);
    }
    public List<HoaDonDTO> findAll() {
        return hoaDonRepository.findAll();
    }

    public List<HoaDonDTO> findAllActive() {
        return hoaDonRepository.findAllByTrangThai(TrangThaiHoaDon.ACTIVE);
    }

    public List<HoaDonDTO> findAllByTrangThai(TrangThaiHoaDon trangThai) {
        return hoaDonRepository.findAllByTrangThai(trangThai);
    }

    public List<HoaDonDTO> findAllByTrangThaiNot(TrangThaiHoaDon trangThai) {
        return hoaDonRepository.findAllByTrangThaiNot(trangThai);
    }

    public List<HoaDonDTO> findByTienNoGreaterThan(BigDecimal soTien) {
        return hoaDonRepository.findByTienNoGreaterThan(soTien);
    }

}