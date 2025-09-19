package com.so_tro_online.quan_ly_phong.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
public class QuanLyPhongController {
    @GetMapping
    public String getRooms() {
        return "List of rooms";
    }
}