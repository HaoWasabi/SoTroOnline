package com.so_tro_online.quan_ly_hoa_don.controller;

import com.so_tro_online.quan_ly_hoa_don.dto.ChiTietHoaDonPhieuThuDTO;
import com.so_tro_online.quan_ly_hoa_don.entity.ChiTietHoaDonPhieuThu;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiChiTietHoaDonPhieuThu;
import com.so_tro_online.quan_ly_hoa_don.exception.ChiTietHoaDonPhieuThuAlreadyExists;
import com.so_tro_online.quan_ly_hoa_don.exception.ChiTietHoaDonPhieuThuNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chi-tiet-hoa-don")
public class ChiTietHoaDonDichVuController {
    private final ChiTietHoaDonPhieuThuService chiTietHoaDonPhieuThuService;

    public ChiTietHoaDonDichVuController(ChiTietHoaDonPhieuThuService chiTietHoaDonPhieuThuService) {
        this.chiTietHoaDonPhieuThuService = chiTietHoaDonPhieuThuService;
    }

    @PostMapping("/add")
    public ResponseEntity<ChiTietHoaDonPhieuThuDTO> create(@RequestBody ChiTietHoaDonPhieuThuDTO chiTietHoaDonPhieuThuDTO) {
        try {
            ChiTietHoaDonPhieuThuDTO createdChiTiet = chiTietHoaDonPhieuThuService.create(chiTietHoaDonPhieuThuDTO);
            return new ResponseEntity<>(createdChiTiet, HttpStatus.CREATED);
        } catch (ChiTietHoaDonPhieuThuAlreadyExists e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/delete?id={maChiTiet}")
    public ResponseEntity<ChiTietHoaDonPhieuThuDTO> softDelete(@PathVariable Integer maChiTiet) {
        try {
            ChiTietHoaDonPhieuThuDTO deletedChiTiet = chiTietHoaDonPhieuThuService.softDelete(maChiTiet);
            return new ResponseEntity<>(deletedChiTiet, HttpStatus.OK);
        } catch (ChiTietHoaDonPhieuThuNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ChiTietHoaDonPhieuThuDTO>> findAllActive() {
        List<ChiTietHoaDonPhieuThuDTO> activeChiTiets = chiTietHoaDonPhieuThuService.findAllActive()
                .map(List::of)
                .orElse(List.of());
        return new ResponseEntity<>(activeChiTiets, HttpStatus.OK);
    }

    @GetMapping("/id={maChiTiet}")
    public ResponseEntity<ChiTietHoaDonPhieuThuDTO> findActiveById(@PathVariable Integer maChiTiet) {
        try {
            ChiTietHoaDonPhieuThuDTO chiTiet = chiTietHoaDonPhieuThuService.findByMaChiTietAndTrangThai(maChiTiet, TrangThaiChiTietHoaDonPhieuThu.HOAT_DONG)
                    .orElseThrow(() -> new ChiTietHoaDonPhieuThuNotFound("Chi Tiet Hoa Don not found or inactive"));
            return new ResponseEntity<>(chiTiet, HttpStatus.OK);
        } catch (ChiTietHoaDonPhieuThuNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countActive() {
        try {
            int count = chiTietHoaDonPhieuThuService.countActive();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(0, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top")
    public ResponseEntity<List<ChiTietHoaDonPhieuThuDTO>> findTopActiveChiTiets() {
        List<ChiTietHoaDonPhieuThuDTO> topActiveChiTiets = chiTietHoaDonPhieuThuService.findTopActive()
                .map(List::of)
                .orElse(List.of());
        return new ResponseEntity<>(topActiveChiTiets, HttpStatus.OK);
    }

    @GetMapping("/top?status={trangThai}")
    public ResponseEntity<List<ChiTietHoaDonPhieuThuDTO>> findTopChiTietsByTrangThai(@PathVariable TrangThaiChiTietHoaDonPhieuThu trangThai) {
        try {
            List<ChiTietHoaDonPhieuThuDTO> topChiTiets = chiTietHoaDonPhieuThuService.findTopByTrangThaiOrderByMaChiTietDesc(trangThai)
                    .map(List::of)
                    .orElse(List.of());
            return new ResponseEntity<>(topChiTiets, HttpStatus.OK);
        } catch (ChiTietHoaDonPhieuThuNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/top?status-not={trangThai}")
    public ResponseEntity<List<ChiTietHoaDonPhieuThuDTO>> findTopChiTietsByTrangThaiNot(@PathVariable TrangThaiChiTietHoaDonPhieuThu trangThai) {
        try {
            List<ChiTietHoaDonPhieuThuDTO> topChiTiets = chiTietHoaDonPhieuThuService.findTopByTrangThaiNotOrderByMaChiTietDesc(trangThai)
                    .map(List::of)
                    .orElse(List.of());
            return new ResponseEntity<>(topChiTiets, HttpStatus.OK);
        } catch (ChiTietHoaDonPhieuThuNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}