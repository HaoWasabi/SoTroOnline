package dto;

import java.math.BigDecimal; // dùng BigDecimal để tránh sai số khi tính toán tiền. 
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data   // Tự động sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor      // constructor rỗng
@AllArgsConstructor     // constructor đầy đủ tham số
public class ChiTietHoaDonDichVuDTO implements Serializable {
    private String maHoaDon;    // FK -> HoaDon
    private String maHopDongDichVu;    // FK -> DichVu
    private BigDecimal donGia;
    private String donVi;
    private int chiSoCu;
    private int chiSoMoi;
    private int soLuong;
    private BigDecimal thanhTien;
    private TrangThai trangThai;

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