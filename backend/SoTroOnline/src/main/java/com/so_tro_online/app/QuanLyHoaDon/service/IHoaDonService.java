package com.so_tro_online.quan_ly_hoa_don.service;

import com.so_tro_online.quan_ly_hoa_don.dto.HoaDon;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IHoaDonService {
    public List<HoaDon> getAll();
    public List<HoaDon> getAllActive();
    public HoaDon getById(Integer id);
    public HoaDon getActiveById(Integer id);
    public HoaDon create(HoaDon hoaDon);
    public HoaDon update(Integer id, HoaDon hoaDon);
    public void delete(Integer id);
}