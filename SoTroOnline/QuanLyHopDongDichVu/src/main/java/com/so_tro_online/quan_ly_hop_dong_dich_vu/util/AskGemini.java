package com.so_tro_online.quan_ly_hop_dong_dich_vu.util;


import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.*;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class AskGemini {
    private static final String GEMINI_API_KEY = System.getenv("GEMINI_API_KEY");
    private static final String MODEL = "gemini-2.5-flash";

    private static final int MAX_RETRIES = 12;
    private static final long INITIAL_RETRY_DELAY = 5000; // 5 seconds
    private static final long MAX_BACKOFF_MS = 30L * 60L * 1000L; // 30 minutes max backoff

    private static final OkHttpClient HTTP_CLIENT = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build();

    public static String readMeter(String imagePath) throws Exception {
        return readMeter(imagePath, MeterReadOptions.builder().withMeterType("water"));
    }

    public static String readMeter(String imagePath, MeterReadOptions options) throws Exception {
        File file = new File(imagePath);
        if (!file.exists()) {
            throw new Exception("File khong ton tai: " + file.getAbsolutePath());
        }

        if (file.length() > 20 * 1024 * 1024) {
            throw new Exception("File qua lon, toi da 20MB");
        }

        byte[] bytes = FileUtils.readFileToByteArray(file);
        String base64Image = Base64.getEncoder().encodeToString(bytes);

        String mimeType = getMimeType(imagePath);
        System.out.println("[DEBUG] Detected MIME type: " + mimeType);
        System.out.println("[DEBUG] File size: " + bytes.length + " bytes");
        System.out.println("[DEBUG] Meter type: " + options.getMeterType());
        System.out.println("[DEBUG] Language: " + options.getLanguage());

        String prompt = loadPromptTemplate(options, imagePath);

        Exception lastException = null;
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                if (attempt > 0) {
                    // compute backoff with exponential growth and jitter, capped by MAX_BACKOFF_MS
                    long baseDelay = INITIAL_RETRY_DELAY * (1L << (attempt - 1)); // 2^(attempt-1)
                    if (baseDelay < 0)
                        baseDelay = INITIAL_RETRY_DELAY; // overflow guard
                    long jitter = (long) (Math.random() * 2000L); // 0-2s jitter
                    long backoffDelay = baseDelay + jitter;
                    if (backoffDelay > MAX_BACKOFF_MS)
                        backoffDelay = MAX_BACKOFF_MS;
                    System.out.println("[DEBUG] Retry attempt " + attempt + " sleeping " + backoffDelay + "ms");
                    Thread.sleep(backoffDelay);
                }

                return executeGeminiRequest(base64Image, mimeType, prompt, options);
            } catch (ApiException ae) {
                lastException = ae;
                int status = ae.getStatusCode();

                // Retry on 429 (too many requests) and 503 (service unavailable)
                if (status == 429 || status == 503) {
                    // If server provided Retry-After, honor it
                    String retryAfter = ae.getRetryAfter();
                    if (retryAfter != null && !retryAfter.isEmpty()) {
                        try {
                            long delayMs = -1;
                            // Try parse as seconds
                            try {
                                long seconds = Long.parseLong(retryAfter.trim());
                                delayMs = seconds * 1000L;
                            } catch (NumberFormatException nfe) {
                                // ignore non-numeric Retry-After; we won't parse HTTP-date here
                            }
                            if (delayMs <= 0) {
                                delayMs = INITIAL_RETRY_DELAY;
                            }
                            if (delayMs > MAX_BACKOFF_MS)
                                delayMs = MAX_BACKOFF_MS;
                            System.out.println("[DEBUG] Server suggested Retry-After: " + retryAfter + "s → waiting "
                                    + delayMs + "ms");
                            Thread.sleep(delayMs);
                            continue;
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new Exception("Retry interrupted", ie);
                        }
                    }

                    if (attempt == MAX_RETRIES - 1) {
                        System.out.println("[ERROR] Max retries exceeded after status " + status);
                    }
                    // otherwise loop to next attempt (backoff done at loop head)
                    continue;
                }
                // Non-retryable API error
                throw ae;
            } catch (Exception e) {
                lastException = e;
                throw e;
            }
        }

        // If we get here after max retries on 503
        if (lastException != null) {
            throw lastException;
        }
        throw new Exception("Failed to read meter after " + MAX_RETRIES + " attempts");
    }

    private static String executeGeminiRequest(String base64Image, String mimeType, String prompt,
                                               MeterReadOptions options) throws Exception {
        JsonObject root = new JsonObject();
        JsonArray contentsArr = new JsonArray();
        JsonObject contentObj = new JsonObject();
        JsonArray parts = new JsonArray();
        parts.add(textPart(prompt));
        parts.add(imagePart(base64Image, mimeType));
        contentObj.add("parts", parts);
        contentsArr.add(contentObj);
        root.add("contents", contentsArr);

        try {
            System.out.println("[DEBUG] Sending request to Gemini API...");
            RequestBody body = RequestBody.create(
                    root.toString(),
                    MediaType.parse("application/json; charset=utf-8"));

            Request request = new Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1beta/models/"
                            + MODEL + ":generateContent?key=" + GEMINI_API_KEY)
                    .post(body)
                    .build();

            Response response = HTTP_CLIENT.newCall(request).execute();

            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                String retryAfter = null;
                if (response.headers() != null && response.headers().get("Retry-After") != null) {
                    retryAfter = response.headers().get("Retry-After");
                }
                throw new ApiException(response.code(), errorBody, retryAfter);
            }

            String responseText = response.body().string();
            System.out.println("[DEBUG] API Response: " + responseText);

            return extractTextFromResponse(responseText, options);

        } catch (Exception e) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            e.printStackTrace(new java.io.PrintStream(baos, true, StandardCharsets.UTF_8));
            String errorMsg = "Loi khi goi API Gemini:\n" + baos.toString(StandardCharsets.UTF_8);
            System.err.println(errorMsg);
            throw new Exception(errorMsg, e);
        }
    }

    private static String loadPromptTemplate(MeterReadOptions options, String imagePath) {
        String prompt = null;

        try (java.io.InputStream is = AskGemini.class.getClassLoader()
                .getResourceAsStream("prompt_template.st")) {
            if (is != null) {
                String template = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                // Extract template body between markers
                int start = template.indexOf("TEMPLATE BODY");
                int end = template.indexOf("END_OF_PROMPT");
                String body;
                if (start != -1 && end != -1 && end > start) {
                    int bodyStart = template.indexOf('\n', start);
                    body = template.substring(bodyStart + 1, end).trim();
                } else {
                    body = template.trim();
                }

                body = body.replace("{{language}}", options.getLanguage());
                body = body.replace("{{meter_type}}", options.getMeterType().toLowerCase());
                body = body.replace("{{unit}}", options.getUnit());
                body = body.replace("{{image_description}}", options.getImageDescription().isEmpty()
                        ? "File: " + imagePath
                        : options.getImageDescription());
                body = body.replace("{{example_only}}", "false");

                prompt = body;
            }
        } catch (Exception e) {
            System.err.println("[WARN] Không thể nạp template prompt: " + e.getMessage());
        }

        if (prompt == null || prompt.isEmpty()) {
            if ("water".equalsIgnoreCase(options.getMeterType())) {
                prompt = """
                        Hãy phân tích hình ảnh đồng hồ nước và chỉ xuất kết quả dưới dạng JSON, không kèm giải thích. Yêu cầu:
                        - "meter_type": "water"
                        - "unit": "m3"
                        - "reading": giá trị tổng số m³ (gồm cả phần thập phân)
                        - "integer_part": phần nguyên (từ các số nền đen)
                        - "decimal_part": phần thập phân dạng số (từ các số nền đỏ, ví dụ "056" → 0.056)
                        - "raw_digits": giữ nguyên chuỗi số đen và đỏ như trong ảnh
                        - "confidence": độ tin cậy từ 0.0 đến 1.0
                        - "notes": ghi chú nếu có (tùy chọn)
                        Chỉ trả về JSON hợp lệ, không thêm bất kỳ nội dung nào bên ngoài.
                        """;
            } else {
                prompt = """
                        Hãy phân tích hình ảnh đồng hồ điện và chỉ xuất kết quả dưới dạng JSON, không kèm giải thích. Yêu cầu:
                        - "meter_type": "electricity"
                        - "unit": "kWh"
                        - "reading": giá trị tổng số kWh (gồm cả phần thập phân nếu có)
                        - "integer_part": phần nguyên
                        - "decimal_part": phần thập phân (0 nếu không có)
                        - "raw_digits": giữ nguyên chuỗi số như trong ảnh
                        - "confidence": độ tin cậy từ 0.0 đến 1.0
                        - "notes": ghi chú nếu có (tùy chọn)
                        Chỉ trả về JSON hợp lệ, không thêm bất kỳ nội dung nào bên ngoài.
                        """;
            }
        }

        return prompt;
    }

    private static String getMimeType(String filePath) {
        String lower = filePath.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".gif")) {
            return "image/gif";
        } else if (lower.endsWith(".webp")) {
            return "image/webp";
        } else {
            return "image/jpeg";
        }
    }

    private static JsonObject textPart(String text) {
        JsonObject o = new JsonObject();
        o.addProperty("text", text);
        return o;
    }

    private static JsonObject imagePart(String base64, String mimeType) {
        JsonObject o = new JsonObject();
        JsonObject inlineData = new JsonObject();
        inlineData.addProperty("mimeType", mimeType);
        inlineData.addProperty("data", base64);
        o.add("inline_data", inlineData);
        return o;
    }

    private static String extractTextFromResponse(String res, MeterReadOptions options) {
        try {
            JsonObject response = JsonParser.parseString(res).getAsJsonObject();

            if (response.has("candidates") && response.get("candidates").isJsonArray()) {
                JsonArray candidates = response.getAsJsonArray("candidates");
                if (candidates.size() > 0) {
                    JsonObject candidate = candidates.get(0).getAsJsonObject();
                    if (candidate.has("content")) {
                        JsonObject content = candidate.getAsJsonObject("content");
                        if (content.has("parts") && content.get("parts").isJsonArray()) {
                            JsonArray parts = content.getAsJsonArray("parts");
                            if (parts.size() > 0) {
                                JsonObject part = parts.get(0).getAsJsonObject();
                                if (part.has("text")) {
                                    String text = part.get("text").getAsString();
                                    String jsonStr = text.trim();

                                    // Remove markdown code blocks if present
                                    if (jsonStr.startsWith("```json")) {
                                        jsonStr = jsonStr.substring(7);
                                    }
                                    if (jsonStr.startsWith("```")) {
                                        jsonStr = jsonStr.substring(3);
                                    }
                                    if (jsonStr.endsWith("```")) {
                                        jsonStr = jsonStr.substring(0, jsonStr.length() - 3);
                                    }
                                    jsonStr = jsonStr.trim();

                                    // Parse and validate JSON response
                                    JsonObject meterData = JsonParser.parseString(jsonStr).getAsJsonObject();

                                    if (meterData.has("confidence")) {
                                        double confidence = meterData.get("confidence").getAsDouble();
                                        if (confidence < options.getConfidenceThreshold()) {
                                            System.out.println("[WARN] Confidence " + confidence
                                                    + " below threshold " + options.getConfidenceThreshold());
                                        }
                                    }

                                    if (!options.isIncludeNotes() && meterData.has("notes")) {
                                        meterData.remove("notes");
                                    }

                                    System.out.println("[DEBUG] Parsed meter data: " + meterData.toString());
                                    return meterData.toString();
                                }
                            }
                        }
                    }
                }
            }

            return "{\"error\":\"Khong doc duoc\"}";
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to parse response: " + e.getMessage());
            e.printStackTrace();
            return "{\"error\":\"Khong doc duoc\"}";
        }
    }

    // Custom API exception carrying HTTP status and Retry-After header (if
    // provided)
    private static class ApiException extends Exception {
        private final int statusCode;
        private final String retryAfter;

        public ApiException(int statusCode, String message, String retryAfter) {
            super(message);
            this.statusCode = statusCode;
            this.retryAfter = retryAfter;
        }

        public int getStatusCode() {
            return statusCode;
        }

        public String getRetryAfter() {
            return retryAfter;
        }
    }

    public static void shutdown() {
        try {
            HTTP_CLIENT.dispatcher().executorService().shutdown();
            HTTP_CLIENT.dispatcher().executorService().awaitTermination(5, TimeUnit.SECONDS);
            HTTP_CLIENT.connectionPool().evictAll();
            System.out.println("[DEBUG] GeminiService shutdown completed");
        } catch (Exception e) {
            System.err.println("[ERROR] Error during shutdown: " + e.getMessage());
        }
    }
}
