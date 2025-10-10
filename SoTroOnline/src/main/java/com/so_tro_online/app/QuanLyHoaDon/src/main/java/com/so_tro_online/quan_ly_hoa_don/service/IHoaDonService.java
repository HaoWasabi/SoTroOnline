package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;

import java.util.List;

public interface IHoaDonService {
    public List<HoaDonResponse>getAllHoaDon();
    public HoaDonResponse getHoaDonById(Integer id);
    public List<HoaDonResponse>getHoaDonByDate(Integer thang, Integer nam);
}
