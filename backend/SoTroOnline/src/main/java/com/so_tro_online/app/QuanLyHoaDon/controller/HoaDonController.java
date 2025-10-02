package com.so_tro_online.quan_ly_hoa_don.controller;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonDTO;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThaiHoaDon;
import com.so_tro_online.quan_ly_hoa_don.exception.HoaDonAlreadyExists;
import com.so_tro_online.quan_ly_hoa_don.exception.HoaDonNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hoa-don")
public class HoaDonController {
    private final HoaDonService hoaDonService;

    public HoaDonController(HoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }
    @PostMapping("/add")
    public ResponseEntity<HoaDonDTO> create(@RequestBody HoaDonDTO hoaDonDTO) {
        try {
            HoaDonDTO createdHoaDon = hoaDonService.create(hoaDonDTO);
            return new ResponseEntity<>(createdHoaDon, HttpStatus.CREATED);
        } catch (HoaDonAlreadyExists e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/delete?id={maHoaDon}")
    public ResponseEntity<HoaDonDTO> softDelete(@PathVariable Integer maHoaDon) {
        try {
            HoaDonDTO deletedHoaDon = hoaDonService.softDelete(maHoaDon);
            return new ResponseEntity<>(deletedHoaDon, HttpStatus.OK);
        } catch (HoaDonNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<HoaDonDTO>> findAllActive() {
        List<HoaDonDTO> activeHoaDons = hoaDonService.findAllActive()
                .map(List::of)
                .orElse(List.of());
        return new ResponseEntity<>(activeHoaDons, HttpStatus.OK);
    }

    @GetMapping("/id={maHoaDon}")
    public ResponseEntity<HoaDonDTO> findActiveById(@PathVariable Integer maHoaDon) {
        try {
            HoaDonDTO hoaDon = hoaDonService.findActiveById(maHoaDon)
                    .orElseThrow(() -> new HoaDonNotFound("Hoa Don not found or inactive"));
            return new ResponseEntity<>(hoaDon, HttpStatus.OK);
        } catch (HoaDonNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countActive() {
        try {
            int count;
            count = hoaDonService.countActive();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (HoaDonNotFound e) {
            return new ResponseEntity<>(0, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top")
    public ResponseEntity<List<HoaDonDTO>> findTopActiveHoaDons() {
        List<HoaDonDTO> topActiveHoaDons = hoaDonService.findTopActive()
                .map(List::of)
                .orElse(List.of());
        return new ResponseEntity<>(topActiveHoaDons, HttpStatus.OK);
    }

    @GetMapping("/top?status={trangThai}")
    public ResponseEntity<List<HoaDonDTO>> findTopHoaDonsByTrangThai(@PathVariable TrangThaiHoaDon trangThai) {
        try {
            List<HoaDonDTO> topHoaDons = hoaDonService.findTopByTrangThaiOrderByMaHoaDonDesc(trangThai)
                    .map(List::of)
                    .orElse(List.of());
            return new ResponseEntity<>(topHoaDons, HttpStatus.OK);
        } catch (HoaDonNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/top?status-not={trangThai}")
    public ResponseEntity<List<HoaDonDTO>> findTopHoaDonsByTrangThaiNot(@PathVariable TrangThaiHoaDon trangThai) {
        try {
            List<HoaDonDTO> topHoaDons = hoaDonService.findTopByTrangThaiNotOrderByMaHoaDonDesc(trangThai)
                    .map(List::of)
                    .orElse(List.of());
            return new ResponseEntity<>(topHoaDons, HttpStatus.OK);
        } catch (HoaDonNotFound e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
}