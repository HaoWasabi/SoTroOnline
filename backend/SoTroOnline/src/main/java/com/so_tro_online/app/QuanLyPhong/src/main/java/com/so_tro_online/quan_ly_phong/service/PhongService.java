package com.so_tro_online.quan_ly_phong.service;

import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.exception.RoomAldreadyExist;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service

public class PhongService implements IPhongService{
    private final TaiKhoanRepository taiKhoanRepository;
    private final PhongRepository phongRepository;

    public PhongService(TaiKhoanRepository taiKhoanRepository, PhongRepository phongRepository) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.phongRepository = phongRepository;
    }

    @Override
    public List<RoomResponse> getAllRooms() {
        return phongRepository.findAll().stream().map(this::mapToRoomResponse).toList();
    }

    @Override
    public List<RoomResponse> getAllRoomsActive() {
        return phongRepository.findByTrangThai(TrangThai.hoatDong)
                .stream().map(this::mapToRoomResponse).toList();
    }

    @Override
    public RoomResponse getRoomById(Integer id) {
        return phongRepository.findById(id).map(this::mapToRoomResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
    }

    @Override
    public RoomResponse getRoomActiveById(Integer id) {
        return phongRepository.findByMaPhongAndTrangThai(id,TrangThai.hoatDong)
                .map(this::mapToRoomResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng  với id: "+id));
    }

    @Override
    public RoomResponse createRoom(RoomRequest roomRequest) {
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(roomRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+roomRequest.getMaQuanLy()));
        if(phongRepository.existsByTenPhongAndTrangThai(roomRequest.getTenPhong(),TrangThai.hoatDong)){
            throw new RoomAldreadyExist("phòng đã tồn tại: "+roomRequest.getTenPhong());
        }
        Phong phong = getPhong(roomRequest, taiKhoan);
        return mapToRoomResponse(phongRepository.save(phong));

    }

    private static Phong getPhong(RoomRequest roomRequest, TaiKhoan taiKhoan) {
        Phong phong=new Phong();
        phong.setLoaiPhong(roomRequest.getLoaiPhong());
        phong.setTenPhong(roomRequest.getTenPhong());
        phong.setDiaChi(roomRequest.getDiaChi());
        phong.setChieuDai(roomRequest.getChieuDai());
        phong.setChieuRong(roomRequest.getChieuRong());
        phong.setVatDung(roomRequest.getVatDung());
        phong.setGiaThueCoBan(roomRequest.getGiaThueCoBan());
        phong.setTrangThai(roomRequest.getTrangThai());
        phong.setTaiKhoan(taiKhoan);
        return phong;
    }

    @Override
    public RoomResponse updateRoom(Integer id, RoomRequest roomRequest) {
        Phong phong= phongRepository.findByMaPhongAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
        if(phongRepository.existsByTenPhongAndMaPhongNotAndTrangThai(roomRequest.getTenPhong(),id,TrangThai.hoatDong)){
            throw new RoomAldreadyExist("phòng đã tồn tại: "+roomRequest.getTenPhong());
        }
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(roomRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+id));
        phong.setLoaiPhong(roomRequest.getLoaiPhong());
        phong.setTenPhong(roomRequest.getTenPhong());
        phong.setDiaChi(roomRequest.getDiaChi());
        phong.setChieuDai(roomRequest.getChieuDai());
        phong.setChieuRong(roomRequest.getChieuRong());
        phong.setVatDung(roomRequest.getVatDung());
        phong.setGiaThueCoBan(roomRequest.getGiaThueCoBan());
        phong.setTrangThai(roomRequest.getTrangThai());
        return mapToRoomResponse(phongRepository.save(phong));
    }

    @Override
    public void deleteRoom(Integer id) {
        Phong phong= phongRepository.findByMaPhongAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
        phong.setTrangThai(TrangThai.daXoa);
        phongRepository.save(phong);
    }
    public RoomResponse mapToRoomResponse(Phong phong) {
        return new RoomResponse(phong.getMaPhong(),phong.getTaiKhoan().getHoTen(),phong.getTaiKhoan().getMaTaiKhoan(),
                phong.getTenPhong() ,phong.getLoaiPhong(), phong.getDiaChi(),phong.getChieuDai(),phong.getChieuRong()
                ,phong.getVatDung(),phong.getGiaThueCoBan(),phong.getTrangThai()
        );
    }
}
