package com.so_tro_online.quan_ly_hoa_don.service;

import com.deepoove.poi.XWPFTemplate;
import com.so_tro_online.quan_ly_hoa_don.dto.ChiTietHoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class HoaDonService implements IHoaDonService{
    private final HoaDonRepository hoaDonRepository;
    private final HopDongPhongRepository hopDongPhongRepository;
    public HoaDonService(HoaDonRepository hoaDonRepository, HopDongPhongRepository hopDongPhongRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
    }


    @Override
    public List<HoaDonResponse> getAllHoaDon() {
        return hoaDonRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public HoaDonResponse getHoaDonById(Integer id) {
        return hoaDonRepository.findById(id).map(this::mapToResponse)
                .orElseThrow(()->new RuntimeException("Không tìm thấy hóa đơn với id: "+id));
    }



    @Override
    public List<HoaDonResponse> getHoaDonByDate(Integer thang, Integer nam) {
        return hoaDonRepository.findByMonthAndYear(thang, nam).stream()
                .map(this::mapToResponse).toList();
    }

    @Override
    public List<HoaDonResponse> getAllByHopDong(Integer maHopDong) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findById(maHopDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng với mã"+maHopDong));
        return hoaDonRepository.findByHopDongPhong(hopDongPhong).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void xuatHoaDonByThangAndNam(HttpServletResponse response, Integer thang, Integer nam) throws IOException {
        List<HoaDon> hoaDons = hoaDonRepository.findByMonthAndYear(thang, nam);
        if (hoaDons.isEmpty()) {
            throw new RuntimeException("Không có hóa đơn nào trong tháng " + thang + "/" + nam);
        }

        // Thư mục tạm để lưu file Word
        File tempDir = Files.createTempDirectory("hoadon_tmp").toFile();

        for (HoaDon hoaDon : hoaDons) {
            Map<String, Object> data = new HashMap<>();
            data.put("maHoaDon", hoaDon.getMaHoaDon());
            data.put("tenKhach", hoaDon.getHopDongPhong().getKhachThue().getHoTen());
            data.put("tenPhong", hoaDon.getHopDongPhong().getPhong().getTenPhong());
            data.put("ngayLap", hoaDon.getNgayTao());
            data.put("tienPhong", hoaDon.getTienPhong());
            data.put("tienDichVu", hoaDon.getTienDichVu());
            data.put("tongTien", hoaDon.getTongTien());
            data.put("tienConNo", hoaDon.getTienConNo());
            List<Map<String, Object>> chiTietList = hoaDon.getChiTietHoaDons().stream()
                    .map(ct -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("tenDichVu", ct.getTenDichVu());
                        map.put("soLuong", ct.getSoLuong());
                        map.put("donGia", ct.getDonGia());
                        map.put("thanhTien", ct.getThanhTien());
                        return map;
                    })
                    .toList();
            data.put("chiTietHoaDons", chiTietList);


            try (XWPFTemplate template = XWPFTemplate.compile(
                            this.getClass().getResourceAsStream("/templates/hoadon_template.docx"))
                    .render(data)) {

                File outFile = new File(tempDir, "hoadon_" + hoaDon.getMaHoaDon() + ".docx");
                try (FileOutputStream out = new FileOutputStream(outFile)) {
                    template.write(out);
                }
            }
        }

        // Nén tất cả file thành zip
        File zipFile = new File(tempDir.getParent(), "hoadon_" + thang + "_" + nam + ".zip");
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
            for (File file : Objects.requireNonNull(tempDir.listFiles())) {
                try (FileInputStream fis = new FileInputStream(file)) {
                    ZipEntry entry = new ZipEntry(file.getName());
                    zos.putNextEntry(entry);
                    fis.transferTo(zos);
                    zos.closeEntry();
                }
            }
        }

        byte[] zipBytes = Files.readAllBytes(zipFile.toPath());

        // Xóa file tạm
        for (File f : Objects.requireNonNull(tempDir.listFiles())) f.delete();
        tempDir.delete();
        zipFile.deleteOnExit();
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=hoadon_" + thang + "_" + nam + ".zip");
        response.getOutputStream().write(zipBytes);
        response.getOutputStream().flush();


    }

    public HoaDonResponse mapToResponse(HoaDon hoaDon){
        HoaDonResponse response=new HoaDonResponse();
        response.setMaHoaDon(hoaDon.getMaHoaDon());
        response.setCapNhatLanCuoi(hoaDon.getCapNhatLanCuoi());
        response.setNgayTao(hoaDon.getNgayTao());
        response.setMaHopDongPhong(hoaDon.getHopDongPhong().getMaHopDongPhong());
        response.setMaPhong(hoaDon.getHopDongPhong().getPhong().getMaPhong());
        response.setNoiDung(hoaDon.getNoiDung());
        response.setTenPhong(hoaDon.getHopDongPhong().getPhong().getTenPhong());
        response.setTrangThai(hoaDon.getTrangThai());
        response.setTongTien(hoaDon.getTongTien());
        response.setTienConNo(hoaDon.getTienConNo());
        response.setCapNhatLanCuoi(hoaDon.getCapNhatLanCuoi());
        response.setTienDichVu(hoaDon.getTienDichVu());
        response.setTienPhong(hoaDon.getTienPhong());
        response.setChiTietHoaDons(mapToChiTietResponse(hoaDon));
        return response;
    }
    public List<ChiTietHoaDonResponse>mapToChiTietResponse(HoaDon hoaDon){
        return hoaDon.getChiTietHoaDons().stream()
                .map(chiTietHoaDon -> {
                    ChiTietHoaDonResponse response=new ChiTietHoaDonResponse();
                    response.setDonGia(chiTietHoaDon.getDonGia());
                    response.setId(chiTietHoaDon.getId());
                    response.setHeSo(chiTietHoaDon.getHeSo());
                    response.setMaHoaDon(chiTietHoaDon.getHoaDon().getMaHoaDon());
                    response.setSoLuong(chiTietHoaDon.getSoLuong());
                    response.setTenDichVu(chiTietHoaDon.getTenDichVu());
                    response.setThanhTien(chiTietHoaDon.getThanhTien());
                    response.setTienThucTe(chiTietHoaDon.getTienThucTe());
                    return response;
                }).toList();
    }
}
