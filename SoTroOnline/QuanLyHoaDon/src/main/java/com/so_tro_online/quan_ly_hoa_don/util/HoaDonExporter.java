package com.so_tro_online.quan_ly_hoa_don.util;

import com.so_tro_online.quan_ly_hoa_don.entity.HoaDon;
import com.so_tro_online.quan_ly_hoa_don.repository.HoaDonRepository;
import com.so_tro_online.quan_ly_khach_thue.repository.KhachThueRepository;
import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
import com.so_tro_online.quan_ly_tai_khoan.repository.TaiKhoanRepository;

import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Optional;

/**
 * Class xuất hóa đơn ra file .docx
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
     * Xuất hóa đơn ra file DOCX
     */
    public static void exportHoaDon(String filePath, Integer id) throws IOException {
        if (hoaDonRepository == null) {
            throw new IllegalStateException("Repositories not initialized. Call initializeRepositories() first.");
        }

        XWPFDocument document = new XWPFDocument();

        try {
            // Lấy dữ liệu từ repository
            Optional<HoaDon> hoaDonOpt = hoaDonRepository.findById(id);
            if (hoaDonOpt.isEmpty()) {
                return;
            }
            
            HoaDon hoaDonResponse = hoaDonOpt.get();
            
            // Note: These would need to be implemented properly based on your actual service layer
            // For now, using placeholder data
            String tenQuanLy = "Quản lý nhà trọ";
            String diaChiPhong = "Địa chỉ phòng";
            String tenKhachThue = "Tên khách thuê";

            // ================================================
            addCenteredLine(document, tenQuanLy, 14, true);
            addCenteredLine(document, "HÓA ĐƠN", 18, true);
            addCenteredLine(document, diaChiPhong, 12, false);
            addCenteredLine(document,
                    "Tháng " + hoaDonResponse.getThang() + " năm " + hoaDonResponse.getNam(),
                    12, false);

            addEmptyLine(document, 400);

            // Thông tin cơ bản
            addSeparator(document, "single", "A0A0A0", 4, 200, 200);
            addKeyValueLine(document, "Mã hóa đơn:", String.valueOf(hoaDonResponse.getMaHoaDon()));
            addKeyValueLine(document, "Mã hợp đồng:", String.valueOf(hoaDonResponse.getHopDongPhong().getMaHopDongPhong()));
            addKeyValueLine(document, "Tên Khách ĐD:", tenKhachThue);
            addKeyValueLine(document, "Ngày tạo:", hoaDonResponse.getNgayTao().toString());

            // Tiền
            addSeparator(document, "single", "A0A0A0", 4, 200, 200);
            addMoneyLine(document, "Tiền phòng:", bigDecimalToCleanLong(hoaDonResponse.getTienPhong()));
            addMoneyLine(document, "Tiền dịch vụ:", bigDecimalToCleanLong(hoaDonResponse.getTienDichVu()));
            addMoneyLine(document, "Nợ cũ:", bigDecimalToCleanLong(hoaDonResponse.getTienConNo()));
            addMoneyLine(document, "Tổng tiền:", bigDecimalToCleanLong(hoaDonResponse.getTongTien()));

            // Lưu ý
            addSeparator(document, "single", "A0A0A0", 4, 200, 200);
            XWPFParagraph note = document.createParagraph();
            note.setAlignment(ParagraphAlignment.BOTH);
            XWPFRun noteRun = note.createRun();
            noteRun.setText(
                    "Lưu ý: - Số tiền trên có thể bao gồm phí trọ, phí dịch vụ và tiền nợ theo quy định của nhà cung cấp. – "
                            + "Quý khách vui lòng kiểm tra và đóng phí đúng hạn để tránh bị đưa vào danh sách nợ xấu.");
            noteRun.setItalic(true);
            noteRun.setFontSize(11);
            noteRun.setFontFamily("Times New Roman");

            // Ghi file
            try (FileOutputStream out = new FileOutputStream(filePath)) {
                document.write(out);
                System.out.println("✓ Xuất hóa đơn thành công: " + filePath);
            }

        } finally {
            document.close();
        }
    }

    // ==================================================================
    // Các hàm hỗ trợ
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
            CTP ctp = p.getCTP();
            CTPPr pPr = ctp.isSetPPr() ? ctp.getPPr() : ctp.addNewPPr();
            CTTabs tabs = pPr.isSetTabs() ? pPr.getTabs() : pPr.addNewTabs();
            CTTabStop tabStop = tabs.addNewTab();
            tabStop.setVal(STTabJc.RIGHT);
            tabStop.setPos(BigInteger.valueOf(7300));

            XWPFRun rAmount = p.createRun();
            rAmount.setText("\t" + value);
            rAmount.setFontSize(12);
            rAmount.setFontFamily("Times New Roman");
        }
    }

    private static void addMoneyLine(XWPFDocument doc, String label, long amount) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(180);

        XWPFRun rLabel = p.createRun();
        rLabel.setText(label + " ");
        rLabel.setFontSize(12);
        rLabel.setFontFamily("Times New Roman");

        String moneyText = NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(amount);

        CTP ctp = p.getCTP();
        CTPPr pPr = ctp.isSetPPr() ? ctp.getPPr() : ctp.addNewPPr();
        CTTabs tabs = pPr.isSetTabs() ? pPr.getTabs() : pPr.addNewTabs();
        CTTabStop tabStop = tabs.addNewTab();
        tabStop.setVal(STTabJc.RIGHT);
        tabStop.setPos(BigInteger.valueOf(7300));

        XWPFRun rAmount = p.createRun();
        rAmount.setText("\t" + moneyText);
        rAmount.setBold(true);
        rAmount.setFontSize(13);
        rAmount.setColor("FF0000");
        rAmount.setFontFamily("Times New Roman");
    }

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

        XWPFRun r = p.createRun();
        r.setText("");

        CTBorder border = CTBorder.Factory.newInstance();

        switch (lineStyle.toLowerCase()) {
            case "double" -> border.setVal(STBorder.DOUBLE);
            case "thick" -> border.setVal(STBorder.THICK);
            case "dashed" -> border.setVal(STBorder.DASHED);
            case "dotted" -> border.setVal(STBorder.DOTTED);
            default -> border.setVal(STBorder.SINGLE);
        }

        border.setSz(BigInteger.valueOf(thickness));
        border.setColor(color);
        border.setSpace(BigInteger.valueOf(1));

        CTP ctpParagraph = p.getCTP();
        CTPPr pPrParagraph = ctpParagraph.isSetPPr() ? ctpParagraph.getPPr() : ctpParagraph.addNewPPr();
        CTPBdr pBdr = pPrParagraph.isSetPBdr() ? pPrParagraph.getPBdr() : pPrParagraph.addNewPBdr();
        pBdr.setBottom(border);
    }
}
