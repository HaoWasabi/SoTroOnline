package com.so_tro_online.quan_ly_phieu_thu.service;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuResponse;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuRequest;
import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuResponse;

import java.math.BigDecimal;
import java.util.List;

public interface IPhieuThuService {
    public List<PhieuThuResponse> getAllPhieuThu();
    public PhieuThuResponse createPhieuThu(PhieuThuRequest req);
    public PhieuThuResponse updatePhieuThu(Integer id, PhieuThuRequest req);
    public void deletePhieuThu(Integer id);
    public PhieuThuResponse getPhieuThuById(Integer id);
    public List<PhieuThuResponse> getPhieuThuByHoaDon(Integer maHoaDon);
    public List<PhieuThuResponse> getPhieuThuByKhachThue(Integer maKhachThue);
    public List<PhieuThuResponse> thuTienTuDong(Integer maHopDongPhong, BigDecimal soTienThu);
}
