package com.so_tro_online.quan_ly_phieu_thu.util;

import com.so_tro_online.quan_ly_phieu_thu.dto.PhieuThuExportData;

import java.io.FileWriter;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * Fallback receipt exporter that creates a simple text file
 * when POI document generation fails
 * Updated to ensure proper compilation
 */
public class SimpleReceiptExporter {
    
    public static void exportReceiptAsText(String filePath, PhieuThuExportData data) throws IOException {
        // Change extension to .txt
        String textFilePath = filePath.replace(".docx", ".txt");
        
        try (FileWriter writer = new FileWriter(textFilePath)) {
            writer.write("=====================================\n");
            writer.write("           PHIẾU THU\n");
            writer.write("=====================================\n\n");
            
            writer.write("Nhà trọ: " + data.getTenChuTro() + "\n");
            writer.write("Địa chỉ: " + data.getDiaChiPhong() + "\n");
            writer.write("Tháng " + data.getThang() + " năm " + data.getNam() + "\n\n");
            
            writer.write("-------------------------------------\n");
            writer.write("THÔNG TIN CHI TIẾT\n");
            writer.write("-------------------------------------\n");
            writer.write("Mã phiếu thu: " + data.getMaPhieuThu() + "\n");
            writer.write("Mã hóa đơn: " + data.getMaHoaDon() + "\n");
            writer.write("Mã khách ĐD: " + data.getMaKhachThue() + "\n");
            writer.write("Tên khách ĐD: " + data.getTenKhachThue() + "\n");
            writer.write("Ngày tạo: " + PhieuThuExporter.formatDate(data.getNgayThu()) + "\n\n");
            
            writer.write("-------------------------------------\n");
            writer.write("THÔNG TIN THANH TOÁN\n");
            writer.write("-------------------------------------\n");
            
            NumberFormat vnFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            writer.write("Tiền nợ: " + vnFormat.format(PhieuThuExporter.bigDecimalToCleanLong(data.getTongTienHoaDon())) + "\n");
            writer.write("Đã trả: " + vnFormat.format(PhieuThuExporter.bigDecimalToCleanLong(data.getSoTienThu())) + "\n\n");
            
            writer.write("-------------------------------------\n");
            writer.write("LƯU Ý\n");
            writer.write("-------------------------------------\n");
            writer.write("Số tiền trên có thể bao gồm phí trọ, phí dịch vụ\n");
            writer.write("và tiền nợ theo quy định của nhà cung cấp.\n");
            writer.write("Quý khách vui lòng kiểm tra và đóng phí đúng hạn\n");
            writer.write("để đảm bảo không bị đưa vào danh sách nợ xấu\n");
            writer.write("theo quy định.\n\n");
            
            writer.write("=====================================\n");
            writer.write("Cảm ơn quý khách!\n");
            writer.write("=====================================\n");
        }
    }
}