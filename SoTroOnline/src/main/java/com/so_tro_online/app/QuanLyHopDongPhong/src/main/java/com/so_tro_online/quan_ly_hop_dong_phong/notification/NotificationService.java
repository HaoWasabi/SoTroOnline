package com.so_tro_online.quan_ly_hop_dong_phong.notification;

import com.so_tro_online.quan_ly_hop_dong_phong.dto.RentRoomMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final KafkaTemplate<String,Object> kafkaTemplate;

    public NotificationService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    public void sentRentConfirm(RentRoomMessage rentRoomMessage) {
        Message<RentRoomMessage> message= MessageBuilder
                .withPayload(rentRoomMessage)
                .setHeader(KafkaHeaders.TOPIC,"rent")
                .setHeader("__TypeId__", "rent")
                .build();
        kafkaTemplate.send(message);
    }
}
