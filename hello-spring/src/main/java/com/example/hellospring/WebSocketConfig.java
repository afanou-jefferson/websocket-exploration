package com.example.hellospring;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CounterHandler counterHandler;
    private final ChatHandler chatHandler;
    private final LockHandler lockHandler;

    public WebSocketConfig(CounterHandler counterHandler, ChatHandler chatHandler, LockHandler lockHandler) {
        this.counterHandler = counterHandler;
        this.chatHandler = chatHandler;
        this.lockHandler = lockHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(counterHandler, "/ws/counter")
                .setAllowedOrigins("http://localhost:4200");
        registry.addHandler(chatHandler, "/ws/chat")
                .setAllowedOrigins("http://localhost:4200");
        registry.addHandler(lockHandler, "/ws/lock")
                .setAllowedOrigins("http://localhost:4200");
    }
}
