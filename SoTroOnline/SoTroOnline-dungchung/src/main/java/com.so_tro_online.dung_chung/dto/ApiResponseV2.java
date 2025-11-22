package com.so_tro_online.dung_chung.dto;

public class ApiResponseV2 {
    private String message;
    private Object data;

    public ApiResponseV2(String message, Object data) {
        this.message = message;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
