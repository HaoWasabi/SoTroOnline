package com.so_tro_online.quan_ly_hop_dong_phong.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Email notification DTO for rent confirmation messages
 * This can be consumed by an email service to send actual emails
 */
public class RentConfirmationEmail {
    private Integer contractId;
    private String roomName;
    private String managerName;
    private String managerEmail;
    private List<String> tenantEmails;
    private List<String> tenantNames;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String subject;
    private String messageBody;

    public RentConfirmationEmail() {}

    public RentConfirmationEmail(Integer contractId, String roomName, String managerName, 
                               String managerEmail, List<String> tenantEmails, List<String> tenantNames,
                               BigDecimal rentAmount, BigDecimal depositAmount, 
                               LocalDate startDate, LocalDate endDate) {
        this.contractId = contractId;
        this.roomName = roomName;
        this.managerName = managerName;
        this.managerEmail = managerEmail;
        this.tenantEmails = tenantEmails;
        this.tenantNames = tenantNames;
        this.rentAmount = rentAmount;
        this.depositAmount = depositAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        
        // Generate default subject and message
        this.subject = "Xác nhận hợp đồng thuê phòng - " + roomName;
        this.messageBody = generateEmailBody();
    }

    private String generateEmailBody() {
        StringBuilder body = new StringBuilder();
        body.append("Kính chào quý khách,\n\n");
        body.append("Chúng tôi xin gửi thông tin xác nhận hợp đồng thuê phòng:\n\n");
        body.append("📋 THÔNG TIN HỢP ĐỒNG:\n");
        body.append("- Mã hợp đồng: ").append(contractId).append("\n");
        body.append("- Phòng: ").append(roomName).append("\n");
        body.append("- Khách thuê: ").append(String.join(", ", tenantNames)).append("\n");
        body.append("- Giá thuê: ").append(formatCurrency(rentAmount)).append(" VNĐ/tháng\n");
        body.append("- Tiền cọc: ").append(formatCurrency(depositAmount)).append(" VNĐ\n");
        body.append("- Ngày bắt đầu: ").append(startDate).append("\n");
        body.append("- Ngày kết thúc: ").append(endDate).append("\n\n");
        body.append("📞 LIÊN HỆ:\n");
        body.append("- Quản lý: ").append(managerName).append("\n");
        body.append("- Email: ").append(managerEmail).append("\n\n");
        body.append("Cảm ơn quý khách đã tin tương và lựa chọn dịch vụ của chúng tôi!\n\n");
        body.append("Trân trọng,\n");
        body.append("Ban quản lý SoTroOnline");
        
        return body.toString();
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0";
        return String.format("%,.0f", amount.doubleValue());
    }

    // Getters and setters
    public Integer getContractId() { return contractId; }
    public void setContractId(Integer contractId) { this.contractId = contractId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getManagerEmail() { return managerEmail; }
    public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }

    public List<String> getTenantEmails() { return tenantEmails; }
    public void setTenantEmails(List<String> tenantEmails) { this.tenantEmails = tenantEmails; }

    public List<String> getTenantNames() { return tenantNames; }
    public void setTenantNames(List<String> tenantNames) { this.tenantNames = tenantNames; }

    public BigDecimal getRentAmount() { return rentAmount; }
    public void setRentAmount(BigDecimal rentAmount) { this.rentAmount = rentAmount; }

    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessageBody() { return messageBody; }
    public void setMessageBody(String messageBody) { this.messageBody = messageBody; }
}