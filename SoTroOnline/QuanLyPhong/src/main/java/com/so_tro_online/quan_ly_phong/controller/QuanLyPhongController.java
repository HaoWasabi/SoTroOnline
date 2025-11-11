package com.so_tro_online.quan_ly_phong.controller;


import com.so_tro_online.dung_chung.dto.ApiResponseV2;
import com.so_tro_online.dung_chung.dto.PagedResponse;
import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;
import com.so_tro_online.quan_ly_phong.service.IPhongService;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping("/api/rooms")

public class QuanLyPhongController {
    public QuanLyPhongController(IPhongService phongService) {
        this.phongService = phongService;
    }

    private final IPhongService phongService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2>getAllRooms() {

        return ResponseEntity.ok(new ApiResponseV2("success", phongService.getAllRooms()));
    }
    
    @GetMapping("/all/paged")
    public ResponseEntity<ApiResponseV2> getAllRoomsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        PagedResponse<RoomResponse> pagedResponse = phongService.getAllRoomsPaged(page, size);
        return ResponseEntity.ok(new ApiResponseV2("success", pagedResponse));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponseV2>getAllRoomsActive() {

        return ResponseEntity.ok(new ApiResponseV2("success", phongService.getAllRoomsActive()));
    }
    
    @GetMapping("/active/paged")
    public ResponseEntity<ApiResponseV2> getAllRoomsActivePaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        PagedResponse<RoomResponse> pagedResponse = phongService.getAllRoomsActivePaged(page, size);
        return ResponseEntity.ok(new ApiResponseV2("success", pagedResponse));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponseV2>getRoomById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", phongService.getRoomById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponseV2>getRoomActiveById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponseV2("success", phongService.getRoomActiveById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponseV2>createRoom(@RequestBody RoomRequest request) {
        return ResponseEntity.status(201).body(new ApiResponseV2("success", phongService.createRoom(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseV2>updateRoom(@PathVariable Integer id, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(new ApiResponseV2("success", phongService.updateRoom(id, request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseV2>deleteRoom(@PathVariable Integer id) {
        phongService.deleteRoom(id);
        return ResponseEntity.ok(new ApiResponseV2("success", null));
    }
    @PostMapping("/import")
    public ResponseEntity<ApiResponseV2> importExcel(@RequestParam("file") MultipartFile file) {
        int count = phongService.importExcel(file);
        return ResponseEntity.ok(new ApiResponseV2(String.format("import success:%d record",count), null));
    }
    @GetMapping("/export")
    public void exportExcel(HttpServletResponse response) {
        phongService.exportToExcel(response);
    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponseV2> search(
            @RequestParam(required = false) String tenPhong,@RequestParam(required = false) String loaiPhong,
            @RequestParam(required = false) String diaChi,@RequestParam(required = false) BigDecimal chieuDai,
            @RequestParam(required = false) BigDecimal chieuRong,
            @RequestParam(required = false) String vatDung,
            @RequestParam(required = false) BigDecimal giaThueCoBan){
        List<RoomResponse>list=phongService.searchRoom(tenPhong, loaiPhong, diaChi, chieuDai, chieuRong, vatDung, giaThueCoBan);
        return ResponseEntity.ok(new ApiResponseV2("success",list));
    }
    
    @GetMapping("/search/paged")
    public ResponseEntity<ApiResponseV2> searchPaged(
            @RequestParam(required = false) String tenPhong,
            @RequestParam(required = false) String loaiPhong,
            @RequestParam(required = false) String diaChi,
            @RequestParam(required = false) BigDecimal chieuDai,
            @RequestParam(required = false) BigDecimal chieuRong,
            @RequestParam(required = false) String vatDung,
            @RequestParam(required = false) BigDecimal giaThueCoBan,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        PagedResponse<RoomResponse> pagedResponse = phongService.searchRoomPaged(
                tenPhong, loaiPhong, diaChi, chieuDai, chieuRong, vatDung, giaThueCoBan, page, size);
        return ResponseEntity.ok(new ApiResponseV2("success", pagedResponse));
    }
}
