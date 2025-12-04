package com.so_tro_online.quan_ly_hop_dong_phong.util;

import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

/**
 * Xuất hợp đồng thuê nhà theo mẫu chuẩn Việt Nam
 * Hoàn toàn tương thích với HopDongData hiện tại
 */
public class HopDongExporter {

    private static final NumberFormat VND = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
    private static final SimpleDateFormat DATE_FMT = new SimpleDateFormat("dd/MM/yyyy");
    private static final DateTimeFormatter LD_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Export contract to byte array for HTTP response
     */
    public static byte[] exportHopDongToBytes(HopDongData data) throws IOException {
        XWPFDocument document = new XWPFDocument();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            // ==================== QUỐC HIỆU ====================
            addCenteredBoldLine(document, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 13);
            addCenteredBoldUnderline(document, "Độc lập – Tự do – Hạnh phúc", 13);
            addEmptyParagraph(document, 300);

            // ==================== TIÊU ĐỀ ====================
            addCenteredBoldLine(document, "HỢP ĐỒNG THUÊ NHÀ", 16);
            addEmptyParagraph(document, 300);

            // Ngày ký hợp đồng
            String ngayKyText = data.ngayKy != null
                    ? "ngày " + data.ngayKy.format(DateTimeFormatter.ofPattern("dd 'tháng' MM 'năm' yyyy"))
                    : "..... ngày ..... tháng ..... năm ........";
            addLeftLine(document, "Hôm nay " + ngayKyText + ".", 12, false);
            addLeftLine(document, "Chúng tôi gồm:", 12, false);
            addEmptyParagraph(document, 200);

            // ==================== BÊN A (Chủ nhà) ====================
            addLeftBoldLine(document, "1.Đại diện bên cho thuê phòng trọ (Bên A):", 12);
            addLeftLine(document, "Ông/bà: " + nullToEmpty(data.benA.hoTen) +
                    "        Sinh ngày: " + formatDate(data.benA.ngaySinh), 12, false);
            addLeftLine(document, "Thường trú: " + nullToEmpty(data.benA.thuongTru), 12, false);
            addLeftLine(document, "CCCD/CMND số: " + nullToEmpty(data.benA.cccd) +
                    " cấp ngày …./…./……. tại:………………………...", 12, false);
            addLeftLine(document, "Số điện thoại: " + nullToEmpty(data.benA.dienThoai), 12, false);
            addEmptyParagraph(document, 150);

            // ==================== BÊN B (Khách thuê) ====================
            addLeftBoldLine(document, "2. Bên thuê phòng trọ (Bên B):", 12);
            addLeftLine(document, "Ông/bà: " + nullToEmpty(data.benB.hoTen) +
                    "        Sinh ngày: " + formatDate(data.benB.ngaySinh), 12, false);
            addLeftLine(document, "Thường trú: " + nullToEmpty(data.benB.thuongTru), 12, false);
            addLeftLine(document, "CCCD/CMND số: " + nullToEmpty(data.benB.cccd) +
                    " cấp ngày …./…./…….  tại:………………………...", 12, false);
            addLeftLine(document, "Số điện thoại: " + nullToEmpty(data.benB.dienThoai), 12, false);
            addEmptyParagraph(document, 200);

            // ==================== NỘI DUNG THUÊ ====================
            addLeftLine(document,
                    "Sau khi bàn bạc trên tinh thần dân chủ, hai bên cùng có lợi, cùng thống nhất như sau:", 12, false);
            addEmptyParagraph(document, 150);

            addLeftLine(document,
                    "Bên A đồng ý cho bên B thuê nhà ở tại địa chỉ: " + nullToEmpty(data.diaChiPhong) + ".", 12, true);
            addLeftLine(document, "Giá thuê: " + formatMoney(data.giaThue) + " đ/tháng.", 12, true);
            addLeftLine(document, "Hình thức thanh toán: Tiền mặt", 12, false);

//            addLeftLine(document, "Chi phí dịch vụ phải trả:", 12, false);
//            addLeftLine(document, "- Tiền điện " + formatMoney(data.donGiaDien)
//                    + " đ/kwh tính theo chỉ số công tơ, thanh toán vào cuối các tháng.", 12, false);
//            addLeftLine(document,
//                    "- Tiền nước: " + formatMoney(data.donGiaNuoc) + " đ/m³ thanh toán vào đầu các tháng.",
//                    12, false);

            if (data.dvRac)
                addLeftLine(document,
                        "- Tiền dọn rác: " + formatMoney(data.tienRac) + " đ thanh toán vào đầu các tháng.",
                        12, false);
            if (data.dvWifi)
                addLeftLine(document, "- Tiền wifi: " + formatMoney(data.tienWifi) + " đ thanh toán vào đầu các tháng.",
                        12, false);
            if (data.dvCap)
                addLeftLine(document, "- Tiền cáp: " + formatMoney(data.tienCap) + " đ thanh toán vào đầu các tháng.",
                        12,
                        false);
            if (data.dvKhac)
                addLeftLine(document,
                        "- Tiền dịch vụ khác: " + formatMoney(data.tienKhac) + " đ thanh toán vào đầu các tháng.", 12,
                        false);
            addEmptyParagraph(document, 600);

            addLeftLine(document, "Tiền đặt cọc: " + formatMoney(data.tienCoc) + ".", 12, true);
            addLeftLine(document, "Hợp đồng có giá trị kể từ ngày " + formatLocalDate(data.ngayBatDau) +
                    " đến ngày " + formatLocalDate(data.ngayKetThuc) + ".", 12, true);
            addEmptyParagraph(document, 300);

            // ==================== TRÁCH NHIỆM CÁC BÊN ====================
            addLeftBoldLine(document, "TRÁCH NHIỆM CÁC BÊN", 13);

            addLeftBoldLine(document, "* Trách nhiệm của bên A:", 12);
            addLeftLine(document, "- Tạo mọi điều kiện thuận lợi để bên B thực hiện theo hợp đồng.", 12, false);
            addLeftLine(document, "- Cung cấp các dịch vụ đã thỏa thuận cho bên B.", 12, false);
            addEmptyParagraph(document, 100);

            addLeftBoldLine(document, "* Trách nhiệm của bên B:", 12);
            addLeftLine(document, "- Thanh toán đầy đủ các khoản tiền theo đúng thỏa thuận.", 12, false);
            addLeftLine(document,
                    "- Bảo quản các trang thiết bị và cơ sở vật chất của bên A trang bị cho ban đầu (làm hỏng phải sửa, mất phải đền).",
                    12, false);
            addLeftLine(document,
                    "- Không được tự ý sửa chữa, cải tạo cơ sở vật chất khi chưa được sự đồng ý của bên A.", 12, false);
            addLeftLine(document, "- Giữ gìn vệ sinh trong và ngoài khuôn viên của phòng trọ.", 12, false);
            addLeftLine(document,
                    "- Bên B phải chấp hành mọi quy định của pháp luật Nhà nước và quy định của địa phương.", 12,
                    false);
            addLeftLine(document,
                    "- Nếu bên B cho khách ở qua đêm thì phải báo và được sự đồng ý của chủ nhà đồng thời phải chịu trách nhiệm về các hành vi vi phạm pháp luật của khách trong thời gian ở lại.",
                    12, false);
            addEmptyParagraph(document, 300);

            // ==================== TRÁCH NHIỆM CHUNG ====================
            addLeftBoldLine(document, "TRÁCH NHIỆM CHUNG", 13);
            addLeftLine(document, "- Hai bên phải tạo điều kiện cho nhau thực hiện hợp đồng.", 12, false);
            addLeftLine(document,
                    "- Trong thời gian hợp đồng còn hiệu lực nếu bên nào vi phạm các điều khoản đã thỏa thuận thì bên còn lại có quyền đơn phương chấm dứt hợp đồng; nếu sự vi phạm hợp đồng đó gây tổn thất cho bên bị vi phạm hợp đồng thì bên vi phạm hợp đồng phải bồi thường thiệt hại.",
                    12, false);
            addLeftLine(document,
                    "- Một trong hai bên muốn chấm dứt hợp đồng trước thời hạn thì phải báo trước cho bên kia ít nhất 30 ngày và hai bên phải có sự thống nhất.",
                    12, false);
            addLeftLine(document, "- Bên A phải trả lại tiền đặt cọc cho bên B.", 12, false);
            addLeftLine(document, "- Bên nào vi phạm điều khoản chung thì phải chịu trách nhiệm trước pháp luật.", 12,
                    false);
            addLeftLine(document, "- Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ một bản.",
                    12, false);

            // ==================== CHỮ KÝ ====================
            XWPFTable table = document.createTable(1, 2);
            table.setTableAlignment(TableRowAlign.CENTER);
            table.setWidth("100%");

            // Ẩn viền bảng (không hiển thị đường kẻ)
            if (table.getCTTbl().getTblPr() == null) {
                table.getCTTbl().addNewTblPr();
            }
            CTTblBorders tblBorders = table.getCTTbl().getTblPr().isSetTblBorders()
                    ? table.getCTTbl().getTblPr().getTblBorders()
                    : table.getCTTbl().getTblPr().addNewTblBorders();
            CTBorder noBorder = CTBorder.Factory.newInstance();
            noBorder.setVal(STBorder.Enum.forString("nil"));
            tblBorders.setTop(noBorder);
            tblBorders.setBottom(noBorder);
            tblBorders.setLeft(noBorder);
            tblBorders.setRight(noBorder);
            tblBorders.setInsideH(noBorder);
            tblBorders.setInsideV(noBorder);

            CTTblWidth width = table.getCTTbl().addNewTblPr().addNewTblW();
            width.setType(STTblWidth.DXA);
            width.setW(BigInteger.valueOf(9072)); // ~100% A4

            XWPFTableRow row = table.getRow(0);

            // Bên B (trái)
            XWPFTableCell cellB = row.getCell(0);
            cellB.setWidth("50%");
            XWPFParagraph pB = cellB.getParagraphArray(0);
            if (pB == null)
                pB = cellB.addParagraph();
            pB.setAlignment(ParagraphAlignment.CENTER);
            addRun(pB, "ĐẠI DIỆN BÊN B", 12, true);
            addEmptyParagraphInCell(cellB, 800); // khoảng trống cho ký tay

            // Bên A (phải)
            XWPFTableCell cellA = row.getCell(1);
            cellA.setWidth("50%");
            XWPFParagraph pA = cellA.getParagraphArray(0);
            if (pA == null)
                pA = cellA.addParagraph();
            pA.setAlignment(ParagraphAlignment.CENTER);
            addRun(pA, "ĐẠI DIỆN BÊN A", 12, true);
            addEmptyParagraphInCell(cellA, 800);

            // ==================== WRITE TO BYTE ARRAY ====================
            document.write(outputStream);
            return outputStream.toByteArray();

        } finally {
            document.close();
            outputStream.close();
        }
    }
    // ========================== HÀM HỖ TRỢ ==========================
    private static void addCenteredBoldLine(XWPFDocument doc, String text, int size) {
        XWPFParagraph p = doc.createParagraph();
        p.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setBold(true);
        r.setFontSize(size);
        r.setFontFamily("Times New Roman");
    }

    private static void addCenteredBoldUnderline(XWPFDocument doc, String text, int size) {
        XWPFParagraph p = doc.createParagraph();
        p.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setBold(true);
        r.setFontSize(size);
        r.setFontFamily("Times New Roman");
        r.setUnderline(UnderlinePatterns.SINGLE);
    }

    private static void addLeftLine(XWPFDocument doc, String text, int size, boolean bold) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(100);
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setFontSize(size);
        r.setBold(bold);
        r.setFontFamily("Times New Roman");
    }

    private static void addLeftBoldLine(XWPFDocument doc, String text, int size) {
        addLeftLine(doc, text, size, true);
    }

    private static void addEmptyParagraph(XWPFDocument doc, int spacingAfter) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(spacingAfter);
    }

    private static void addEmptyParagraphInCell(XWPFTableCell cell, int spacingAfter) {
        XWPFParagraph p = cell.addParagraph();
        p.setSpacingAfter(spacingAfter);
    }

    private static void addRun(XWPFParagraph p, String text, int size, boolean bold) {
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setFontSize(size);
        r.setBold(bold);
        r.setFontFamily("Times New Roman");
    }

    private static String formatMoney(long amount) {
        return VND.format(amount).replace("₫", "").trim();
    }

    private static String formatDate(Date date) {
        return date != null ? DATE_FMT.format(date) : "...../...../........";
    }

    private static String formatLocalDate(LocalDate date) {
        return date != null ? date.format(LD_FMT) : "...../...../........";
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}