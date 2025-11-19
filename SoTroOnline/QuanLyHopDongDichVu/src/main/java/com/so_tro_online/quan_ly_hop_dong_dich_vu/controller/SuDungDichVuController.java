package com.so_tro_online.quan_ly_hop_dong_dich_vu.controller;



import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.service.ISuDungDichVuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-using")
public class SuDungDichVuController {
    private final ISuDungDichVuService suDungDichVuService;

    public SuDungDichVuController(ISuDungDichVuService suDungDichVuService) {
        this.suDungDichVuService = suDungDichVuService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2> getAllSuDungDichVu() {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getAllSuDungDichVu()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponseV2>getHopDongDichVuById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getSuDungDichVu(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponseV2>createHopDongDichVu(@RequestBody SuDungDichVuRequest request) {
        return ResponseEntity.status(201).body(new ApiResponseV2("success",suDungDichVuService.createSuDungDichVu(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseV2>updateHopDongDichVu(@PathVariable Integer id, @RequestBody SuDungDichVuRequest request) {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.updateSuDungDichVu(id,request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseV2>deleteHopDongDichVu(@PathVariable Integer id) {
        suDungDichVuService.deleteSuDungDichVu(id);
        return ResponseEntity.ok(new ApiResponseV2("success", null));
    }
    @GetMapping("/room/{maPhong}")
    public ResponseEntity<ApiResponseV2>getAllSuDungDichVuActiveByPhong(@PathVariable Integer maPhong) {
        return ResponseEntity.ok(new ApiResponseV2("success", suDungDichVuService.getAllSuDungDichVuActiveByPhong(maPhong)));
    }
}
