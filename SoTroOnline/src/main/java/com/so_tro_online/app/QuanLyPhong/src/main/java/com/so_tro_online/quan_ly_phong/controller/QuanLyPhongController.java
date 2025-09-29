package com.so_tro_online.quan_ly_phong.controller;


import com.so_tro_online.dto.ApiResponse;
import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.service.IPhongService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/rooms")

public class QuanLyPhongController {
    public QuanLyPhongController(IPhongService phongService) {
        this.phongService = phongService;
    }

    private final IPhongService phongService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponse>getAllRooms() {

        return ResponseEntity.ok(new ApiResponse("success", phongService.getAllRooms()));
    }
    @GetMapping("/active")
    public ResponseEntity<ApiResponse>getAllRoomsActive() {

        return ResponseEntity.ok(new ApiResponse("success", phongService.getAllRoomsActive()));
    }
    @GetMapping("/{id}")
    public  ResponseEntity<ApiResponse>getRoomById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", phongService.getRoomById(id)));
    }
    @GetMapping("/active/{id}")
    public  ResponseEntity<ApiResponse>getRoomActiveById(@PathVariable  Integer id) {
        return ResponseEntity.ok(new ApiResponse("success", phongService.getRoomActiveById(id)));
    }
    @PostMapping()
    public ResponseEntity<ApiResponse>createRoom(@RequestBody RoomRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse("success", phongService.createRoom(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse>updateRoom(@PathVariable Integer id, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(new ApiResponse("success", phongService.updateRoom(id, request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse>deleteRoom(@PathVariable Integer id) {
        phongService.deleteRoom(id);
        return ResponseEntity.ok(new ApiResponse("success", null));
    }
}