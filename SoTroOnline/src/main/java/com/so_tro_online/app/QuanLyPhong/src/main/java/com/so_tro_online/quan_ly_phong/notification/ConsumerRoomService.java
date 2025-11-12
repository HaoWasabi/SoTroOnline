package com.so_tro_online.quan_ly_phong.notification;

import com.so_tro_online.quan_ly_phong.dto.ReminderElectricityMessage;
import com.so_tro_online.quan_ly_phong.service.EmailReminderRoomService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class ConsumerRoomService {
    private final EmailReminderRoomService emailReminderRoomService;

    public ConsumerRoomService(EmailReminderRoomService emailReminderRoomService) {
        this.emailReminderRoomService = emailReminderRoomService;
    }

    @KafkaListener(topics = "reminder",groupId = "reminderGroup")
    public void receiveRentMessage(ReminderElectricityMessage reminderElectricityMessage) {
        try {
           emailReminderRoomService.sendReminder(reminderElectricityMessage);
        }catch (Exception e){
            System.out.println("fail to send message+"+e.getMessage());
        }

    }
}
