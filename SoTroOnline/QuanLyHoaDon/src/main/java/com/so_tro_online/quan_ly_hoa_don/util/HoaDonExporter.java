package com.so_tro_online.quan_ly_hoa_don.util;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Optional;

/**
 * Class xuất hóa đơn ra file .pdf
 */
public class HoaDonExporter {

    // =============================
    // Repository (Static for static method usage)
    // =============================
    private static KhachThueRepository khachThueRepository;
    private static PhongRepository phongRepository;
    private static HoaDonRepository hoaDonRepository;
    private static TaiKhoanRepository taiKhoanRepository;

    public static void initializeRepositories(
            KhachThueRepository khachThueRepo,
            PhongRepository phongRepo,
            HoaDonRepository hoaDonRepo,
            TaiKhoanRepository taiKhoanRepo
    ) {
        khachThueRepository = khachThueRepo;
        phongRepository = phongRepo;
        hoaDonRepository = hoaDonRepo;
        taiKhoanRepository = taiKhoanRepo;
    }

    // =============================
    // Hàm hỗ trợ format BigDecimal
    // =============================
    public static long bigDecimalToCleanLong(BigDecimal value) {
        if (value == null) return 0L;
        return Long.parseLong(value.stripTrailingZeros().toPlainString());
    }

    /**
     * Xuất hóa đơn ra file PDF
     */
    public static void exportHoaDon(String filePath, Integer id) throws IOException {
        if (hoaDonRepository == null) {
            throw new IllegalStateException("Repositories not initialized. Call initializeRepositories() first.");
        }

        try {
            // Lấy dữ liệu từ repository
            Optional<HoaDon> hoaDonOpt = hoaDonRepository.findById(id);
            if (hoaDonOpt.isEmpty()) {
                return;
            }
            
            HoaDon hoaDonResponse = hoaDonOpt.get();
            
            // Get actual data from relationships
            String tenQuanLy = "QUẢN LÝ NHÀ TRỌ";
            String diaChiPhong = "Phòng: " + hoaDonResponse.getHopDongPhong().getPhong().getTenPhong();
            
            // Try to get tenant name from the contract
            String tenKhachThue = "Khách thuê";
            try {
                if (hoaDonResponse.getHopDongPhong() != null && 
                    hoaDonResponse.getHopDongPhong().getPhong() != null) {
                    diaChiPhong = "Phòng: " + hoaDonResponse.getHopDongPhong().getPhong().getTenPhong() +
                                  " - Địa chỉ: " + hoaDonResponse.getHopDongPhong().getPhong().getDiaChi();
                }
            } catch (Exception e) {
                // Use default if there's any issue
                diaChiPhong = "Phòng thuê";
            }

            // Create PDF document
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            // Define fonts
            Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL);
            Font moneyFont = new Font(Font.FontFamily.TIMES_ROMAN, 13, Font.BOLD, BaseColor.RED);

            // Title section
            addCenteredParagraph(document, tenQuanLy, headerFont);
            addCenteredParagraph(document, "HÓA ĐƠN", titleFont);
            addCenteredParagraph(document, diaChiPhong, normalFont);
            addCenteredParagraph(document, "Tháng " + hoaDonResponse.getThang() + " năm " + hoaDonResponse.getNam(), normalFont);
            
            document.add(Chunk.NEWLINE);

            // Basic information
            addSeparatorLine(document);
            addKeyValueParagraph(document, "Mã hóa đơn:", String.valueOf(hoaDonResponse.getMaHoaDon()), normalFont);
            addKeyValueParagraph(document, "Mã hợp đồng:", String.valueOf(hoaDonResponse.getHopDongPhong().getMaHopDongPhong()), normalFont);
            addKeyValueParagraph(document, "Tên Khách ĐD:", tenKhachThue, normalFont);
            addKeyValueParagraph(document, "Ngày tạo:", hoaDonResponse.getNgayTao().toString(), normalFont);

            // Money information
            addSeparatorLine(document);
            addMoneyParagraph(document, "Tiền phòng:", bigDecimalToCleanLong(hoaDonResponse.getTienPhong()), normalFont, moneyFont);
            addMoneyParagraph(document, "Tiền dịch vụ:", bigDecimalToCleanLong(hoaDonResponse.getTienDichVu()), normalFont, moneyFont);
            addMoneyParagraph(document, "Nợ cũ:", bigDecimalToCleanLong(hoaDonResponse.getTienConNo()), normalFont, moneyFont);
            addMoneyParagraph(document, "Tổng tiền:", bigDecimalToCleanLong(hoaDonResponse.getTongTien()), normalFont, moneyFont);

            // Notes
            addSeparatorLine(document);
            Font noteFont = new Font(Font.FontFamily.TIMES_ROMAN, 11, Font.ITALIC);
            Paragraph note = new Paragraph("Lưu ý: - Số tiền trên có thể bao gồm phí trọ, phí dịch vụ và tiền nợ theo quy định của nhà cung cấp. – " +
                    "Quý khách vui lòng kiểm tra và đóng phí đúng hạn để tránh bị đưa vào danh sách nợ xấu.", noteFont);
            note.setAlignment(Element.ALIGN_JUSTIFIED);
            document.add(note);

            document.close();
            System.out.println("✓ Xuất hóa đơn PDF thành công: " + filePath);

        } catch (DocumentException e) {
            throw new IOException("Lỗi khi tạo PDF: " + e.getMessage(), e);
        }
    }

    // ==================================================================
    // Các hàm hỗ trợ cho PDF
    // ==================================================================

    private static void addCenteredParagraph(Document document, String text, Font font) throws DocumentException {
        Paragraph paragraph = new Paragraph(text, font);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.setSpacingAfter(5f);
        document.add(paragraph);
    }

    private static void addKeyValueParagraph(Document document, String label, String value, Font font) throws DocumentException {
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Chunk(label + " ", font));
        if (value != null && !value.isEmpty()) {
            paragraph.add(new Chunk(value, font));
        }
        paragraph.setSpacingAfter(8f);
        document.add(paragraph);
    }

    private static void addMoneyParagraph(Document document, String label, long amount, Font labelFont, Font moneyFont) throws DocumentException {
        String moneyText = NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(amount);
        
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Chunk(label + " ", labelFont));
        paragraph.add(new Chunk(moneyText, moneyFont));
        paragraph.setSpacingAfter(10f);
        document.add(paragraph);
    }

    private static void addSeparatorLine(Document document) throws DocumentException {
        Paragraph separator = new Paragraph("_".repeat(50));
        separator.setAlignment(Element.ALIGN_CENTER);
        separator.setSpacingBefore(10f);
        separator.setSpacingAfter(10f);
        document.add(separator);
    }
}
