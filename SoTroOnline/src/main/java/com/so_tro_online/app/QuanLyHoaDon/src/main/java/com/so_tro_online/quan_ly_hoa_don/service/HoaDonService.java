package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.ChiTietHoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.TrangThai;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class HoaDonService implements IHoaDonService{
    private final HoaDonRepository hoaDonRepository;

    public HoaDonService(HoaDonRepository hoaDonRepository) {
        this.hoaDonRepository = hoaDonRepository;
    }


    @Override
    public List<HoaDonResponse> getAllHoaDon() {
        return hoaDonRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public HoaDonResponse getHoaDonById(Integer id) {
        return hoaDonRepository.findById(id).map(this::mapToResponse)
                .orElseThrow(()->new RuntimeException("Không tìm thấy hóa đơn với id: "+id));
    }



    @Override
    public List<HoaDonResponse> getHoaDonByDate(Integer thang, Integer nam) {
        return hoaDonRepository.findByMonthAndYear(thang, nam).stream()
                .map(this::mapToResponse).toList();
    }
    public HoaDonResponse mapToResponse(HoaDon hoaDon){
        HoaDonResponse response=new HoaDonResponse();
        response.setMaHoaDon(hoaDon.getMaHoaDon());
        response.setCapNhatLanCuoi(hoaDon.getCapNhatLanCuoi());
        response.setNgayTao(hoaDon.getNgayTao());
        response.setMaHopDongPhong(hoaDon.getHopDongPhong().getMaHopDongPhong());
        response.setMaPhong(hoaDon.getHopDongPhong().getPhong().getMaPhong());
        response.setNoiDung(hoaDon.getNoiDung());
        response.setTenPhong(hoaDon.getHopDongPhong().getPhong().getTenPhong());
        response.setTrangThai(hoaDon.getTrangThai());
        response.setTongTien(hoaDon.getTongTien());
        response.setTienConNo(hoaDon.getTienConNo());
        response.setCapNhatLanCuoi(hoaDon.getCapNhatLanCuoi());
        response.setTienDichVu(hoaDon.getTienDichVu());
        response.setTienPhong(hoaDon.getTienPhong());
        response.setChiTietHoaDons(mapToChiTietResponse(hoaDon));
        return response;
    }
    public List<ChiTietHoaDonResponse>mapToChiTietResponse(HoaDon hoaDon){
        return hoaDon.getChiTietHoaDons().stream()
                .map(chiTietHoaDon -> {
                    ChiTietHoaDonResponse response=new ChiTietHoaDonResponse();
                    response.setDonGia(chiTietHoaDon.getDonGia());
                    response.setId(chiTietHoaDon.getId());
                    response.setHeSo(chiTietHoaDon.getHeSo());
                    response.setMaHoaDon(chiTietHoaDon.getHoaDon().getMaHoaDon());
                    response.setSoLuong(chiTietHoaDon.getSoLuong());
                    response.setTenDichVu(chiTietHoaDon.getTenDichVu());
                    response.setThanhTien(chiTietHoaDon.getThanhTien());
                    response.setTienThucTe(chiTietHoaDon.getTienThucTe());
                    return response;
                }).toList();
    }
}
