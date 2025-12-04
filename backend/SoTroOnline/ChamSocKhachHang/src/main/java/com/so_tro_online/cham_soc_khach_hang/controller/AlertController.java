package com.so_tro_online.cham_soc_khach_hang.controller;

import com.so_tro_online.cham_soc_khach_hang.dto.PhoneCallBody;
import com.so_tro_online.cham_soc_khach_hang.service.VoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/voice")
public class AlertController {
    private VoiceService voiceService;

    public AlertController(
            VoiceService voiceService
    ) {
        this.voiceService = voiceService;
    }

    @PostMapping("/make-call")
    public ResponseEntity<Map<String, Object>> makePhoneCall(
           @RequestBody PhoneCallBody phoneCallBody
    ) {
        try {
            String callId = voiceService.makePhoneCall(phoneCallBody.getTo());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Phone call initiated successfully");
            
            Map<String, Object> data = new HashMap<>();
            data.put("callId", callId);
            data.put("callStatus", "initiated");
            data.put("to", phoneCallBody.getTo());
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to initiate phone call: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/status/{callId}")
    public ResponseEntity<Map<String, Object>> getCallStatus(
            @PathVariable String callId
    ) {
        try {
            Map<String, Object> callStatus = voiceService.getCallStatus(callId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Call status retrieved successfully");
            response.put("data", callStatus);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get call status: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/terminate/{callId}")
    public ResponseEntity<Map<String, Object>> terminateCall(
            @PathVariable String callId
    ) {
        try {
            boolean terminated = voiceService.terminateCall(callId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", terminated);
            response.put("message", terminated ? "Call terminated successfully" : "Failed to terminate call");
            
            Map<String, Object> data = new HashMap<>();
            data.put("callId", callId);
            data.put("status", "completed");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to terminate call: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
