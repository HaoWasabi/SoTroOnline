package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonRequest;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

public interface IHoaDonService {
    public List<HoaDonResponse>getAllHoaDon();
    public List<HoaDonResponse>getAllActiveHoaDon();
    
    // User-based filtering methods for multi-tenant data isolation
    public List<HoaDonResponse> getAllActiveHoaDonByUser(Integer maTaiKhoan);
    
    public HoaDonResponse getHoaDonById(Integer id);
    //    public void printHoaDonByThangAndNam(HttpServletResponse response, Integer thang, Integer nam);
    public HoaDonResponse getActiveHoaDonById(Integer id);
    public List<HoaDonResponse>getHoaDonByDate(Integer thang, Integer nam);
    public List<HoaDonResponse>getAllByHopDong(Integer maHopDong);
    public HoaDonResponse createHoaDon(HoaDonRequest request);
    public void deleteHoaDon(Integer id);
    public void printHoaDon(Integer id, HttpServletResponse response);
}