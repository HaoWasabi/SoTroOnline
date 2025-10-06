//package com.so_tro_online.quan_ly_phong.rag;
//
//import com.so_tro_online.quan_ly_phong.entity.Phong;
//import com.so_tro_online.quan_ly_phong.entity.TrangThai;
//import com.so_tro_online.quan_ly_phong.repository.PhongRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.ai.document.Document;
//import org.springframework.ai.embedding.EmbeddingModel;
//import org.springframework.ai.ollama.OllamaEmbeddingModel;
//import org.springframework.ai.transformer.splitter.TokenTextSplitter;
//import org.springframework.ai.vectorstore.SimpleVectorStore;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.io.File;
//import java.io.IOException;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Configuration
//public class RagConfiguration {
//
//    private static final Logger log = LoggerFactory.getLogger(RagConfiguration.class);
//    private final PhongRepository phongRepository;
//
//    public RagConfiguration(PhongRepository phongRepository) {
//        this.phongRepository = phongRepository;
//    }
//
//
//    @Bean
//    SimpleVectorStore simpleVectorStore(OllamaEmbeddingModel embeddingModel) throws IOException {
//        var simpleVectorStore = new SimpleVectorStore(embeddingModel);
//        File vectorStoreFile = new File("src/main/resources/data/vectorstore.json");
//
//        // Tạo thư mục cha nếu chưa có
//        vectorStoreFile.getParentFile().mkdirs();
//
//        if (vectorStoreFile.exists()) {
//            System.out.println("Vector Store File Exists, loading...");
//            simpleVectorStore.load(vectorStoreFile);
//        } else {
//            System.out.println("Vector Store File Does Not Exist, loading from DB...");
//
//
//            List<Phong> phongs = phongRepository.findByTrangThai(TrangThai.hoatDong);
//
//
//            List<Document> documents = phongs.stream()
//                    .map(p -> new Document(
//                            p.getMaPhong().toString(),
//                            "Phòng " + p.getTenPhong() +
//                                    ", loại: " + p.getLoaiPhong() +
//                                    ", địa chỉ: " + p.getDiaChi() +
//                                    ", giá thuê: " + p.getGiaThueCoBan() + " VND" +
//                                    ", vật dụng: " + p.getVatDung() +
//                                    ", chiều dài: " + p.getChieuDai() + " mét" +
//                                    ", chiều rộng: " + p.getChieuRong() + " mét",
//                            Map.of("entity", "Phong")
//                    ))
//                    .collect(Collectors.toList());
//
//            TokenTextSplitter splitter = new TokenTextSplitter();
//            List<Document> splitDocs = splitter.apply(documents);
//            simpleVectorStore.add(splitDocs);
//            simpleVectorStore.save(vectorStoreFile);
//        }
//        return simpleVectorStore;
//    }
//}
