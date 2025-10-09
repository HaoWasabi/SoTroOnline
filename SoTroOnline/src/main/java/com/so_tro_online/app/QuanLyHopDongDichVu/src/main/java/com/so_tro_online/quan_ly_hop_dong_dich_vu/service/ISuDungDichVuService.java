package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuResponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.SuDungDichVuResponse;

import java.util.List;

public interface ISuDungDichVuService {
    public List<SuDungDichVuResponse> getAllSuDungDichVu();
    public SuDungDichVuResponse createSuDungDichVu(SuDungDichVuRequest req);
    public SuDungDichVuResponse updateSuDungDichVu(Integer id, SuDungDichVuRequest req);
    public SuDungDichVuResponse getSuDungDichVu(Integer id);
}
