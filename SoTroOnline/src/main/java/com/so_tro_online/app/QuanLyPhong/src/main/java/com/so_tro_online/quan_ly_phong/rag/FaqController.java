//package com.so_tro_online.quan_ly_phong.rag;
//
//import com.so_tro_online.quan_ly_phong.dto.RoomFaqResponse;
//import com.so_tro_online.quan_ly_phong.dto.RoomResponse;
//import org.springframework.ai.chat.client.ChatClient;
//import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
//import org.springframework.ai.vectorstore.SearchRequest;
//import org.springframework.ai.vectorstore.VectorStore;
//import org.springframework.core.ParameterizedTypeReference;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//public class FaqController {
//
//    private final ChatClient chatClient;
//
//    public FaqController(ChatClient.Builder builder, VectorStore vectorStore) {
//        this.chatClient = builder
//                .defaultAdvisors(new QuestionAnswerAdvisor(vectorStore,SearchRequest.defaults()))
//                .build();
//    }
//
//    @GetMapping("/faq")
//    public List<RoomFaqResponse> faq(@RequestParam(value = "message", defaultValue = "How many athletes compete in the Olympic Games Paris 2024") String message) {
//        return chatClient.prompt()
//                .user(message)
//                .call()
//                .entity(new ParameterizedTypeReference<>() {});
//    }
//
//}