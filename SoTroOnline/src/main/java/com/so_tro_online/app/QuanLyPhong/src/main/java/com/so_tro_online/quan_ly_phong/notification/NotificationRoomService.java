package com.so_tro_online.quan_ly_phong.notification;

import com.so_tro_online.quan_ly_phong.dto.ReminderElectricityMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class NotificationRoomService {
    private final KafkaTemplate<String,Object> kafkaTemplate;

    public NotificationRoomService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    public void sentRentConfirm(ReminderElectricityMessage reminderElectricityMessage) {
        Message<ReminderElectricityMessage> message= MessageBuilder
                .withPayload(reminderElectricityMessage)
                .setHeader(KafkaHeaders.TOPIC,"reminder")
                .setHeader("__TypeId__", "reminder")
                .build();
        kafkaTemplate.send(message);
    }
}
