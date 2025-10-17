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
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;
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
import java.time.Year;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
        HopDongPhong item=hopDongPhongRepository.findById(request.getMaHopDongPhong())
                .orElseThrow(()->new ReseourceNotFoundException("không tìm thấy hợp đồng với mã"+request.getMaHopDongPhong()));
        YearMonth ngayBatDau=YearMonth.of(item.getNgayBatDau().getYear(),item.getNgayBatDau().getMonth());
        YearMonth ngayKetThuc= YearMonth.of(item.getNgayKetThuc().getYear(),item.getNgayKetThuc().getMonth());
        YearMonth ngayTaoHoaDon=YearMonth.of(request.getNam(),request.getThang());
        if(
                !((ngayBatDau.isBefore(ngayTaoHoaDon) || ngayBatDau.equals(ngayTaoHoaDon)) &&
                (ngayKetThuc.isAfter(ngayTaoHoaDon) || ngayKetThuc.equals(ngayTaoHoaDon)))
        ){
            throw new RuntimeException(String.format("Hợp đồng %d không hoạt động trong tháng %d/%d",
                    item.getMaHopDongPhong(),request.getThang(),request.getNam()));
        }
        if(hoaDonRepository.existsByHopDongPhongAndThangAndNam(item,request.getThang(),request.getNam())){
            throw new RuntimeException(String.format("Hóa đơn của hợp đồng %d trong tháng %d/%d đã tồn tại",
                    item.getMaHopDongPhong(),request.getThang(),request.getNam()));
        }
         // TÍNH NGÀY ĐẦU & CUỐI THÁNG
        YearMonth yearMonth = YearMonth.of(request.getNam(),request.getThang());
        LocalDate ngayDauThang = yearMonth.atDay(1);
        LocalDate ngayCuoiThang = yearMonth.atEndOfMonth();

        // TÍNH HỆ SỐ NGÀY Ở
        LocalDate ngayBatDauO = item.getNgayBatDau().isAfter(ngayDauThang)
                ? item.getNgayBatDau()
                : ngayDauThang;

        LocalDate ngayKetThucO = (item.getNgayKetThuc() != null && item.getNgayKetThuc().isBefore(ngayCuoiThang))
                ? item.getNgayKetThuc()
                : ngayCuoiThang;

        // Số ngày ở thực tế trong tháng (cộng thêm 1 để tính cả ngày cuối)
        long soNgayO = ChronoUnit.DAYS.between(ngayBatDauO, ngayKetThucO) + 1;
        long tongNgayThang = yearMonth.lengthOfMonth();

        BigDecimal heSo = BigDecimal.valueOf((double) soNgayO / tongNgayThang)
                .setScale(2, RoundingMode.HALF_UP);

        // ====== TIỀN PHÒNG ======
        BigDecimal tienPhong = item.getTienPhong().multiply(heSo).setScale(0, RoundingMode.HALF_UP);

        // ====== KHỞI TẠO HÓA ĐƠN ======
        BigDecimal tongDichVu = BigDecimal.ZERO;
        List<ChiTietHoaDon> chiTietList = new ArrayList<>();
        HoaDon hoaDon = new HoaDon();
        hoaDon.setHopDongPhong(item);
        hoaDon.setNgayTao(LocalDate.now());
        hoaDon.setTienPhong(tienPhong);

        // Chi tiết tiền phòng
        ChiTietHoaDon ctPhong = new ChiTietHoaDon();
        ctPhong.setHoaDon(hoaDon);
        ctPhong.setTenDichVu("Tiền phòng");
        ctPhong.setDonGia(item.getTienPhong());
        ctPhong.setHeSo(heSo);
        ctPhong.setTienThucTe(item.getTienPhong());
        ctPhong.setThanhTien(tienPhong);
        ctPhong.setSoLuong(BigDecimal.ONE);
        chiTietList.add(ctPhong);
        SuDungDichVu suDungDichVu=suDungRepo.findByPhongAndThangNam(item.getPhong().getMaPhong(),request.getThang(),request.getNam(), TrangThai.hoatDong)
                .orElseThrow(()->new ReseourceNotFoundException(String.format("Không tìm thấy chỉ số điện nước của phong %d thang %d nam %d",item.getPhong().getMaPhong(),request.getThang(),request.getNam())));
        DichVu dichVu=dichVuRepository.findById(1).orElseThrow(()->new RuntimeException("Dich vu not found"));
        // tien rac
        ChiTietHoaDon ctRac = new ChiTietHoaDon();
        ctRac.setHoaDon(hoaDon);
        ctRac.setTenDichVu("Tiền rác");
        ctRac.setHeSo(heSo);
        ctRac.setDonGia(dichVu.getDonGiaRac());
        ctRac.setSoLuong(BigDecimal.ONE);
        ctRac.setTienThucTe(dichVu.getDonGiaRac());
        ctRac.setThanhTien(dichVu.getDonGiaRac().multiply(heSo).setScale(0, RoundingMode.HALF_UP));
        chiTietList.add(ctRac);
        // tien nuoc
        ChiTietHoaDon ctNuoc = new ChiTietHoaDon();
        ctNuoc.setHoaDon(hoaDon);
        ctNuoc.setTenDichVu("Tiền nước");
        ctNuoc.setHeSo(BigDecimal.ONE);
        ctNuoc.setDonGia(dichVu.getDonGiaNuoc());
        BigDecimal soNuocDung=suDungDichVu.getChiSoNuocMoi().subtract(suDungDichVu.getChiSoNuocCu());
        ctNuoc.setSoLuong(soNuocDung);
        ctNuoc.setThanhTien(soNuocDung.multiply(dichVu.getDonGiaNuoc()));
        ctNuoc.setTienThucTe(soNuocDung.multiply(dichVu.getDonGiaNuoc()));
        chiTietList.add(ctNuoc);
        // tien dien
        ChiTietHoaDon ctDien = new ChiTietHoaDon();
        ctDien.setHoaDon(hoaDon);
        ctDien.setTenDichVu("Tiền điện");
        ctDien.setHeSo(BigDecimal.ONE);
        ctDien.setDonGia(dichVu.getDonGiaDien());
        BigDecimal soDienDung=suDungDichVu.getChiSoDienMoi().subtract(suDungDichVu.getChiSoDienCu());
        ctDien.setThanhTien(soDienDung.multiply(dichVu.getDonGiaDien()));
        ctDien.setTienThucTe(soDienDung.multiply(dichVu.getDonGiaDien()));
        ctDien.setSoLuong(soDienDung);
        chiTietList.add(ctDien);
        tongDichVu=tongDichVu.add(ctRac.getThanhTien()).add(ctNuoc.getThanhTien()).add(ctDien.getThanhTien());

        hoaDon.setTienDichVu(tongDichVu);
        hoaDon.setTongTien(tienPhong.add(tongDichVu));
        hoaDon.setTienConNo(hoaDon.getTongTien());
        hoaDon.setTrangThai(com.so_tro_online.quan_ly_hoa_don.entity.TrangThai.CON_NO);
        hoaDon.setChiTietHoaDons(chiTietList);
        hoaDon.setHopDongPhong(item);
        hoaDon.setNoiDung("Hoa don thang " + request.getThang() + "/" + request.getNam());
        hoaDon.setThang(request.getThang());
        hoaDon.setNam(request.getNam());
        return mapToResponse(hoaDonRepository.save(hoaDon));
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
