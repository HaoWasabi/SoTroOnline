package com.so_tro_online.quan_ly_phieu_thu.controller;


import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuRequest;
import com.so_tro_online.quan_ly_phieu_thu.dto.ThuNoRequest;
import com.so_tro_online.quan_ly_phieu_thu.service.IPhieuThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipt")
public class PhieuThuController {
    private final IPhieuThuService phieuThuService;


    public PhieuThuController(IPhieuThuService phieuThuService) {
        this.phieuThuService = phieuThuService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2> getAllPhieuThu() {

        return ResponseEntity.ok(new ApiResponseV2("success", phieuThuService.getAllPhieuThu()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponseV2>getAllActivePhieuThu() {

        return ResponseEntity.ok(new ApiResponseV2("success", phieuThuService.getAllActivePhieuThu()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponseV2>getPhieuThuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success",phieuThuService.getPhieuThuById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponseV2>createPhieuThu(@RequestBody PhieuThuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponseV2("success", phieuThuService.createPhieuThu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseV2>updatePhieuThu(@PathVariable Integer id, @RequestBody PhieuThuRequest request) {
        return ResponseEntity.ok(new ApiResponseV2("success", phieuThuService.updatePhieuThu(id,request)));
    }
   @GetMapping("/invoice/{id}")
    public ResponseEntity<ApiResponseV2> getPhieuThuByHoaDon(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", phieuThuService.getPhieuThuByHoaDon(id)));
    }
    @GetMapping("/guest/{id}")
    public ResponseEntity<ApiResponseV2> getPhieuThuByKhachThue(@PathVariable Integer id) {
        return ResponseEntity.ok(new  ApiResponseV2("success", phieuThuService.getPhieuThuByKhachThue(id)));
    }
    @PostMapping("/debt-collection")
    public ResponseEntity<ApiResponseV2> thuNo(@RequestBody ThuNoRequest request) {
        return ResponseEntity.status(201).body(new ApiResponseV2("success", phieuThuService.thuTienTuDong(request.getMaHopDongPhong(),request.getSoTienThu())));
    }
}
