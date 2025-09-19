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
public class PhieuThuDTO implements Serializable {
    private String maPhieuThu;    // FK -> HoaDon
    private String maHoaDon;    // FK -> HoaDon
    private String maKhachDaiDien;    // FK -> KhachDaiDien
    private BigDecimal tienNo;
    private BigDecimal tienDaThu;
    private String ghiChu;
    private Date ngayTao;
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