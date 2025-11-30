package com.so_tro_online.cham_soc_khach_hang.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PhoneCallBody {

    @JsonProperty("to")
    private String to;

    public String getTo() {
        return to;
    }
    public void setTo(String to) {
        this.to = to;
    }
}
