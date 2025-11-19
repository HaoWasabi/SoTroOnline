package com.so_tro_online.quan_ly_hop_dong_phong.controller;



import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.service.IHopDongPhongService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contract")
public class HopDongPhongController {
    private final IHopDongPhongService hopDongPhongService;

    public HopDongPhongController(IHopDongPhongService hopDongPhongService) {
        this.hopDongPhongService = hopDongPhongService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2> getAll() {

        return ResponseEntity.ok(new ApiResponseV2("success", hopDongPhongService.getAllHopDongPhong()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponseV2>getAllActive() {

        return ResponseEntity.ok(new ApiResponseV2("success", hopDongPhongService.getAllHopDongPhongActive()));
    }
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponseV2>getByCustomer(@PathVariable Integer customerId) {
        return ResponseEntity.ok(new ApiResponseV2("success", hopDongPhongService.getAllHopDongPhongByMaKhachThue(customerId)));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponseV2>getById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", hopDongPhongService.getHopDongPhongById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponseV2>getActiveById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", hopDongPhongService.getHopDongPhongActiveById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponseV2>createHopDongPhong(@RequestBody HopDongPhongRequest request) {
        return ResponseEntity.status(201).body(new ApiResponseV2("success",hopDongPhongService.createHopDongPhong(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseV2>updateHopDongPhong(@PathVariable Integer id, @RequestBody HopDongPhongRequest request) {
        return ResponseEntity.ok(new ApiResponseV2("success",hopDongPhongService.updateHopDongPhong(id,request) ));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseV2>deleteHopDongPhong(@PathVariable Integer id) {
        hopDongPhongService.deleteHopDongPhong(id);
        return ResponseEntity.ok(new ApiResponseV2("success", null));
    }
    @GetMapping("/print/{id}")
    public void printHopDongPhong(@PathVariable Integer id, HttpServletResponse response) throws Exception {
        hopDongPhongService.printHopDongPhong(response, id);
    }
    @GetMapping("/invoice")
    public ResponseEntity<ApiResponseV2> getHoaDon(@RequestParam int thang, @RequestParam int nam) {
        return ResponseEntity.ok(new ApiResponseV2("success", hopDongPhongService.findAllNotHasHoaDonByThangAndNam(thang, nam)));
    }

}