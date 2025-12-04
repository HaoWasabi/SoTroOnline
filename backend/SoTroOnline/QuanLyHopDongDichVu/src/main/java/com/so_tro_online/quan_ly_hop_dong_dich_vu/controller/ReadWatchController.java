package com.so_tro_online.quan_ly_hop_dong_dich_vu.controller;


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.util.AskGemini;
import com.so_tro_online.quan_ly_hop_dong_dich_vu.util.MeterReadOptions;
import org.apache.commons.io.FileUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api")
public class ReadWatchController {

    @PostMapping(value = "/read-water-watch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> readWater(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "language", defaultValue = "vi") String language,
            @RequestParam(value = "confidenceThreshold", defaultValue = "0.5") double confidenceThreshold,
            @RequestParam(value = "includeNotes", defaultValue = "true") boolean includeNotes,
            @RequestParam(value = "imageDescription", required = false) String imageDescription) {
        return handleRead(file, "water", language, confidenceThreshold, includeNotes, imageDescription);
    }

    @PostMapping(value = "/read-electric-watch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> readElectric(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "language", defaultValue = "vi") String language,
            @RequestParam(value = "confidenceThreshold", defaultValue = "0.5") double confidenceThreshold,
            @RequestParam(value = "includeNotes", defaultValue = "true") boolean includeNotes,
            @RequestParam(value = "imageDescription", required = false) String imageDescription) {
        return handleRead(file, "electricity", language, confidenceThreshold, includeNotes, imageDescription);
    }

    private ResponseEntity<String> handleRead(MultipartFile file, String meterType, String language,
                                              double confidenceThreshold, boolean includeNotes, String imageDescription) {
        if (file == null || file.isEmpty()) {
            JsonObject err = new JsonObject();
            err.addProperty("error", "Missing or empty file parameter 'file'");
            return ResponseEntity.badRequest().body(err.toString());
        }

        File tmp = null;
        try {
            tmp = File.createTempFile("meter-upload-", ".tmp");
            FileUtils.writeByteArrayToFile(tmp, file.getBytes());

            MeterReadOptions options = MeterReadOptions.builder()
                    .withMeterType(meterType)
                    .withLanguage(language)
                    .withConfidenceThreshold(confidenceThreshold)
                    .withIncludeNotes(includeNotes)
                    .withImageDescription(imageDescription);

            String result = AskGemini.readMeter(tmp.getAbsolutePath(), options);

            try {
                JsonParser.parseString(result);
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(result);
            } catch (Exception ex) {
                JsonObject wrapped = new JsonObject();
                wrapped.addProperty("result", result);
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(wrapped.toString());
            }

        } catch (Exception e) {
            JsonObject err = new JsonObject();
            err.addProperty("error", "Failed to process file: " + e.getMessage());
            return ResponseEntity.status(500).body(err.toString());
        } finally {
            if (tmp != null && tmp.exists()) {
                try {
                    tmp.delete();
                } catch (Exception ignored) {
                }
            }
        }
    }
}
