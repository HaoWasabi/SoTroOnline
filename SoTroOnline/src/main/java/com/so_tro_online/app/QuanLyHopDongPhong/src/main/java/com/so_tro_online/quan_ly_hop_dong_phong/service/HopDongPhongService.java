package com.so_tro_online.quan_ly_hop_dong_phong.service;

import com.deepoove.poi.XWPFTemplate;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongRequest;
import com.so_tro_online.quan_ly_hop_dong_phong.dto.HopDongPhongResponse;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.exception.HopDongAlreadyExists;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_khach_thue.entity.KhachThue;

import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phong.entity.Phong;
import com.so_tro_online.quan_ly_phong.entity.TrangThai;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.entity.TaiKhoan;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HopDongPhongService implements IHopDongPhongService {
    public HopDongPhongService(KhachThueRepository khachThueRepository, PhongRepository phongRepository, TaiKhoanRepository taiKhoanRepository, HopDongPhongRepository hopDongPhongRepository) {
        this.khachThueRepository = khachThueRepository;
        this.phongRepository = phongRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
    }
    private final SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
    private final KhachThueRepository khachThueRepository;
    private final PhongRepository phongRepository;
    private  final TaiKhoanRepository taiKhoanRepository;
    private final HopDongPhongRepository hopDongPhongRepository;
    @Override
    public List<HopDongPhongResponse> getAllHopDongPhong() {
        return hopDongPhongRepository.findAll().stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    @Override
    public List<HopDongPhongResponse> getAllHopDongPhongActive() {
        return hopDongPhongRepository.findByTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong).stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    private HopDongPhongResponse mapToHopDongPhongResponse(HopDongPhong hopDongPhong) {
       return new HopDongPhongResponse(hopDongPhong.getMaHopDongPhong(),
                hopDongPhong.getTaiKhoan().getMaTaiKhoan(),
                hopDongPhong.getTaiKhoan().getHoTen(),
                hopDongPhong.getKhachThue().getMaKhach(),
                hopDongPhong.getKhachThue().getHoTen(),
                hopDongPhong.getPhong().getMaPhong(),
                hopDongPhong.getPhong().getTenPhong(),
                hopDongPhong.getTienPhong(),
                hopDongPhong.getTienCoc(),
                hopDongPhong.getNgayBatDau(),
                hopDongPhong.getNgayKetThuc(),
                hopDongPhong.getNgayTao(),
                hopDongPhong.getTrangThai());
    }

    @Override
    public HopDongPhongResponse getHopDongPhongById(Integer id) {
        return hopDongPhongRepository.findById(id)
                .map(this::mapToHopDongPhongResponse)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: " + id));
    }

    @Override
    public HopDongPhongResponse getHopDongPhongActiveById(Integer id) {
        return hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .map(this::mapToHopDongPhongResponse)
                .orElseThrow(() -> new ReseourceNotFoundException("không tìm thấy hợp đồng phòng  với id: " + id));
    }

    @Override
    public HopDongPhongResponse createHopDongPhong(HopDongPhongRequest hopDongRequest) {
        TaiKhoan taiKhoan=taiKhoanRepository.findByMaTaiKhoanAndTrangThai(hopDongRequest.getMaTaiKhoan(), com.so_tro_online.quan_ly_tai_khoan.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy người dùng với id: "+hopDongRequest.getMaTaiKhoan()));
        Phong phong=phongRepository.findByMaPhongAndTrangThai(hopDongRequest.getMaPhong(), TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy phòng với id: "+hopDongRequest.getMaPhong()));
        KhachThue khachThue=khachThueRepository.findById(hopDongRequest.getMaKhachThue())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy khách hàng với id: "+hopDongRequest.getMaKhachThue()));
        if(hopDongPhongRepository.existsByPhongAndTrangThai(phong, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)){
            throw new HopDongAlreadyExists("phòng này đã được thuê");
        }
        HopDongPhong hopDongPhong=new HopDongPhong();
        hopDongPhong.setPhong(phong);
        hopDongPhong.setTaiKhoan(taiKhoan);
        hopDongPhong.setKhachThue(khachThue);
        hopDongPhong.setTienPhong(phong.getGiaThueCoBan());
        hopDongPhong.setTienCoc(hopDongRequest.getTienCoc());
        hopDongPhong.setNgayBatDau(hopDongRequest.getNgayBatDau());
        hopDongPhong.setNgayKetThuc(hopDongRequest.getNgayKetThuc());
        hopDongPhong.setTrangThai(hopDongRequest.getTrangThai());
        hopDongPhong.setNgayTao(new Date());
        return mapToHopDongPhongResponse(hopDongPhongRepository.save(hopDongPhong));
    }

    @Override
    public HopDongPhongResponse updateHopDongPhong(Integer id, HopDongPhongRequest roomRequest) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
        hopDongPhong.setTienPhong(roomRequest.getTienPhong());
        hopDongPhong.setTienCoc(roomRequest.getTienCoc());
        hopDongPhong.setNgayKetThuc(roomRequest.getNgayKetThuc());
        hopDongPhong.setTrangThai(roomRequest.getTrangThai());
        return mapToHopDongPhongResponse(hopDongPhongRepository.save(hopDongPhong));
    }

    @Override
    public void deleteHopDongPhong(Integer id) {
        HopDongPhong hopDongPhong=hopDongPhongRepository.findByMaHopDongPhongAndTrangThai(id, com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
        hopDongPhong.setTrangThai(com.so_tro_online.quan_ly_hop_dong_phong.entity.TrangThai.daXoa);
        hopDongPhongRepository.save(hopDongPhong);
    }

    @Override
    public List<HopDongPhongResponse> getAllHopDongPhongByMaKhachThue(Integer maKhachThue) {
        return hopDongPhongRepository.findByKhachThueMaKhach(maKhachThue).stream()
                .map(this::mapToHopDongPhongResponse)
                .toList();
    }

    @Override
    public void xuatHopDongWord(HttpServletResponse response, Integer id) {
            // 1. Lấy dữ liệu hợp đồng
            HopDongPhong hopDong = hopDongPhongRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

            // 2. Chuẩn bị dữ liệu cho template
            Map<String, Object> data = new HashMap<>();
            data.put("maHopDongPhong", hopDong.getMaHopDongPhong());
            data.put("tenQuanLy", hopDong.getTaiKhoan().getHoTen());
            data.put("soDienThoaiQuanLy",hopDong.getTaiKhoan().getDienThoai());
            data.put("diaChiQuanLy",hopDong.getTaiKhoan().getThuongTru());
            data.put("tenKhach", hopDong.getKhachThue().getHoTen());
            data.put("cccdKhach",hopDong.getTaiKhoan().getMaCanCuoc());
            data.put("diaChiKhach",hopDong.getKhachThue().getThuongTru());
            data.put("tenPhong", hopDong.getPhong().getTenPhong());
            data.put("diaChiPhong", hopDong.getPhong().getDiaChi());
            data.put("dienTichPhong", hopDong.getPhong().getChieuDai().multiply(hopDong.getPhong().getChieuRong()));
            data.put("tienPhong", hopDong.getTienPhong());
            data.put("tienCoc", hopDong.getTienCoc());
            data.put("ngayBatDau", df.format(hopDong.getNgayBatDau()));
            data.put("ngayKetThuc", df.format(hopDong.getNgayKetThuc()));
            data.put("ngayTao", df.format(hopDong.getNgayTao()));

            // 3. Nạp template Word
            try (var templateStream = getClass().getResourceAsStream("/templates/template-hopdong.docx");
                 var out = response.getOutputStream()) {

                if (templateStream == null) {
                    throw new IllegalStateException("Không tìm thấy file template-hopdong.docx trong resources/templates/");
                }

                XWPFTemplate template = XWPFTemplate.compile(templateStream).render(data);

                // 4. Thiết lập header tải file
                response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                response.setHeader("Content-Disposition", "attachment; filename=hop-dong-" + id + ".docx");

                // 5. Ghi trực tiếp ra response
                template.write(out);
                out.flush();
                template.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
    }

}
