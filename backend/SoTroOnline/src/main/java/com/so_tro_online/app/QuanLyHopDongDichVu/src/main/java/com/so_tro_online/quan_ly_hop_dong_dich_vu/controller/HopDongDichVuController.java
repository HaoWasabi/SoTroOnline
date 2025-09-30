package com.so_tro_online.quan_ly_hop_dong_dich_vu.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.HopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.service.IHopDongDichVu;
import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hopdongdichvu")
public class HopDongDichVuController {
    private final IHopDongDichVu hopDongDichVu;

    public HopDongDichVuController(IHopDongDichVu hopDongDichVu) {
        this.hopDongDichVu = hopDongDichVu;
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllHopDongDichVu() {

        return ResponseEntity.ok(new ApiResponse("success", hopDongDichVu.getAllHopDongDichVu()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponse>getAllHopDongDichVuActive() {

        return ResponseEntity.ok(new ApiResponse("success", hopDongDichVu.getAllHopDongDichVuActive()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getHopDongDichVuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", hopDongDichVu.getHopDongDichVuById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponse>getHopDongDichVuActiveById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", hopDongDichVu.getHopDongDichVuActiveById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createHopDongDichVu(@RequestBody HopDongDichVuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success", hopDongDichVu.createHopDongDichVu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateHopDongDichVu(@PathVariable Integer id, @RequestBody HopDongDichVuRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", hopDongDichVu.updateHopDongDichVu(id,request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse>deleteHopDongDichVu(@PathVariable Integer id) {
        hopDongDichVu.deleteHopDongDichVu(id);
        return ResponseEntity.ok(new ApiResponse("success", null));
    }
}
