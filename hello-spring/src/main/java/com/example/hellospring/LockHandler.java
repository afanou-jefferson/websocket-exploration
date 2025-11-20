package com.example.hellospring;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LockHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private String lockHolder = null;

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
}
