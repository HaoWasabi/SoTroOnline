package com.so_tro_online.quan_ly_hop_dong_phong.controller;

import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.service.IHopDongPhongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hop-dong-phong")
public class HopDongPhongController {
    private final IHopDongPhongService hopDongPhongService;

    public HopDongPhongController(IHopDongPhongService hopDongPhongService) {
        this.hopDongPhongService = hopDongPhongService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAll() {

        return ResponseEntity.ok(new ApiResponse("success", hopDongPhongService.getAllHopDongPhong()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponse>getAllActive() {

        return ResponseEntity.ok(new ApiResponse("success", hopDongPhongService.getAllHopDongPhongActive()));
    }
    @GetMapping("/byCustomer/{customerId}")
    public ResponseEntity<ApiResponse>getByCustomer(@PathVariable Integer customerId) {
        return ResponseEntity.ok(new ApiResponse("success", hopDongPhongService.getAllHopDongPhongByMaKhachThue(customerId)));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", hopDongPhongService.getHopDongPhongById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponse>getActiveById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", hopDongPhongService.getHopDongPhongActiveById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createHopDongPhong(@RequestBody HopDongPhongRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success",hopDongPhongService.createHopDongPhong(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateHopDongPhong(@PathVariable Integer id, @RequestBody HopDongPhongRequest request) {
        return ResponseEntity.ok(new ApiResponse("success",hopDongPhongService.updateHopDongPhong(id,request) ));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse>deleteHopDongPhong(@PathVariable Integer id) {
        hopDongPhongService.deleteHopDongPhong(id);
        return ResponseEntity.ok(new ApiResponse("success", null));
    }

}
