package com.so_tro_online.quan_ly_hoa_don.controller;



import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonRequest;
import com.so_tro_online.quan_ly_hoa_don.service.IHoaDonService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;

@RestController
@RequestMapping("/api/invoice")
public class HoaDonController {
    private final IHoaDonService hoaDonService;

    public HoaDonController(IHoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2> getAllHoaDon() {

        return ResponseEntity.ok(new ApiResponseV2("success", hoaDonService.getAllHoaDon()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponseV2> getAllActiveHoaDon() {

        return ResponseEntity.ok(new ApiResponseV2("success", hoaDonService.getAllActiveHoaDon()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponseV2>getHoaDonById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success",hoaDonService.getHoaDonById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponseV2>getActiveHoaDonById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success",hoaDonService.getActiveHoaDonById(id)));
    }

    @GetMapping("/contract/{id}")
    public  ResponseEntity<ApiResponseV2>getHoaDonByHopDong(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success",hoaDonService.getAllByHopDong(id)));
    }
    @GetMapping("/date")
    public ResponseEntity<ApiResponseV2>getHoaDonByDate(@RequestParam Integer thang,@RequestParam Integer nam) {
        return ResponseEntity.ok(new ApiResponseV2("success",hoaDonService.getHoaDonByDate(thang, nam)));
    }
    @GetMapping("/print")
    public void printHoaDonByDate(@RequestParam Integer thang,@RequestParam Integer nam, HttpServletResponse res) throws IOException {
        hoaDonService.printHoaDonByThangAndNam(res,thang,nam);
    }
    @PostMapping
    public ResponseEntity<ApiResponseV2> createHoaDon(@RequestBody HoaDonRequest request) {
        return ResponseEntity.ok(new ApiResponseV2("success",hoaDonService.createHoaDon(request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseV2>deleteHoaDon(@PathVariable Integer id) {
        hoaDonService.deleteHoaDon(id);
        return ResponseEntity.ok(new ApiResponseV2("success", null));
    }
}
