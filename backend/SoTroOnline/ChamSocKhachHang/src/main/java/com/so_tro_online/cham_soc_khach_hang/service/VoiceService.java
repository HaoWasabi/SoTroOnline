package com.so_tro_online.cham_soc_khach_hang.service;


import com.so_tro_online.cham_soc_khach_hang.config.TwilioConfig;
import com.twilio.rest.api.v2010.account.Call;
import org.springframework.stereotype.Service;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Service
public class VoiceService  {

    private static final Logger logger = LoggerFactory.getLogger(VoiceService.class);
    private TwilioConfig twilioConfig;

    public VoiceService(
            TwilioConfig twilioConfig
    ) {
        this.twilioConfig = twilioConfig;
    }

    public String makePhoneCall(
           String recipientNumber
    ) {
        try {
            logger.info("Making phone call to: {}", recipientNumber);
            
            // Format the phone number to E.164 format for Vietnamese numbers
            String formattedNumber = formatPhoneNumber(recipientNumber);
            logger.info("Formatted phone number from {} to {}", recipientNumber, formattedNumber);
            
            // initialize the phone number objects
            // of the caller and recipient, respectively
            PhoneNumber to = new PhoneNumber(formattedNumber);
            PhoneNumber from = new PhoneNumber(twilioConfig.phoneNumber);
            
            logger.info("Calling from {} to {}", twilioConfig.phoneNumber, formattedNumber);

            // make a phone call to the specified "To" phone number
            // based on the TwiML instruction bin referenced by the URL
            Call call = Call.creator(
                    to,
                    from,
                    URI.create("https://handler.twilio.com/twiml/EHe615abdb09c3ab7c065de05dcba12a97")
            ).create();
            
            logger.info("Call created successfully with SID: {}", call.getSid());
            return call.getSid();
        } catch (Exception e) {
            logger.error("Failed to make phone call to {}: {}", recipientNumber, e.getMessage(), e);
            throw new RuntimeException("Failed to make phone call: " + e.getMessage(), e);
        }
    }

    /**
     * Format Vietnamese phone numbers to E.164 format
     * Examples:
     * 0723421441 -> +84723421441
     * 84723421441 -> +84723421441
     * +84723421441 -> +84723421441
     */
    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        
        // Remove any whitespace, dashes, or parentheses
        String cleaned = phoneNumber.replaceAll("[\\s\\-\\(\\)]", "");
        
        // If already starts with +, assume it's already formatted
        if (cleaned.startsWith("+")) {
            return cleaned;
        }
        
        // If starts with 84 (Vietnam country code), add +
        if (cleaned.startsWith("84") && cleaned.length() >= 10) {
            return "+" + cleaned;
        }
        
        // If starts with 0 (Vietnamese local format), replace with +84
        if (cleaned.startsWith("0") && cleaned.length() >= 10) {
            return "+84" + cleaned.substring(1);
        }
        
        // If it's just the number without leading 0 or 84, assume Vietnamese and add +84
        if (cleaned.length() >= 9 && cleaned.matches("\\d+")) {
            return "+84" + cleaned;
        }
        
        // If none of the above, try to add +84 prefix
        return "+84" + cleaned;
    }

    public Map<String, Object> getCallStatus(String callId) {
        try {
            Call call = Call.fetcher(callId).fetch();
            
            Map<String, Object> status = new HashMap<>();
            status.put("callId", callId);
            status.put("status", mapTwilioStatus(call.getStatus().toString()));
            
            if (call.getDuration() != null) {
                status.put("duration", call.getDuration());
            }
            
            return status;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get call status: " + e.getMessage(), e);
        }
    }

    public boolean terminateCall(String callId) {
        try {
            Call call = Call.updater(callId)
                    .setStatus(Call.UpdateStatus.COMPLETED)
                    .update();
            
            return call.getStatus() == Call.Status.COMPLETED;
        } catch (Exception e) {
            throw new RuntimeException("Failed to terminate call: " + e.getMessage(), e);
        }
    }

    private String mapTwilioStatus(String twilioStatus) {
        switch (twilioStatus.toLowerCase()) {
            case "queued":
            case "initiated":
                return "initiated";
            case "ringing":
                return "ringing";
            case "answered":
            case "in-progress":
                return "in-progress";
            case "completed":
                return "completed";
            case "failed":
                return "failed";
            case "busy":
                return "busy";
            case "no-answer":
                return "no-answer";
            default:
                return twilioStatus.toLowerCase();
        }
    }
}
