package com.so_tro_online.quan_ly_dich_vu_phong.service;

import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IDichVuService {
    public List<DichVuReponse> getAllDichVu();
    public List<DichVuReponse> getAllDichVuActive();
    public DichVuReponse getDichVuById(Integer id);
    public DichVuReponse getDichVuActiveById(Integer id);
    public DichVuReponse createDichVu(DichVuRequest roomRequest);
    public DichVuReponse updateDichVu(Integer id, DichVuRequest roomRequest);
    public void deleteDichVu(Integer id);
    Integer importExcel(MultipartFile file);
    void exportToExcel(HttpServletResponse response);
}
