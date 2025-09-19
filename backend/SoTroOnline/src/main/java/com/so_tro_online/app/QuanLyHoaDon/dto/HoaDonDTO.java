package dto;

import java.math.BigDecimal; // dùng BigDecimal để tránh sai số khi tính toán tiền. 
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // Tự động sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // constructor rỗng
@AllArgsConstructor // constructor đầy đủ tham số
public class HoaDonDTO implements Serializable {
    private String maHoaDon;
    private String maHopDongPhong;
    private String maKhachDaiDien;
    private BigDecimal tienPhong;
    private BigDecimal tienNo;
    private BigDecimal tongTien;
    private Date thangNam;
    private Date ngayTao;
    private TrangThai trangThai;

    // Quan hệ 1-n
    private List<ChiTietHoaDonDichVuDTO> chiTietHoaDonDichVuList;
    private List<PhieuThuDTO> phieuThuList;

    public HoaDonDTO(String maHoaDon, String maHopDongPhong, String maKhachDaiDien, BigDecimal tienPhong,
            BigDecimal tienNo, BigDecimal tongTien, Date thangNam, Date ngayTao, TrangThai trangThai) {
        this.maHoaDon = maHoaDon;
        this.maHopDongPhong = maHopDongPhong;
        this.maKhachDaiDien = maKhachDaiDien;
        this.tienPhong = tienPhong;
        this.tienNo = tienNo;
        this.tongTien = tongTien;
        this.thangNam = thangNam;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }

    public static enum TrangThai {
        HOAT_DONG("hoatDong"),
        DA_HUY("daHuy");

        private String value;

        TrangThai(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}