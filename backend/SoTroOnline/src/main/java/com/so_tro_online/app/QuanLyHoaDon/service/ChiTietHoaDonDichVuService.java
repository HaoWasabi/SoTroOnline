package com.so_tro_online.quan_ly_chi_tiet_hoa_don_dich_vu.service;
import com.so_tro_online.quan_ly_chi_tiet_hoa_don_dich_vu.entity.TrangThaiChiTietHoaDonDichVu;
import com.so_tro_online.quan_ly_chi_tiet_hoa_don_dich_vu.dto.ChiTietHoaDonDichVuDTO;
import com.so_tro_online.quan_ly_chi_tiet_hoa_don_dich_vu.repository.ChiTietHoaDonDichVuRepository;

import java.util.List;
import java.util.Optional;

@Service
class ChiTietHoaDonDichVuService implements IChiTietHoaDonDichVuService {
    public ChiTietHoaDonDichVuDTO create(ChiTietHoaDonDichVuDTO chiTietHoaDonDichVu) {
        return chiTietHoaDonDichVuRepository.save(chiTietHoaDonDichVu);
    }

    public ChiTietHoaDonDichVuDTO softDelete(Integer maChiTietHoaDonDichVu) {
        Optional<ChiTietHoaDonDichVuDTO> existingChiTiet = chiTietHoaDonDichVuRepository.findById(maChiTietHoaDonDichVu);
        if (existingChiTiet.isPresent()) {
            ChiTietHoaDonDichVuDTO chiTiet = existingChiTiet.get();
            chiTiet.setTrangThai(TrangThaiChiTietHoaDonDichVu.DA_HUY);
            return chiTietHoaDonDichVuRepository.save(chiTiet);
        }
        return null;
    }

    public ChiTietHoaDonDichVuDTO unDelete(Integer maChiTietHoaDonDichVu) {
        Optional<ChiTietHoaDonDichVuDTO> existingChiTiet = chiTietHoaDonDichVuRepository.findById(maChiTietHoaDonDichVu);
        if (existingChiTiet.isPresent()) {
            ChiTietHoaDonDichVuDTO chiTiet = existingChiTiet.get();
            chiTiet.setTrangThai(TrangThaiChiTietHoaDonDichVu.HOAT_DONG);
            return chiTietHoaDonDichVuRepository.save(chiTiet);
        }
        return null;
    }

    public int countByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.countByTrangThai(trangThai);
    }

    public int countByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.countByTrangThaiNot(trangThai);
    }

    public Optional<ChiTietHoaDonDichVuDTO> findTopActive() {
        return chiTietHoaDonDichVuRepository.findTopByTrangThaiOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu.ACTIVE);
    }
    public Optional<ChiTietHoaDonDichVuDTO> findTopByTrangThaiOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.findTopByTrangThaiOrderByMaChiTietHoaDonDichVuDesc(trangThai);
    }

    public Optional<ChiTietHoaDonDichVuDTO> findTopByTrangThaiNotOrderByMaChiTietHoaDonDichVuDesc(TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.findTopByTrangThaiNotOrderByMaChiTietHoaDonDichVuDesc(trangThai);
    }

    public Optional<ChiTietHoaDonDichVuDTO> findByMaHoaDonAndTrangThai(Integer maHoaDon, TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.findByMaHoaDonAndTrangThai(maHoaDon, trangThai);
    }

    public Optional<ChiTietHoaDonDichVuDTO> findByMaHoaDonAndTrangThaiNot(Integer maHoaDon, TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.findByMaHoaDonAndTrangThaiNot(maHoaDon, trangThai);
    }
    public List<ChiTietHoaDonDichVuDTO> findAll() {
        return chiTietHoaDonDichVuRepository.findAll();
    }

    public List<ChiTietHoaDonDichVuDTO> findAllActive() {
        return chiTietHoaDonDichVuRepository.findAllByTrangThai(TrangThaiChiTietHoaDonDichVu.ACTIVE);
    }

    public List<TrangThaiChiTietHoaDonDichVu> findAllByTrangThai(TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.findAllByTrangThai(trangThai);
    }

    public List<ChiTietHoaDonDichVuDTO> findAllByTrangThaiNot(TrangThaiChiTietHoaDonDichVu trangThai) {
        return chiTietHoaDonDichVuRepository.findAllByTrangThaiNot(trangThai);
    }
}