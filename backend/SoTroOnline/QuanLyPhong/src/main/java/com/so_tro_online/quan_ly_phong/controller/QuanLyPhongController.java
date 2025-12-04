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

import java.util.List;


@RestController
@RequestMapping("/api/rooms")

public class QuanLyPhongController {
    public QuanLyPhongController(IPhongService phongService) {
        this.phongService = phongService;
    }

    private final IPhongService phongService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponseV2>getAllRooms(@RequestParam(required = false) Integer managerId) {
        return ResponseEntity.ok(new ApiResponseV2("success", phongService.getAllRooms(managerId)));
    }
    
    @GetMapping("/all/paged")
    public ResponseEntity<ApiResponseV2> getAllRoomsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Integer managerId) {
        PagedResponse<RoomResponse> pagedResponse = phongService.getAllRoomsPaged(page, size, managerId);
        return ResponseEntity.ok(new ApiResponseV2("success", pagedResponse));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponseV2>getAllRoomsActive(@RequestParam(required = false) Integer managerId) {
        return ResponseEntity.ok(new ApiResponseV2("success", phongService.getAllRoomsActive(managerId)));
    }
    
    @GetMapping("/active/paged")
    public ResponseEntity<ApiResponseV2> getAllRoomsActivePaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Integer managerId) {
        PagedResponse<RoomResponse> pagedResponse = phongService.getAllRoomsActivePaged(page, size, managerId);
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
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer managerId){
        List<RoomResponse>list=phongService.searchRoom(search, managerId);
        return ResponseEntity.ok(new ApiResponseV2("success",list));
    }
    
    @GetMapping("/search/paged")
    public ResponseEntity<ApiResponseV2> searchPaged(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Integer managerId) {
        PagedResponse<RoomResponse> pagedResponse = phongService.searchRoomPaged(search, status, page, size, managerId);
        return ResponseEntity.ok(new ApiResponseV2("success", pagedResponse));
    }
    
    // Tenant management endpoints for rooms
    @GetMapping("/{roomId}/tenants")
    public ResponseEntity<ApiResponseV2> getRoomTenants(@PathVariable Integer roomId) {
        try {
            List<?> tenants = phongService.getRoomTenants(roomId);
            return ResponseEntity.ok(new ApiResponseV2("success", tenants));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseV2("error", "Failed to get room tenants: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{roomId}/tenants/{tenantId}")
    public ResponseEntity<ApiResponseV2> addTenantToRoom(
            @PathVariable Integer roomId, 
            @PathVariable Integer tenantId,
            @RequestParam Integer managerId) {
        try {
            Object result = phongService.addTenantToRoom(roomId, tenantId, managerId);
            return ResponseEntity.ok(new ApiResponseV2("success", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseV2("error", "Failed to add tenant to room: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{roomId}/tenants/{tenantId}")
    public ResponseEntity<ApiResponseV2> removeTenantFromRoom(
            @PathVariable Integer roomId, 
            @PathVariable Integer tenantId) {
        try {
            phongService.removeTenantFromRoom(roomId, tenantId);
            return ResponseEntity.ok(new ApiResponseV2("success", "Tenant removed from room successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseV2("error", "Failed to remove tenant from room: " + e.getMessage()));
        }
    }
}
