package com.example.hellospring;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class CounterHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final AtomicInteger counter = new AtomicInteger();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private String lockHolder = null; // Track who holds the lock

    public CounterHandler() {
        scheduler.scheduleAtFixedRate(this::broadcastCounter, 1, 1, TimeUnit.SECONDS);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status)
            throws Exception {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        // Check if it's a lock/unlock message
        if (payload.contains("\"lock\"")) {
            handleLockMessage(payload);
        } else {
            // Regular text message - broadcast to all
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    s.sendMessage(message);
                }
            }
        }
    }

    private void handleLockMessage(String payload) throws IOException {
        // Parse lock message: {"lock": true/false, "identity": "Component A"}
        boolean isLocking = payload.contains("\"lock\":true");
        String identity = extractIdentity(payload);

        if (isLocking) {
            lockHolder = identity;
        } else {
            lockHolder = null;
        }

        // Broadcast lock state to all clients
        String lockMessage = "{\"lockState\": {\"locked\": " + (lockHolder != null) +
                ", \"holder\": \"" + (lockHolder != null ? lockHolder : "") + "\"}}";
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(lockMessage));
            }
        }
    }

    private String extractIdentity(String payload) {
        // Simple extraction: find "identity":"Component X"
        int start = payload.indexOf("\"identity\":\"") + 12;
        int end = payload.indexOf("\"", start);
        return payload.substring(start, end);
    }

    private void broadcastCounter() {
        String message = "Counter: " + counter.incrementAndGet();
        for (WebSocketSession session : sessions) {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage("{\"message\": \"" + message + "\"}"));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
