package com.so_tro_online.quan_ly_phong.notification;

import com.so_tro_online.quan_ly_phong.dto.PhongEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class NotificationPhongEvent {
    private final KafkaTemplate<String,Object> kafkaTemplate;

    public NotificationPhongEvent(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sentPhongEvent(PhongEvent phongEvent){
        try {
            Message<PhongEvent> message= MessageBuilder
                    .withPayload(phongEvent)
                    .setHeader(KafkaHeaders.TOPIC,"phong-event")
                    .setHeader("__TypeId__", "phong-event")
                    .build();
            kafkaTemplate.send(message);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
