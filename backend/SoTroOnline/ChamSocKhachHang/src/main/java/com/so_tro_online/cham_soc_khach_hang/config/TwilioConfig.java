package com.so_tro_online.cham_soc_khach_hang.config;


import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {
    // retrieve the Twilio Account SID from application.properties
    @Value("${twilio.account-sid}")
    private String accountSid;

    // retrieve Twilio Auth token from application.properties
    @Value("${twilio.auth-token}")
    private String authToken;

    // retrieve the Twilio phone number from application.properties
    @Value("${twilio.phone-number}")
    public String phoneNumber;

    @PostConstruct
    void twilioInit() {
        Twilio.init(
                accountSid,
                authToken
        );
    }
}
