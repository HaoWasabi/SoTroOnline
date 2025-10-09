package com.so_tro_online.quan_ly_hop_dong_dich_vu.service;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuRequest;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.dto.MyHopDongDichVuResponse;

import java.util.List;

public interface IMyHopDongDichVu {
    List<MyHopDongDichVuResponse> getAllHopDongDichVu();
    MyHopDongDichVuResponse createHopDongDichVu(MyHopDongDichVuRequest req);
    MyHopDongDichVuResponse updateHopDongDichVu(Integer id, MyHopDongDichVuRequest roomRequest);
    public void deleteHopDongDichVu(Integer id);
    public MyHopDongDichVuResponse getHopDongDichVuById(Integer id);

}
