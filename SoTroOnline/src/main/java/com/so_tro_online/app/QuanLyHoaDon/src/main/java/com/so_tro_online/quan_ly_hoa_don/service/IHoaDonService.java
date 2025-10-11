package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface IHoaDonService {
    public List<HoaDonResponse>getAllHoaDon();
    public HoaDonResponse getHoaDonById(Integer id);
    public List<HoaDonResponse>getHoaDonByDate(Integer thang, Integer nam);
    public List<HoaDonResponse>getAllByHopDong(Integer maHopDong);
    public void xuatHoaDonByThangAndNam(HttpServletResponse response,Integer thang,Integer nam) throws IOException;
}
