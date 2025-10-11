package com.so_tro_online.quan_ly_phieu_thu.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuRequest;
import com.so_tro_online.quan_ly_phieu_thu.dto.ThuNoRequest;
import com.so_tro_online.quan_ly_phieu_thu.service.IPhieuThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phieu-thu")
public class PhieuThuController {
    private final IPhieuThuService phieuThuService;


    public PhieuThuController(IPhieuThuService phieuThuService) {
        this.phieuThuService = phieuThuService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllPhieuThu() {

        return ResponseEntity.ok(new ApiResponse("success", phieuThuService.getAllPhieuThu()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getPhieuThuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success",phieuThuService.getPhieuThuById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createPhieuThu(@RequestBody PhieuThuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success", phieuThuService.createPhieuThu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updatePhieuThu(@PathVariable Integer id, @RequestBody PhieuThuRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", phieuThuService.updatePhieuThu(id,request)));
    }
   @GetMapping("/hoa-don/{id}")
    public ResponseEntity<ApiResponse> getPhieuThuByHoaDon(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", phieuThuService.getPhieuThuByHoaDon(id)));
    }
    @GetMapping("/khach-thue/{id}")
    public ResponseEntity<ApiResponse> getPhieuThuByKhachThue(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", phieuThuService.getPhieuThuByKhachThue(id)));
    }
    @PostMapping("/thu-no")
    public ResponseEntity<ApiResponse> thuNo(@RequestBody ThuNoRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success", phieuThuService.thuTienTuDong(request.getMaHopDongPhong(),request.getSoTienThu())));
    }
}
