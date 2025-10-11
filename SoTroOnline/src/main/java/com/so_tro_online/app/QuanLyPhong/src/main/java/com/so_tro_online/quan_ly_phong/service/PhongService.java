package com.so_tro_online.quan_ly_phong.service;

import com.so_tro_online.quan_ly_phong.dto.RoomRequest;
import com.so_tro_online.quan_ly_phong.dto.RoomResponse;

import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.exception.RoomAldreadyExist;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Service

public class PhongService implements IPhongService{
    private final TaiKhoanRepository taiKhoanRepository;
    private final PhongRepository phongRepository;


    public PhongService(TaiKhoanRepository taiKhoanRepository, PhongRepository phongRepository) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.phongRepository = phongRepository;

    }

    @Override
    public List<RoomResponse> getAllRooms() {
        return phongRepository.findAll().stream().map(this::mapToRoomResponse).toList();
    }

    @Override
    public List<RoomResponse> getAllRoomsActive() {
        return phongRepository.findByTrangThai(TrangThai.hoatDong)
                .stream().map(this::mapToRoomResponse).toList();
    }

    @Override
    public RoomResponse getRoomById(Integer id) {
        return phongRepository.findById(id).map(this::mapToRoomResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
    }

    @Override
    public RoomResponse getRoomActiveById(Integer id) {
        return phongRepository.findByMaPhongAndTrangThai(id,TrangThai.hoatDong)
                .map(this::mapToRoomResponse)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng  với id: "+id));
    }

    @Override
    public RoomResponse createRoom(RoomRequest roomRequest) {

        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(roomRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+roomRequest.getMaQuanLy()));
        if(phongRepository.existsByTenPhongAndTrangThai(roomRequest.getTenPhong(),TrangThai.hoatDong)){
            throw new RoomAldreadyExist("phòng đã tồn tại: "+roomRequest.getTenPhong());
        }
        Phong phong = getPhong(roomRequest, taiKhoan);
        return mapToRoomResponse(phongRepository.save(phong));

    }

    private static Phong getPhong(RoomRequest roomRequest, TaiKhoan taiKhoan) {
        Phong phong=new Phong();
        phong.setLoaiPhong(roomRequest.getLoaiPhong());
        phong.setTenPhong(roomRequest.getTenPhong());
        phong.setDiaChi(roomRequest.getDiaChi());
        phong.setChieuDai(roomRequest.getChieuDai());
        phong.setChieuRong(roomRequest.getChieuRong());
        phong.setVatDung(roomRequest.getVatDung());
        phong.setGiaThueCoBan(roomRequest.getGiaThueCoBan());
        phong.setTrangThai(roomRequest.getTrangThai());
        phong.setTaiKhoan(taiKhoan);
        return phong;
    }

    @Override
    public RoomResponse updateRoom(Integer id, RoomRequest roomRequest) {
        Phong phong= phongRepository.findByMaPhongAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
        if(phongRepository.existsByTenPhongAndMaPhongNotAndTrangThai(roomRequest.getTenPhong(),id,TrangThai.hoatDong)){
            throw new RoomAldreadyExist("phòng đã tồn tại: "+roomRequest.getTenPhong());
        }
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(roomRequest.getMaQuanLy(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+id));
        phong.setLoaiPhong(roomRequest.getLoaiPhong());
        phong.setTenPhong(roomRequest.getTenPhong());
        phong.setDiaChi(roomRequest.getDiaChi());
        phong.setChieuDai(roomRequest.getChieuDai());
        phong.setChieuRong(roomRequest.getChieuRong());
        phong.setVatDung(roomRequest.getVatDung());
        phong.setGiaThueCoBan(roomRequest.getGiaThueCoBan());
        phong.setTrangThai(roomRequest.getTrangThai());
        phong.setTaiKhoan(taiKhoan);
        return mapToRoomResponse(phongRepository.save(phong));
    }

    @Override
    public void deleteRoom(Integer id) {
        Phong phong= phongRepository.findByMaPhongAndTrangThai(id,TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+id));
        phong.setTrangThai(TrangThai.daXoa);
        phongRepository.save(phong);
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
                    Phong phong = new Phong();
                    int maQuanLy = (int) row.getCell(0).getNumericCellValue();
                    TaiKhoan taiKhoan = taiKhoanRepository.findById(maQuanLy).
                            orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+maQuanLy));
                    phong.setTaiKhoan(taiKhoan);
                    if(phongRepository.existsByTenPhongAndTrangThai(row.getCell(1).getStringCellValue(),TrangThai.hoatDong)){
                        throw new RoomAldreadyExist("phòng đã tồn tại: "+row.getCell(1).getStringCellValue());
                    }
                    phong.setTenPhong(row.getCell(1).getStringCellValue());
                    phong.setLoaiPhong(row.getCell(2).getStringCellValue());
                    phong.setDiaChi(row.getCell(3).getStringCellValue());
                    phong.setChieuDai(BigDecimal.valueOf(row.getCell(4).getNumericCellValue()));
                    phong.setChieuRong(BigDecimal.valueOf(row.getCell(5).getNumericCellValue()));
                    phong.setVatDung(row.getCell(6).getStringCellValue());
                    phong.setGiaThueCoBan(BigDecimal.valueOf(row.getCell(7).getNumericCellValue()));
                    phong.setTrangThai(TrangThai.valueOf(row.getCell(8).getStringCellValue()));
                    phongRepository.save(phong);
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
            Sheet sheet = workbook.createSheet("Phòng");
            Row header = sheet.createRow(0);
            String[] columns = {"Mã quản lý", "Tên phòng", "Loại phòng", "Địa chỉ", "Chiều dài",
                    "Chiều rộng", "Vật dụng", "Giá thuê cơ bản", "Trạng thái"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            List<Phong> phongList = phongRepository.findAll();
            int rowNum = 1;
            for (Phong phong : phongList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(phong.getTaiKhoan().getMaTaiKhoan());
                row.createCell(1).setCellValue(phong.getTenPhong());
                row.createCell(2).setCellValue(phong.getLoaiPhong());
                row.createCell(3).setCellValue(phong.getDiaChi());
                row.createCell(4).setCellValue(phong.getChieuDai().doubleValue());
                row.createCell(5).setCellValue(phong.getChieuRong().doubleValue());
                row.createCell(6).setCellValue(phong.getVatDung());
                row.createCell(7).setCellValue(phong.getGiaThueCoBan().doubleValue());
                row.createCell(8).setCellValue(phong.getTrangThai().name());
            }
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=phong.xlsx");
            workbook.write(response.getOutputStream());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất file Excel: " + e.getMessage(), e);
        }
    }

    @Override
    public List<RoomResponse> searchRoom(String tenPhong, String loaiPhong, String diaChi, BigDecimal chieuDai, BigDecimal chieuRong, String vatDung, BigDecimal giaThueCoBan) {
        return phongRepository.searchRoom(tenPhong,loaiPhong,diaChi,chieuDai,chieuRong,vatDung,giaThueCoBan)
                .stream().map(this::mapToRoomResponse).toList();
    }

    public RoomResponse mapToRoomResponse(Phong phong) {
        return new RoomResponse(phong.getMaPhong(),phong.getTaiKhoan().getHoTen(),phong.getTaiKhoan().getMaTaiKhoan(),
                phong.getTenPhong() ,phong.getLoaiPhong(), phong.getDiaChi(),phong.getChieuDai(),phong.getChieuRong()
                ,phong.getVatDung(),phong.getGiaThueCoBan(),phong.getTrangThai()
        );
    }
}
