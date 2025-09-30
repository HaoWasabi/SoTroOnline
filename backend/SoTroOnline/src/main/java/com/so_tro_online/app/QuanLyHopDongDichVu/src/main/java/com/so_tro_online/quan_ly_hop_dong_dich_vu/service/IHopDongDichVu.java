package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.HopDongDichVuReponse;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.HopDongDichVuRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;

import java.util.List;

public interface IHopDongDichVu {
    public List<HopDongDichVuReponse> getAllHopDongDichVu();
    public List<HopDongDichVuReponse> getAllHopDongDichVuActive();
    public HopDongDichVuReponse getHopDongDichVuById(Integer id);
    public HopDongDichVuReponse getHopDongDichVuActiveById(Integer id);
    public HopDongDichVuReponse createHopDongDichVu(HopDongDichVuRequest hopDongDichVuRequest);
    public HopDongDichVuReponse updateHopDongDichVu(Integer id, HopDongDichVuRequest hopDongDichVuRequest);
    public void deleteHopDongDichVu(Integer id);
}
