package com.so_tro_online.quan_ly_hop_dong_phong.notification;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;

import com.so_tro_online.quan_ly_hop_dong_phong.service.EmailRentRoomService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {
    private final EmailRentRoomService emailRentRoomService;

    public ConsumerService(EmailRentRoomService emailRentRoomService) {
        this.emailRentRoomService = emailRentRoomService;
    }

    @KafkaListener(topics = "rent",groupId = "rentGroup")
    public void receiveRentMessage(RentRoomMessage rentRoomMessage) {
        try {
            emailRentRoomService.sendConfirmRentRoom(rentRoomMessage);
        }catch (Exception e){
            System.out.println("fail to send message+"+e.getMessage());
        }

    }
}
