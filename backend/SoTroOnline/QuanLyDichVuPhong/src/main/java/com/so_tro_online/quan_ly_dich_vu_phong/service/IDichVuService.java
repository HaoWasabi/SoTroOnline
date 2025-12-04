package com.so_tro_online.quan_ly_dich_vu_phong.service;

import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;

public interface IDichVuService {
    public DichVuReponse getDichVu();
    public DichVuReponse updateDichVu(Integer id,DichVuRequest dichVuRequest);
}
