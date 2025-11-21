package com.so_tro_online.quan_ly_phong.notification;

import com.so_tro_online.quan_ly_phong.dto.PhongEvent;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.Map;


@Service
public class ConsumerPhongEvent {

    private final SimpleVectorStore simpleVectorStore;
    private  final File vectorStoreFile = new File("src/main/resources/data/vectorstore.json");
    public ConsumerPhongEvent(SimpleVectorStore simpleVectorStore) {
        this.simpleVectorStore = simpleVectorStore;
    }

    @KafkaListener(topics = "phong-event",groupId = "phongGroup")
    public void receivePhongEvent(PhongEvent phongEvent) {
        if (phongEvent.getAction().equals("CREATE")) {
            Document doc = phongToDocument(phongEvent);
            simpleVectorStore.add(List.of(doc));
            simpleVectorStore.save(vectorStoreFile);
        }
        if (phongEvent.getAction().equals("UPDATE")) {
            simpleVectorStore.delete(Collections.singletonList(phongEvent.getMaPhong().toString()));
            Document doc = phongToDocument(phongEvent);
            simpleVectorStore.add(List.of(doc));
            simpleVectorStore.save(vectorStoreFile);
        }
        if (phongEvent.getAction().equals("DELETE")) {
            simpleVectorStore.delete(Collections.singletonList(phongEvent.getMaPhong().toString()));
            simpleVectorStore.save(vectorStoreFile);
        }

    }
    private Document phongToDocument(PhongEvent p) {
        return new Document(
                p.getMaPhong().toString(),
                "Phòng " + p.getTenPhong() +
                        ", loại: " + p.getLoaiPhong() +
                        ", địa chỉ: " + p.getDiaChi() +
                        ", giá thuê: " + p.getGiaThueCoBan() + " VND" +
                        ", vật dụng: " + p.getVatDung() +
                        ", chiều dài: " + p.getChieuDai() + " mét" +
                        ", chiều rộng: " + p.getChieuRong() + " mét",
                Map.of("entity","Phong")
        );
    }
}
