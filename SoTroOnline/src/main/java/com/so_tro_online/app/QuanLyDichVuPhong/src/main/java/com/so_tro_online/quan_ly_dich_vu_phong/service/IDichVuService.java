package com.so_tro_online.quan_ly_dich_vu_phong.service;

import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IDichVuService {
    public DichVuReponse getDichVu();
    public DichVuReponse updateDichVu(Integer id,DichVuRequest dichVuRequest);
}
