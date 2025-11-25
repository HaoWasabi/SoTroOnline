package com.so_tro_online.quan_ly_phieu_thu.util;


import com.so_tro_online.quan_ly_phieu_thu.dto.*;

import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class PhieuThuExporter {
    // =============================
    // Hàm hỗ trợ format BigDecimal
    // =============================
    public static long bigDecimalToCleanLong(BigDecimal value) {
        if (value == null) return 0L;
        try {
            return value.longValue();
        } catch (Exception e) {
            return 0L;
        }
    }
    // =============================
    // Hàm hỗ trợ format LocalDate
    // =============================
    public static String formatDate(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd - MM - yyyy");
        return date.format(formatter);
    }


    /**
     * Xuất phiếu thu ra file DOCX
     *
     * @param filePath Đường dẫn file xuất (ví dụ: "D:/PhieuThu_202511.docx")
     * @param data     Dữ liệu phiếu thu đã được tổng hợp
     * @throws IOException Nếu có lỗi ghi file
     */
    public static void exportPhieuThu(String filePath, PhieuThuExportData data) throws IOException {
        XWPFDocument document = null;
        
        try {
            // Try to create document with enhanced error handling for POI version compatibility
            try {
                document = new XWPFDocument();
            } catch (NoSuchMethodError e) {
                // Specific error for POI/Commons IO version mismatch
                String errorMsg = String.format(
                    "POI version compatibility error. Current POI version appears to be incompatible with Commons IO. " +
                    "Expected: POI 5.3.0+ with Commons IO 2.16.1+. " +
                    "Found error: %s. " +
                    "Please run 'mvn clean compile' to refresh dependencies.",
                    e.getMessage()
                );
                throw new IOException(errorMsg, e);
            } catch (Exception e) {
                // Generic POI initialization error
                String errorMsg = String.format(
                    "Failed to initialize POI document. This may be due to version compatibility issues. " +
                    "Error: %s. " +
                    "Try running 'mvn clean compile' to refresh dependencies.",
                    e.getMessage()
                );
                throw new IOException(errorMsg, e);
            }

            // ================================================
            // 1. Tên nhà trọ (căn giữa, đậm, cỡ 14)
            // ================================================
            addCenteredLine(document, data.getTenChuTro(), 14, true);

            // ================================================
            // 2. Tiêu đề PHIẾU THU (to nhất, đậm, cỡ 18)
            // ================================================
            addCenteredLine(document, "PHIẾU THU", 18, true);
            // ================================================
            // 3. Địa chỉ nhà trọ (căn giữa)
            // ================================================
            addCenteredLine(document, data.getDiaChiPhong(), 12, false);
            addCenteredLine(document, "Tháng " + data.getThang() + " năm " + data.getNam(), 12, false);
            addEmptyLine(document, 400);

            // ================================================
            // 4. Thông tin chi tiết
            // ================================================
            addSeparator(document, "single", "A0A0A0", 4, 200, 200);
            addKeyValueLine(document, "Mã phiếu thu:", Integer.toString(data.getMaPhieuThu()));
            addKeyValueLine(document, "Mã hóa đơn:", Integer.toString(data.getMaHoaDon()));
            addKeyValueLine(document, "Mã khách ĐD:", Integer.toString(data.getMaKhachThue()));
            addKeyValueLine(document, "Tên Khách ĐD:", data.getTenKhachThue());
            addKeyValueLine(document, "Ngày tạo:", formatDate(data.getNgayThu()));

            // ================================================
            // 5. Tiền nợ & Đã trả (căn phải, đỏ, định dạng VND)
            // ================================================
            addSeparator(document, "single", "A0A0A0", 4, 200, 200);
            addMoneyLine(document, "Tiền nợ:", bigDecimalToCleanLong(data.getTongTienHoaDon()));
            addMoneyLine(document, "Đã trả:", bigDecimalToCleanLong(data.getSoTienThu()));
            // ================================================
            // 6. Lưu ý (nghiêng, căn đều hai bên)
            // ================================================
            addSeparator(document, "single", "A0A0A0", 4, 200, 200);
            XWPFParagraph note = document.createParagraph();
            note.setAlignment(ParagraphAlignment.BOTH);
            XWPFRun noteRun = note.createRun();
            noteRun.setText(
                    "Lưu ý: - Số tiền trên có thể bao gồm phí trọ, phí dịch vụ và tiền nợ theo quy định của nhà cung cấp. – "
                            +
                            "Quý khách vui lòng kiểm tra và đóng phí đúng hạn để đảm bảo không bị đưa vào danh sách nợ xấu theo quy định.");
            noteRun.setItalic(true);
            noteRun.setFontSize(11);
            noteRun.setFontFamily("Times New Roman");
            // ================================================
            // Ghi file
            // ================================================
            try (FileOutputStream out = new FileOutputStream(filePath)) {
                document.write(out);
                System.out.println("✓ Xuất phiếu thu thành công: " + filePath);
            }

        } finally {
            if (document != null) {
                document.close();
            }
        }
    }

    // ==================================================================
    // Các hàm hỗ trợ (đảm bảo font Times New Roman + tiếng Việt đẹp)
    // ==================================================================

    private static void addCenteredLine(XWPFDocument doc, String text, int fontSize, boolean bold) {
        XWPFParagraph p = doc.createParagraph();
        p.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setFontSize(fontSize);
        r.setBold(bold);
        r.setFontFamily("Times New Roman");
    }

    private static void addEmptyLine(XWPFDocument doc, int spacingAfter) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(spacingAfter);
    }

    private static void addKeyValueLine(XWPFDocument doc, String label, String value) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(120);

        XWPFRun rLabel = p.createRun();
        rLabel.setText(label + " ");
        rLabel.setFontSize(12);
        rLabel.setFontFamily("Times New Roman");

        if (value != null && !value.isEmpty()) {
            // Tạo tab stop để căn phải số tiền
            CTP ctp = p.getCTP();
            CTPPr pPr = ctp.isSetPPr() ? ctp.getPPr() : ctp.addNewPPr();
            CTTabs tabs = pPr.isSetTabs() ? pPr.getTabs() : pPr.addNewTabs();
            CTTabStop tabStop = tabs.addNewTab();
            tabStop.setVal(STTabJc.RIGHT);
            tabStop.setPos(BigInteger.valueOf(7300)); // gần mép phải A4

            XWPFRun rAmount = p.createRun();
            rAmount.setText("\t" + value);
            rAmount.setFontSize(12);
            rAmount.setFontFamily("Times New Roman");
        }
    }

    private static void addMoneyLine(XWPFDocument doc, String label, long amount) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(180);

        // Label
        XWPFRun rLabel = p.createRun();
        rLabel.setText(label + " ");
        rLabel.setFontSize(12);
        rLabel.setFontFamily("Times New Roman");

        // Định dạng tiền Việt Nam
        String moneyText = NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(amount);

        // Tạo tab stop để căn phải số tiền
        CTP ctp = p.getCTP();
        CTPPr pPr = ctp.isSetPPr() ? ctp.getPPr() : ctp.addNewPPr();
        CTTabs tabs = pPr.isSetTabs() ? pPr.getTabs() : pPr.addNewTabs();
        CTTabStop tabStop = tabs.addNewTab();
        tabStop.setVal(STTabJc.RIGHT);
        tabStop.setPos(BigInteger.valueOf(7300)); // gần mép phải A4

        // Số tiền (đỏ, đậm)
        XWPFRun rAmount = p.createRun();
        rAmount.setText("\t" + moneyText); // \t nhảy đến tab stop
        rAmount.setBold(true);
        rAmount.setFontSize(13);
        rAmount.setColor("FF0000"); // đỏ như mẫu
        rAmount.setFontFamily("Times New Roman");
    }

    /**
     * Kẻ separator (đường ngang) - HOÀN HẢO CHO POI 5.3.0+
     */
    private static void addSeparator(XWPFDocument doc,
                                     String lineStyle,
                                     String color,
                                     int thickness,
                                     int spacingBefore,
                                     int spacingAfter) {

        XWPFParagraph p = doc.createParagraph();
        p.setAlignment(ParagraphAlignment.CENTER);
        p.setSpacingBefore(spacingBefore);
        p.setSpacingAfter(spacingAfter);

        // Tạo run rỗng để giữ paragraph
        XWPFRun r = p.createRun();
        r.setText("");

        // === POI 5.x: Dùng setBorderBottom() trực tiếp với CTBorder ===
        CTBorder border = CTBorder.Factory.newInstance();

        // Set kiểu đường nét
        switch (lineStyle.toLowerCase()) {
            case "single" -> border.setVal(STBorder.Enum.forString("single"));
            case "double" -> border.setVal(STBorder.Enum.forString("double"));
            case "thick" -> border.setVal(STBorder.Enum.forString("thick"));
            case "dashed" -> border.setVal(STBorder.Enum.forString("dashed"));
            case "dotted" -> border.setVal(STBorder.Enum.forString("dotted"));
            default -> border.setVal(STBorder.Enum.forString("single"));
        }

        border.setSz(BigInteger.valueOf(thickness)); // độ dày (1/8 pt)
        border.setColor(color);
        border.setSpace(BigInteger.valueOf(1));

        // Áp dụng border dưới: cập nhật trực tiếp phần PBdr của CTP
        CTP ctpParagraph = p.getCTP();
        CTPPr pPrParagraph = ctpParagraph.isSetPPr() ? ctpParagraph.getPPr() : ctpParagraph.addNewPPr();
        CTPBdr pBdr = pPrParagraph.isSetPBdr() ? pPrParagraph.getPBdr() : pPrParagraph.addNewPBdr();
        pBdr.setBottom(border);
    }
}
