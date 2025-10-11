package com.so_tro_online.quan_ly_dich_vu_phong.service;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.exception.RoomAldreadyExist;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Service
public class DichVuService implements IDichVuService {

    @Autowired
    private DichVuRepository dichVuRepository;


    @Override
    public DichVuReponse getDichVu() {
        DichVu dichVu=dichVuRepository.findById(1).orElseThrow(()->new ReseourceNotFoundException("Dich vu not found"));
        DichVuReponse dichVuReponse = new DichVuReponse();
        dichVuReponse.setDonGiaDien(dichVu.getDonGiaDien());
        dichVuReponse.setDonGiaNuoc(dichVu.getDonGiaNuoc());
        dichVuReponse.setDonGiaRac(dichVu.getDonGiaRac());
        dichVuReponse.setMaDichVu(dichVu.getMaDichVu());
        return dichVuReponse;
    }

    @Override
    public DichVuReponse updateDichVu(Integer id,DichVuRequest dichVuRequest) {
        DichVu dichVu=dichVuRepository.findById(id).orElseThrow(()->new ReseourceNotFoundException("Dich vu not found"));
        dichVu.setDonGiaDien(dichVuRequest.getDonGiaDien());
        dichVu.setDonGiaNuoc(dichVuRequest.getDonGiaNuoc());
        dichVu.setDonGiaRac(dichVuRequest.getDonGiaRac());
        dichVuRepository.save(dichVu);
        DichVuReponse dichVuReponse = new DichVuReponse();
        dichVuReponse.setDonGiaDien(dichVu.getDonGiaDien());
        dichVuReponse.setDonGiaNuoc(dichVu.getDonGiaNuoc());
        dichVuReponse.setDonGiaRac(dichVu.getDonGiaRac());
        dichVuReponse.setMaDichVu(dichVu.getMaDichVu());
        return dichVuReponse;
    }
}
