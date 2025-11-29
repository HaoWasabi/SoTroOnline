package com.so_tro_online.quan_ly_hop_dong_phong.exception;

/**
 * Custom exception for email notification failures
 * This exception is thrown when email sending fails but should not prevent the main operation
 */
public class EmailNotificationException extends Exception {
    
    private final String contractId;
    private final String emailType;
    
    public EmailNotificationException(String message) {
        super(message);
        this.contractId = null;
        this.emailType = "unknown";
    }
    
    public EmailNotificationException(String message, Throwable cause) {
        super(message, cause);
        this.contractId = null;
        this.emailType = "unknown";
    }
    
    public EmailNotificationException(String message, String contractId) {
        super(message);
        this.contractId = contractId;
        this.emailType = "contract-notification";
    }
    
    public EmailNotificationException(String message, String contractId, String emailType) {
        super(message);
        this.contractId = contractId;
        this.emailType = emailType;
    }
    
    public EmailNotificationException(String message, String contractId, String emailType, Throwable cause) {
        super(message, cause);
        this.contractId = contractId;
        this.emailType = emailType;
    }
    
    public String getContractId() {
        return contractId;
    }
    
    public String getEmailType() {
        return emailType;
    }
    
    @Override
    public String toString() {
        return String.format("EmailNotificationException{contractId='%s', emailType='%s', message='%s'}", 
                           contractId, emailType, getMessage());
    }
}