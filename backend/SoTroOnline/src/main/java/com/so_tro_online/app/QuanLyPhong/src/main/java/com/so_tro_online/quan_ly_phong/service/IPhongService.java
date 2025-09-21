package com.so_tro_online.quan_ly_phong.service;

import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IPhongService {
    public List<RoomResponse> getAllRooms();
    public List<RoomResponse> getAllRoomsActive();
    public RoomResponse getRoomById(Integer id);
    public RoomResponse getRoomActiveById(Integer id);
    public RoomResponse createRoom(RoomRequest roomRequest);
    public RoomResponse updateRoom(Integer id, RoomRequest roomRequest);
    public void deleteRoom(Integer id);
}
