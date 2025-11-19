package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IHopDongPhongService {
    public List<HopDongPhongResponse> getAllHopDongPhong();
    public List<HopDongPhongResponse> getAllHopDongPhongActive();
    public Page<HopDongPhongResponse> getAllHopDongPhongActivePaged(Pageable pageable);
    public HopDongPhongResponse getHopDongPhongById(Integer id);
    public HopDongPhongResponse getHopDongPhongActiveById(Integer id);
    public HopDongPhongResponse createHopDongPhong(HopDongPhongRequest hopDongRequest);
    public HopDongPhongResponse updateHopDongPhong(Integer id, HopDongPhongRequest roomRequest);
    public void deleteHopDongPhong(Integer id);
    public List<HopDongPhongResponse> getAllHopDongPhongByMaKhachThue(Integer maKhachThue);
    public void printHopDongPhong(HttpServletResponse response, Integer id);
    public List<HopDongPhongResponse>findAllNotHasHoaDonByThangAndNam(int thang, int nam);

}