package com.so_tro_online.quan_ly_phieu_thu.controller;

import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuDTO;
import com.so_tro_online.quan_ly_phieu_thu.entity.PhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.entity.TrangThaiPhieuThu;
import com.so_tro_online.quan_ly_phieu_thu.exception.PhieuThuAlreadyExists;
import com.so_tro_online.quan_ly_phieu_thu.exception.PhieuThuNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phieu-thu")
public class PhieuThuController {
    private final PhieuThuService phieuThuService;

    public PhieuThuController(PhieuThuService phieuThuService) {
        this.phieuThuService = phieuThuService;
    }

    @PostMapping("/add")
    public ResponseEntity<PhieuThuDTO> create(@RequestBody PhieuThuDTO phieuThu) {
        PhieuThuDTO createdPhieuThu = phieuThuService.create(phieuThu);
        return new ResponseEntity<>(createdPhieuThu, HttpStatus.CREATED);
    }

    @PutMapping("/delete?id={maPhieuThu}")
    public ResponseEntity<PhieuThuDTO> softDelete(@PathVariable Integer maPhieuThu) {
        try {
            PhieuThuDTO deletedPhieuThu = phieuThuService.softDelete(maPhieuThu);
            return new ResponseEntity<>(deletedPhieuThu, HttpStatus.OK);
        } catch (PhieuThuNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<PhieuThuDTO>> findAllActive() {
        List<PhieuThuDTO> activePhieuThus = phieuThuService.findAllActive()
                .map(List::of)
                .orElse(List.of());
        return new ResponseEntity<>(activePhieuThus, HttpStatus.OK);
    }

    @GetMapping("/id={maPhieuThu}")
    public ResponseEntity<PhieuThuDTO> findActiveById(@PathVariable Integer ma
    PhieuThu) {
        try {
            PhieuThuDTO phieuThu = phieuThuService.findByMaPhieuThuAndTrangThai(maPhieuThu, TrangThaiPhieuThu.HOAT_DONG)
                    .orElseThrow(() -> new PhieuThuNotFound("Phieu Thu not found or inactive"));
            return new ResponseEntity<>(phieuThu, HttpStatus.OK);
        } catch (PhieuThuNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countActive() {
        try {
            int count = phieuThuService.countActive();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(0, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top")
    public ResponseEntity<List<PhieuThuDTO>> findTopActivePhieuThus() {
        List<PhieuThuDTO> topActivePhieuThus = phieuThuService.findTopActive()
                .map(List::of)
                .orElse(List.of());
        return new ResponseEntity<>(topActivePhieuThus, HttpStatus.OK);
    }

    @GetMapping("/top?status={trangThai}")
    public ResponseEntity<List<PhieuThuDTO>> findTopPhieuThusByTrangThai
            (@PathVariable TrangThaiPhieuThu trangThai) {
        try {
            List<PhieuThuDTO> topPhieuThus = phieuThuService.findTopByTrangThaiOrderByMaPhieuThuDesc(trangThai)
                    .map(List::of)
                    .orElse(List.of());
            return new ResponseEntity<>(topPhieuThus, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(List.of(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top?status-not={trangThai}")
    public ResponseEntity<List<PhieuThuDTO>> findTopPhieuThusByTrangThai
            (@PathVariable TrangThaiPhieuThu trangThai) {
        try {
            List<PhieuThuDTO> topPhieuThus = phieuThuService.findTopByTrangThaiNotOrderByMaPhieuThuDesc(trangThai)
                    .map(List::of)
                    .orElse(List.of());
            return new ResponseEntity<>(topPhieuThus, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(List.of(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }   
}