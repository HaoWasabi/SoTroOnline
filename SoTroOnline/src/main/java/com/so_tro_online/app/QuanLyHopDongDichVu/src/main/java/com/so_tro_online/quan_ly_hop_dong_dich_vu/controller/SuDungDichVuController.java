package com.so_tro_online.quan_ly_hop_dong_dich_vu.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.service.ISuDungDichVuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/sudungdichvu")
public class SuDungDichVuController {
    private final ISuDungDichVuService suDungDichVuService;

    public SuDungDichVuController(ISuDungDichVuService suDungDichVuService) {
        this.suDungDichVuService = suDungDichVuService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllSuDungDichVu() {
        return ResponseEntity.ok(new ApiResponse("success", suDungDichVuService.getAllSuDungDichVu()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getHopDongDichVuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", suDungDichVuService.getSuDungDichVu(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createHopDongDichVu(@RequestBody SuDungDichVuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success",suDungDichVuService.createSuDungDichVu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateHopDongDichVu(@PathVariable Integer id, @RequestBody SuDungDichVuRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", suDungDichVuService.updateSuDungDichVu(id,request)));
    }

}
