package com.so_tro_online.quan_ly_hoa_don.batch;

import com.so_tro_online.quan_ly_dich_vu_phong.entity.DichVu;
import com.so_tro_online.quan_ly_dich_vu_phong.repository.DichVuRepository;
import com.so_tro_online.quan_ly_hoa_don.entity.ChiTietHoaDon;
import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;

import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.SuDungDichVu;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.entity.TrangThai;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.repository.SuDungDichVuRepository;
import com.so_tro_online.quan_ly_hop_dong_phong.entity.HopDongPhong;
import com.so_tro_online.quan_ly_phong.exception.ReseourceNotFoundException;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
public class HopDongPhongProcessor implements ItemProcessor<HopDongPhong, HoaDon> {
    private final SuDungDichVuRepository suDungRepo;
    private final DichVuRepository dichVuRepository;
    public HopDongPhongProcessor(SuDungDichVuRepository suDungRepo, DichVuRepository dichVuRepository) {
        this.suDungRepo = suDungRepo;
        this.dichVuRepository = dichVuRepository;
    }


//    @Override
//    public HoaDon process(HopDongPhong item) throws Exception {
//        LocalDate now = LocalDate.now();
//        LocalDate thangTruoc = now.minusMonths(1);
//        int thang = thangTruoc.getMonthValue();
//        int nam = thangTruoc.getYear();
//        BigDecimal tienPhong = item.getTienPhong();
//        BigDecimal tongDichVu = BigDecimal.ZERO;
//        List<ChiTietHoaDon> chiTietList = new ArrayList<>();
//        HoaDon hoaDon = new HoaDon();
//        hoaDon.setHopDongPhong(item);
//        hoaDon.setNgayTao(new Date());
//        hoaDon.setTienPhong(tienPhong);
//        // tính tiền phòng
//        ChiTietHoaDon ctPhong = new ChiTietHoaDon();
//        ctPhong.setHoaDon(hoaDon);
//        ctPhong.setTenDichVu("Tiền phòng");
//        ctPhong.setDonGia(tienPhong);
//        ctPhong.setSoLuong(BigDecimal.ONE);
//        ctPhong.setThanhTien(tienPhong);
//        chiTietList.add(ctPhong);
//        // tính tiền dịch vụ
//        List<MyHopDongDichVu> list = hopDongDichVuRepo.findByHopDongMaHopDongPhong(item.getMaHopDongPhong());
//        for (MyHopDongDichVu hdDv : list) {
//            DichVu dv = hdDv.getDichVu();
//            int soLuong = hdDv.getSoLuong() == null ? 1 : hdDv.getSoLuong();
//            BigDecimal thanhTien = BigDecimal.ZERO;
//            if (dv.getLoaiTinh()==LoaiTinh.THEO_THANG) {
//                // ví dụ: Wifi 100k/tháng, gửi xe 50k/chiếc/tháng * 2 xe
//                thanhTien = dv.getDonGiaCoBan().multiply(BigDecimal.valueOf(soLuong));
//            }
//            else if (dv.getLoaiTinh()== LoaiTinh.THEO_SO_LUONG) {
//                // ví dụ: Điện, Nước — tính theo chỉ số thực tế
//                SuDungDichVu suDung = suDungRepo.findByHopDongDichVuIdAndThangNam(hdDv.getId(), thang, nam);
//                if (suDung != null) {
//                    BigDecimal soLuongSuDung = suDung.getChiSoMoi().subtract(suDung.getChiSoCu());
//                    thanhTien = soLuongSuDung.multiply(dv.getDonGiaCoBan());
//                    soLuong = soLuongSuDung.intValue();
//                }
//            }
//            tongDichVu = tongDichVu.add(thanhTien);
//            ChiTietHoaDon ct = new ChiTietHoaDon();
//            ct.setHoaDon(hoaDon);
//            ct.setTenDichVu(dv.getTenDichVu());
//            ct.setDichVu(dv);
//            ct.setDonGia(dv.getDonGiaCoBan());
//            ct.setSoLuong(BigDecimal.valueOf(soLuong));
//            ct.setThanhTien(thanhTien);
//            chiTietList.add(ct);
//        }
//        hoaDon.setTienDichVu(tongDichVu);
//        hoaDon.setTongTien(tienPhong.add(tongDichVu));
//        hoaDon.setTienConNo(hoaDon.getTongTien());
//        hoaDon.setTrangThai(TrangThai.hoatDong);
//        hoaDon.setChiTietHoaDons(chiTietList);
//        return hoaDon;
//    }
@Override
public HoaDon process(HopDongPhong item) throws Exception {
    // Lấy tháng trước (hóa đơn cho tháng trước)
    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.MONTH, -1);
    int thang = cal.get(Calendar.MONTH) + 1; // Calendar.MONTH từ 0-11
    int nam = cal.get(Calendar.YEAR);

    // ====== TÍNH HỆ SỐ NGÀY Ở ======
    Calendar dauThang = Calendar.getInstance();
    dauThang.set(Calendar.YEAR, nam);
    dauThang.set(Calendar.MONTH, thang - 1);
    dauThang.set(Calendar.DAY_OF_MONTH, 1);

    Calendar cuoiThang = Calendar.getInstance();
    cuoiThang.set(Calendar.YEAR, nam);
    cuoiThang.set(Calendar.MONTH, thang - 1);
    cuoiThang.set(Calendar.DAY_OF_MONTH, cuoiThang.getActualMaximum(Calendar.DAY_OF_MONTH));

    Date ngayDauThang = dauThang.getTime();
    Date ngayCuoiThang = cuoiThang.getTime();

    // Ngày bắt đầu thực tế trong tháng
    Date ngayBatDauO = item.getNgayBatDau().after(ngayDauThang) ? item.getNgayBatDau() : ngayDauThang;
    Date ngayKetThucO = (item.getNgayKetThuc() != null && item.getNgayKetThuc().before(ngayCuoiThang))
            ? item.getNgayKetThuc() : ngayCuoiThang;

    // Số ngày ở thực tế trong tháng
    long soNgayO = (ngayKetThucO.getTime() - ngayBatDauO.getTime()) / (1000 * 60 * 60 * 24) + 1;
    long tongNgayThang = cuoiThang.getActualMaximum(Calendar.DAY_OF_MONTH);
    BigDecimal heSo = BigDecimal.valueOf((double) soNgayO / tongNgayThang);

    // ====== TIỀN PHÒNG ======
    BigDecimal tienPhong = item.getTienPhong().multiply(heSo).setScale(0, RoundingMode.HALF_UP);

    // ====== KHỞI TẠO HÓA ĐƠN ======
    BigDecimal tongDichVu = BigDecimal.ZERO;
    List<ChiTietHoaDon> chiTietList = new ArrayList<>();
    HoaDon hoaDon = new HoaDon();
    hoaDon.setHopDongPhong(item);
    hoaDon.setNgayTao(new Date());
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
    SuDungDichVu suDungDichVu=suDungRepo.findByPhongAndThangNam(item.getPhong().getMaPhong(),thang,nam, TrangThai.hoatDong)
            .orElseThrow(()->new ReseourceNotFoundException("phòng chưa được ghi chỉ số điện nước"));
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
    hoaDon.setNoiDung("Hoa don thang " + thang + "/" + nam);
    return hoaDon;
}

}
