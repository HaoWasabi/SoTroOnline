package com.so_tro_online.quan_ly_phieu_thu.service;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuDTO;
import com.so_tro_online.quan_ly_phieu_thu.repository.PhieuThuRepository;

import java.util.List;
import java.util.Optional;

@Service
class PhieuThuService implements IPhieuThuService {
    public PhieuThuDTO create(PhieuThuDTO phieuThu) {
        return phieuThuRepository.save(phieuThu);
    }

    public PhieuThuDTO softDelete(Integer maPhieuThu) {
        Optional<PhieuThuDTO> existingPhieuThu = phieuThuRepository.findById(maPhieuThu);
        if (existingPhieuThu.isPresent()) {
            PhieuThuDTO phieuThu = existingPhieuThu.get();
            phieuThu.setTrangThai(TrangThaiPhieuThu.DA_HUY);
            return phieuThuRepository.save(phieuThu);
        }
        return null;
    }

    public PhieuThuDTO unDelete(Integer maPhieuThu) {
        Optional<PhieuThuDTO> existingPhieuThu = phieuThuRepository.findById(maPhieuThu);
        if (existingPhieuThu.isPresent()) {
            PhieuThuDTO phieuThu = existingPhieuThu.get();
            phieuThu.setTrangThai(TrangThaiPhieuThu.HOAT_DONG);
            return phieuThuRepository.save(phieuThu);
        }
        return null;
    }

    public int countByTrangThai(TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.countByTrangThai(trangThai);
    }

    public int countByTrangThaiNot(TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.countByTrangThaiNot(trangThai);
    }

    public Optional<PhieuThuDTO> findTopActive() {
        return phieuThuRepository.findTopByTrangThaiOrderByMaPhieuThuDesc(TrangThaiPhieuThu.ACTIVE);
    }
    public Optional<PhieuThuDTO> findTopByTrangThaiOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.findTopByTrangThaiOrderByMaPhieuThuDesc(trangThai);
    }

    public Optional<PhieuThuDTO> findTopByTrangThaiNotOrderByMaPhieuThuDesc(TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.findTopByTrangThaiNotOrderByMaPhieuThuDesc(trangThai);
    }

    public Optional<PhieuThuDTO> findByMaPhieuThuAndTrangThai(Integer maPhieuThu, TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.findByMaPhieuThuAndTrangThai(maPhieuThu, trangThai);
    }

    public Optional<PhieuThuDTO> findByMaPhieuThuAndTrangThaiNot(Integer maPhieuThu, TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.findByMaPhieuThuAndTrangThaiNot(maPhieuThu, trangThai);
    }
    public List<PhieuThuDTO> findAll() {
        return phieuThuRepository.findAll();
    }

    public List<PhieuThuDTO> findAllActive() {
        return phieuThuRepository.findAllByTrangThai(TrangThaiPhieuThu.ACTIVE);
    }

    public List<PhieuThuDTO> findAllByTrangThai(TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.findAllByTrangThai(trangThai);
    }

    public List<PhieuThuDTO> findAllByTrangThaiNot(TrangThaiPhieuThu trangThai) {
        return phieuThuRepository.findAllByTrangThaiNot(trangThai);
    }

    public List<PhieuThuDTO> findByTienNoGreaterThan(BigDecimal soTien) {
        return phieuThuRepository.findByTienNoGreaterThan(soTien);
    }

}