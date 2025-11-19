package com.so_tro_online.quan_ly_hoa_don.service;


import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.data.RowRenderData;
import com.deepoove.poi.data.Rows;
import com.deepoove.poi.data.TableRenderData;
import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_hoa_don.dto.ChiTietHoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonRequest;
import com.so_tro_online.quan_ly_hoa_don.dto.HoaDonResponse;
import com.so_tro_online.quan_ly_hoa_don.entity.ChiTietHoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.SuDungDichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.SuDungDichVuRepository;

import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_hop_dong_phong.repository.HopDongPhongRepository;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai.hoatDong;

@Service
public class HoaDonService implements IHoaDonService{
    private final DichVuRepository dichVuRepository;
    private final SuDungDichVuRepository suDungRepo;
    private final HoaDonRepository hoaDonRepository;
    private final HopDongPhongRepository hopDongPhongRepository;

    public HoaDonService(DichVuRepository dichVuRepository, SuDungDichVuRepository suDungRepo, HoaDonRepository hoaDonRepository, HopDongPhongRepository hopDongPhongRepository) {
        this.dichVuRepository = dichVuRepository;
        this.suDungRepo = suDungRepo;
        this.hoaDonRepository = hoaDonRepository;
        this.hopDongPhongRepository = hopDongPhongRepository;
    }

    @Override
    public List<HoaDonResponse> getAllHoaDon() {
        return hoaDonRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<HoaDonResponse> getAllActiveHoaDon() {
        return hoaDonRepository.findAllActive().stream().map(this::mapToResponse).toList();
    }

    @Override
    public HoaDonResponse getHoaDonById(Integer id) {
        return hoaDonRepository.findById(id).map(this::mapToResponse)
                .orElseThrow(()->new RuntimeException("Không tìm thấy hóa đơn với id: "+id));
    }

    @Override
    public HoaDonResponse getActiveHoaDonById(Integer id) {
        return hoaDonRepository.findActiveByMaHoaDon(id).map(this::mapToResponse)
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
    public void printHoaDonByThangAndNam(HttpServletResponse response, Integer thang, Integer nam) throws IOException {
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
            // Chi tiết hóa đơn
            RowRenderData header = Rows.of("Tên dịch vụ", "Số lượng", "Đơn giá","Tiền thực tế","Hệ số","Thành tiền")
                    .center().textBold().create();

            List<RowRenderData> rows = hoaDon.getChiTietHoaDons().stream()
                    .map(ct -> Rows.create(
                            ct.getTenDichVu(),
                            String.valueOf(ct.getSoLuong()),
                            String.valueOf(ct.getDonGia()),
                            String.valueOf(ct.getTienThucTe()),
                            String.valueOf(ct.getHeSo()),
                            String.valueOf(ct.getThanhTien())
                    ))
                    .toList();


            TableRenderData table = new TableRenderData();
            table.addRow(header);
            for (RowRenderData row : rows) {
                table.addRow(row);
            }
            data.put("chiTietHoaDons", table);
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

    @Override
    public HoaDonResponse createHoaDon(HoaDonRequest request) {
        // Lấy hợp đồng theo id
        HopDongPhong hopDong = hopDongPhongRepository.findById(request.getMaHopDongPhong())
                .orElseThrow(() -> new ReseourceNotFoundException(
                        "Không tìm thấy hợp đồng với mã " + request.getMaHopDongPhong()));

        YearMonth ngayBatDauHD = YearMonth.of(hopDong.getNgayBatDau().getYear(), hopDong.getNgayBatDau().getMonth());
        YearMonth ngayKetThucHD = YearMonth.of(hopDong.getNgayKetThuc().getYear(), hopDong.getNgayKetThuc().getMonth());
        YearMonth ngayTaoHD = YearMonth.of(request.getNam(), request.getThang());

        // Kiểm tra hợp đồng có hoạt động trong tháng tạo hóa đơn
        if (!((ngayBatDauHD.isBefore(ngayTaoHD) || ngayBatDauHD.equals(ngayTaoHD)) &&
                (ngayKetThucHD.isAfter(ngayTaoHD) || ngayKetThucHD.equals(ngayTaoHD)))) {
            throw new RuntimeException(String.format("Hợp đồng %d không hoạt động trong tháng %d/%d",
                    hopDong.getMaHopDongPhong(), request.getThang(), request.getNam()));
        }

        // Kiểm tra hóa đơn đã tồn tại chưa
        if (hoaDonRepository.existsByHopDongPhongAndThangAndNam(hopDong, request.getThang(), request.getNam())) {
            throw new RuntimeException(String.format("Hóa đơn của hợp đồng %d trong tháng %d/%d đã tồn tại",
                    hopDong.getMaHopDongPhong(), request.getThang(), request.getNam()));
        }

        // Tính hệ số ngày ở thực tế
        YearMonth yearMonth = YearMonth.of(request.getNam(), request.getThang());
        LocalDate ngayDauThang = yearMonth.atDay(1);
        LocalDate ngayCuoiThang = yearMonth.atEndOfMonth();
        LocalDate ngayBatDauO = hopDong.getNgayBatDau().isAfter(ngayDauThang)
                ? hopDong.getNgayBatDau()
                : ngayDauThang;
        LocalDate ngayKetThucO = (hopDong.getNgayKetThuc() != null && hopDong.getNgayKetThuc().isBefore(ngayCuoiThang))
                ? hopDong.getNgayKetThuc()
                : ngayCuoiThang;

        long soNgayO = ChronoUnit.DAYS.between(ngayBatDauO, ngayKetThucO) + 1;
        long tongNgayThang = yearMonth.lengthOfMonth();

        BigDecimal heSo = BigDecimal.valueOf((double) soNgayO / tongNgayThang)
                .setScale(2, RoundingMode.HALF_UP);

        // Tiền phòng
        BigDecimal tienPhong = hopDong.getTienPhong().multiply(heSo).setScale(0, RoundingMode.HALF_UP);

        // Khởi tạo hóa đơn
        HoaDon hoaDon = new HoaDon();
        hoaDon.setHopDongPhong(hopDong);
        hoaDon.setNgayTao(LocalDate.now());
        hoaDon.setTienPhong(tienPhong);

        List<ChiTietHoaDon> chiTietList = new ArrayList<>();
        BigDecimal tongDichVu = BigDecimal.ZERO;

        // Chi tiết tiền phòng
        ChiTietHoaDon ctPhong = new ChiTietHoaDon();
        ctPhong.setHoaDon(hoaDon);
        ctPhong.setTenDichVu("Tiền phòng");
        ctPhong.setDonGia(hopDong.getTienPhong());
        ctPhong.setHeSo(heSo);
        ctPhong.setTienThucTe(tienPhong);
        ctPhong.setThanhTien(tienPhong);
        ctPhong.setSoLuong(1); // Integer
        chiTietList.add(ctPhong);

        // Lấy dịch vụ mặc định (rác, nước, điện)
        DichVu dichVu = dichVuRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Dich vu not found"));

        SuDungDichVu suDung = suDungRepo.findByPhongAndThangNam(
                hopDong.getPhong().getMaPhong(),
                request.getThang(),
                request.getNam(),
                hoatDong
        ).orElseThrow(() -> new ReseourceNotFoundException(
                String.format("Không tìm thấy chỉ số điện nước của phòng %d tháng %d năm %d",
                        hopDong.getPhong().getMaPhong(), request.getThang(), request.getNam())
        ));

        // Chi tiết tiền nước
        Integer soNuocDung = suDung.getChiSoNuocMoi() - suDung.getChiSoNuocCu();
        ChiTietHoaDon ctNuoc = new ChiTietHoaDon();
        ctNuoc.setHoaDon(hoaDon);
        ctNuoc.setTenDichVu("Tiền nước");
        ctNuoc.setDonGia(dichVu.getDonGiaNuoc());
        ctNuoc.setHeSo(BigDecimal.ONE);
        ctNuoc.setSoLuong(soNuocDung); // Integer
        ctNuoc.setTienThucTe(dichVu.getDonGiaNuoc().multiply(BigDecimal.valueOf(soNuocDung)));
        ctNuoc.setThanhTien(dichVu.getDonGiaNuoc().multiply(BigDecimal.valueOf(soNuocDung)));
        chiTietList.add(ctNuoc);

        // Chi tiết tiền điện
        Integer soDienDung = suDung.getChiSoDienMoi() - suDung.getChiSoDienCu();
        ChiTietHoaDon ctDien = new ChiTietHoaDon();
        ctDien.setHoaDon(hoaDon);
        ctDien.setTenDichVu("Tiền điện");
        ctDien.setDonGia(dichVu.getDonGiaDien());
        ctDien.setHeSo(BigDecimal.ONE);
        ctDien.setSoLuong(soDienDung);
        ctDien.setTienThucTe(dichVu.getDonGiaDien().multiply(BigDecimal.valueOf(soDienDung)));
        ctDien.setThanhTien(dichVu.getDonGiaDien().multiply(BigDecimal.valueOf(soDienDung)));
        chiTietList.add(ctDien);

        // Chi tiết tiền rác
        ChiTietHoaDon ctRac = new ChiTietHoaDon();
        ctRac.setHoaDon(hoaDon);
        ctRac.setTenDichVu("Tiền rác");
        ctRac.setDonGia(dichVu.getDonGiaRac());
        ctRac.setHeSo(heSo);
        ctRac.setTienThucTe(dichVu.getDonGiaRac());
        ctRac.setThanhTien(dichVu.getDonGiaRac().multiply(heSo).setScale(0, RoundingMode.HALF_UP));
        ctRac.setSoLuong(1);
        chiTietList.add(ctRac);

        // Chi tiết tiền wifi
        ChiTietHoaDon ctWifi = new ChiTietHoaDon();
        ctWifi.setHoaDon(hoaDon);
        ctWifi.setTenDichVu("Tiền wifi");
        ctWifi.setDonGia(dichVu.getDonGiaWifi());
        ctWifi.setHeSo(heSo);
        ctWifi.setTienThucTe(dichVu.getDonGiaWifi());
        ctWifi.setThanhTien(dichVu.getDonGiaWifi().multiply(heSo).setScale(0, RoundingMode.HALF_UP));
        ctWifi.setSoLuong(1);
        chiTietList.add(ctWifi);

        // Chi tiết tiền cáp
        ChiTietHoaDon ctCap = new ChiTietHoaDon();
        ctCap.setHoaDon(hoaDon);
        ctCap.setTenDichVu("Tiền Cáp");
        ctCap.setDonGia(dichVu.getDonGiaCap());
        ctCap.setHeSo(heSo);
        ctCap.setTienThucTe(dichVu.getDonGiaCap());
        ctCap.setThanhTien(dichVu.getDonGiaCap().multiply(heSo).setScale(0, RoundingMode.HALF_UP));
        ctCap.setSoLuong(1);
        chiTietList.add(ctCap);

        // Chi tiết tiền khác
        ChiTietHoaDon ctKhac = new ChiTietHoaDon();
        ctKhac.setHoaDon(hoaDon);
        ctKhac.setTenDichVu("Tiền Khác");
        ctKhac.setDonGia(dichVu.getDonGiaKhac());
        ctKhac.setHeSo(heSo);
        ctKhac.setTienThucTe(dichVu.getDonGiaKhac());
        ctKhac.setThanhTien(dichVu.getDonGiaKhac().multiply(heSo).setScale(0, RoundingMode.HALF_UP));
        ctKhac.setSoLuong(1);
        chiTietList.add(ctKhac);

        // Tính tổng dịch vụ
        tongDichVu = ctDien.getThanhTien()
                .add(ctNuoc.getThanhTien())
                .add(ctRac.getThanhTien());
                //.add(ctWifi.getThanhTien())
                //.add(ctCap.getThanhTien())
                //.add(ctKhac.getThanhTien());

        // Hoàn thiện hóa đơn
        hoaDon.setChiTietHoaDons(chiTietList);
        hoaDon.setTienDichVu(tongDichVu);
        hoaDon.setTongTien(tienPhong.add(tongDichVu));
        hoaDon.setTienConNo(hoaDon.getTongTien());
        hoaDon.setTrangThai(com.so_tro_online.quan_ly_hoa_don.entity.TrangThai.CON_NO);
        hoaDon.setNoiDung("Hoa don thang " + request.getThang() + "/" + request.getNam());
        hoaDon.setThang(request.getThang());
        hoaDon.setNam(request.getNam());

        return mapToResponse(hoaDonRepository.save(hoaDon));
    }

    @Override
    public void deleteHoaDon(Integer id) {
        HoaDon hoaDon=hoaDonRepository.findActiveByMaHoaDon(id)
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng phòng với id: "+id));
        hoaDon.setTrangThai(com.so_tro_online.quan_ly_hoa_don.entity.TrangThai.DA_XOA);
        hoaDonRepository.save(hoaDon);
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
        response.setThang(hoaDon.getThang());
        response.setNam(hoaDon.getNam());
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