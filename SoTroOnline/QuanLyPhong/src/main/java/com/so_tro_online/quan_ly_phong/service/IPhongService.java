package com.so_tro_online.quan_ly_phong.service;


import com.so_tro_online.dung_chung.dto.PagedResponse;
import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
@Repository
public interface IPhongService {
    public List<RoomResponse> getAllRooms(Integer managerId);
    public PagedResponse<RoomResponse> getAllRoomsPaged(int page, int size, Integer managerId);
    public List<RoomResponse> getAllRoomsActive(Integer managerId);
    public PagedResponse<RoomResponse> getAllRoomsActivePaged(int page, int size, Integer managerId);
    public RoomResponse getRoomById(Integer id);
    public RoomResponse getRoomActiveById(Integer id);
    public RoomResponse createRoom(RoomRequest roomRequest);
    public RoomResponse updateRoom(Integer id, RoomRequest roomRequest);
    public void deleteRoom(Integer id);
    Integer importExcel(MultipartFile file);
    void exportToExcel(HttpServletResponse response);
    List<RoomResponse> searchRoom(String searchTerm, Integer managerId);
    PagedResponse<RoomResponse> searchRoomPaged(String searchTerm, int page, int size, Integer managerId);
    PagedResponse<RoomResponse> searchRoomPaged(String searchTerm, String statusFilter, int page, int size, Integer managerId);
    
    // Backward compatibility methods without manager filtering
    default List<RoomResponse> getAllRooms() {
        return getAllRooms(null);
    }
    
    default PagedResponse<RoomResponse> getAllRoomsPaged(int page, int size) {
        return getAllRoomsPaged(page, size, null);
    }
    
    default List<RoomResponse> getAllRoomsActive() {
        return getAllRoomsActive(null);
    }
    
    default PagedResponse<RoomResponse> getAllRoomsActivePaged(int page, int size) {
        return getAllRoomsActivePaged(page, size, null);
    }
    
    default List<RoomResponse> searchRoom(String searchTerm) {
        return searchRoom(searchTerm, null);
    }
    
    default PagedResponse<RoomResponse> searchRoomPaged(String searchTerm, int page, int size) {
        return searchRoomPaged(searchTerm, page, size, null);
    }
    
    // Tenant management methods
    List<?> getRoomTenants(Integer roomId);
    Object addTenantToRoom(Integer roomId, Integer tenantId, Integer managerId);
    void removeTenantFromRoom(Integer roomId, Integer tenantId);
}