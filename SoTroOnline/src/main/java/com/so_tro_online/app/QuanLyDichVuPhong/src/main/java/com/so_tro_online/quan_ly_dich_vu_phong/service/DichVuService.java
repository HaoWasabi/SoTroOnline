package com.so_tro_online.quan_ly_dich_vu_phong.service;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuReponse;
import com.so_tro_online.quan_ly_dich_vu_phong.dto.DichVuRequest;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_phong.entity.Phong;
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
import com.so_tro_online.quan_ly_dich_vu_phong.entity.TrangThai;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class DichVuService implements IDichVuService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    @Autowired
    private DichVuRepository dichVuRepository;
    @Override
    public List<DichVuReponse> getAllDichVu() {
        return dichVuRepository.findAll().stream().map(this::mapToDichVuResponse).toList();
    }

    @Override
    public List<DichVuReponse> getAllDichVuActive() {

        return dichVuRepository.findByTrangThai(TrangThai.hoatDong)
                .stream().map(this::mapToDichVuResponse).toList();
    }
    @Override
    public DichVuReponse getDichVuById(Integer id) {
        return dichVuRepository.findById(id).map(this::mapToDichVuResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
    }

    @Override
    public DichVuReponse getDichVuActiveById(Integer id) {
        return dichVuRepository.findByMaDichVuAndTrangThai(id, TrangThai.hoatDong)
                .map(this::mapToDichVuResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
    }

    @Override
    public DichVuReponse createDichVu(DichVuRequest dichVuRequest) {
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(dichVuRequest.getMaQuanLy(),com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+dichVuRequest.getMaQuanLy()));
        if(dichVuRepository.existsByTenDichVuAndTrangThai(dichVuRequest.getTenDichVu(),TrangThai.hoatDong)){
            throw new RoomAldreadyExist("dịch vụ phòng đã tồn tại: "+dichVuRequest.getTenDichVu());
        }
        DichVu dichVu = getDichVu(dichVuRequest, taiKhoan);
        return mapToDichVuResponse(dichVuRepository.save(dichVu));
    }

    private DichVu getDichVu(DichVuRequest dichVuRequest, TaiKhoan taiKhoan) {
        DichVu dichVu = new DichVu();
        dichVu.setTenDichVu(dichVuRequest.getTenDichVu());
        dichVu.setDonGiaCoBan(dichVuRequest.getDonGiaCoBan());
        dichVu.setDonViCoBan(dichVuRequest.getDonViCoBan());
        dichVu.setMoTa(dichVuRequest.getMoTa());
        dichVu.setTrangThai(dichVuRequest.getTrangThai());
        dichVu.setTaiKhoan(taiKhoan);
        return dichVu;
    }

    @Override
    public DichVuReponse updateDichVu(Integer id, DichVuRequest dichVuRequest) {
        DichVu dichVu= dichVuRepository.findByMaDichVuAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
        if(dichVuRepository.existsByTenDichVuAndMaDichVuNotAndTrangThai(dichVuRequest.getTenDichVu(),id,TrangThai.hoatDong)){
            throw new RoomAldreadyExist("phòng đã tồn tại: "+dichVuRequest.getTenDichVu());
        }
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(dichVuRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+ dichVuRequest.getMaQuanLy()));
        dichVu.setTenDichVu(dichVuRequest.getTenDichVu());
        dichVu.setMoTa(dichVuRequest.getMoTa());
        dichVu.setTrangThai(dichVuRequest.getTrangThai());
        dichVu.setDonViCoBan(dichVuRequest.getDonViCoBan());
        dichVu.setTaiKhoan(taiKhoan);
        return mapToDichVuResponse(dichVuRepository.save(dichVu));
    }

    @Override
    public void deleteDichVu(Integer id) {
        DichVu dichVu= dichVuRepository.findByMaDichVuAndTrangThai(id, TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy dịch vụ phòng với id: "+id));
        dichVu.setTrangThai(TrangThai.daXoa);
        dichVuRepository.save(dichVu);
    }

    @Override
    public Integer importExcel(MultipartFile file) {
        int countSaved = 0;
        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // bỏ header (row 0)
                Row row = sheet.getRow(i);
                if (row == null) continue;
                try {
                    DichVu dichVu=new DichVu();
                    int maQuanLy = (int) row.getCell(0).getNumericCellValue();
                    TaiKhoan taiKhoan = taiKhoanRepository.findById(maQuanLy).
                            orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+maQuanLy));
                    dichVu.setTaiKhoan(taiKhoan);
                    if(dichVuRepository.existsByTenDichVuAndTrangThai(row.getCell(1).getStringCellValue(), TrangThai.hoatDong)){
                        throw new RoomAldreadyExist("dịch vụ đã tồn tại: "+row.getCell(1).getStringCellValue());
                    }
                    dichVu.setTenDichVu(row.getCell(1).getStringCellValue());
                    dichVu.setDonGiaCoBan(BigDecimal.valueOf(row.getCell(2).getNumericCellValue()));
                    dichVu.setDonViCoBan(row.getCell(3).getStringCellValue());
                    dichVu.setMoTa(row.getCell(4).getStringCellValue());
                    dichVu.setTrangThai(TrangThai.valueOf(row.getCell(5).getStringCellValue()));
                    dichVuRepository.save(dichVu);
                    countSaved++;
                }
                catch (Exception e){

                }

            }

        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel: " + e.getMessage(), e);
        }
        return countSaved;
    }

    @Override
    public void exportToExcel(HttpServletResponse response) {
        try (Workbook workbook = new XSSFWorkbook()) { // false để tạo workbook định dạng .xlsx
            Sheet sheet = workbook.createSheet("Dịch vụ");
            Row header = sheet.createRow(0);
            String[] columns = {"Mã quản lý", "Tên dịch vụ", "Đơn giá cơ bản", "Đơn vị cơ bản", "Mô tả", "Trạng thái"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            List<DichVu>dichVuList= dichVuRepository.findAll();
            int rowNum = 1;
            for (DichVu dichvu: dichVuList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dichvu.getTaiKhoan().getMaTaiKhoan());
                row.createCell(1).setCellValue(dichvu.getTenDichVu());
                row.createCell(2).setCellValue(dichvu.getDonGiaCoBan().doubleValue());
                row.createCell(3).setCellValue(dichvu.getDonViCoBan());
                row.createCell(4).setCellValue(dichvu.getMoTa());
                row.createCell(5).setCellValue(dichvu.getTrangThai().name());
            }
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=dichvu.xlsx");
            workbook.write(response.getOutputStream());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất file Excel: " + e.getMessage(), e);
        }
    }

    public DichVuReponse mapToDichVuResponse(DichVu dichVu) {
        DichVuReponse response = new DichVuReponse();
        response.setMaDichVu(dichVu.getMaDichVu());
        response.setTenDichVu(dichVu.getTenDichVu());
        response.setDonGiaCoBan(dichVu.getDonGiaCoBan());
        response.setDonViCoBan(dichVu.getDonViCoBan());
        response.setMoTa(dichVu.getMoTa());
        response.setTrangThai(dichVu.getTrangThai());
        response.setMaQuanLy(dichVu.getTaiKhoan().getMaTaiKhoan());
        response.setTenQuanLy(dichVu.getTaiKhoan().getHoTen());
        return response;
    }
}
