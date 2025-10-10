package com.so_tro_online.quan_ly_hop_dong_dich_vu.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.HopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.service.IMyHopDongDichVu;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/myhopdongdichvu")
public class MyHopDongDichVuController {
    private final IMyHopDongDichVu myHopDongDichVuService;

    public MyHopDongDichVuController(IMyHopDongDichVu myHopDongDichVuService) {
        this.myHopDongDichVuService = myHopDongDichVuService;
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllHopDongDichVu() {
        return ResponseEntity.ok(new ApiResponse("success", myHopDongDichVuService.getAllHopDongDichVu()));
    }

    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getHopDongDichVuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", myHopDongDichVuService.getHopDongDichVuById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createHopDongDichVu(@RequestBody MyHopDongDichVuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success",myHopDongDichVuService.createHopDongDichVu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateHopDongDichVu(@PathVariable Integer id, @RequestBody MyHopDongDichVuRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", myHopDongDichVuService.updateHopDongDichVu(id,request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse>deleteHopDongDichVu(@PathVariable Integer id) {
        myHopDongDichVuService.deleteHopDongDichVu(id);
        return ResponseEntity.ok(new ApiResponse("success", null));
    }
    @GetMapping("/hopdong/{id}")
    public ResponseEntity<ApiResponse> getHopDongDichVuByHopDongPhongId(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", myHopDongDichVuService.getHopDongDichVuByMaHopDong(id)));
    }
}
