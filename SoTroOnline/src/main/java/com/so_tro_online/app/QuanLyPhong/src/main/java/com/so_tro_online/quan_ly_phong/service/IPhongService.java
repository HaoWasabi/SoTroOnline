package com.so_tro_online.quan_ly_phong.service;

import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;
import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.JRException;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    Integer importExcel(MultipartFile file);
    void exportToExcel(HttpServletResponse response);
    List<RoomResponse>searchRoom(String tenPhong, String loaiPhong, String diaChi, BigDecimal chieuDai,
     BigDecimal chieuRong,String vatDung, BigDecimal giaThueCoBan
    );
    void sendEmailReminderForRooms(LocalDate ngay);
    byte[] exportReport(String format) throws FileNotFoundException, JRException;
}
