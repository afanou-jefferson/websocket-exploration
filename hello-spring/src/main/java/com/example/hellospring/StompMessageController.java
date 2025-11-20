package com.example.hellospring;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
@EnableScheduling
public class StompMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AtomicInteger counter = new AtomicInteger();
    private String lockHolder = null;

    public StompMessageController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage handleChatMessage(ChatMessage message) {
        return message;
    }

    @MessageMapping("/lock")
    public void handleLockRequest(LockRequest request) {
        if (request.isLock()) {
            lockHolder = request.getIdentity();
        } else {
            lockHolder = null;
        }

        LockState lockState = new LockState(lockHolder != null, lockHolder != null ? lockHolder : "");
        messagingTemplate.convertAndSend("/topic/lock", new LockStateMessage(lockState));
    }

    @Scheduled(fixedRate = 1000)
    public void broadcastCounter() {
        String message = "Counter: " + counter.incrementAndGet();
        messagingTemplate.convertAndSend("/topic/counter", new CounterMessage(message));
    }

    // DTOs
    public static class ChatMessage {
        private String text;

        public ChatMessage() {
        }

        public ChatMessage(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    public static class LockRequest {
        private boolean lock;
        private String identity;

        public LockRequest() {
        }

        public LockRequest(boolean lock, String identity) {
            this.lock = lock;
            this.identity = identity;
        }

        public boolean isLock() {
            return lock;
        }

        public void setLock(boolean lock) {
            this.lock = lock;
        }

        public String getIdentity() {
            return identity;
        }

        public void setIdentity(String identity) {
            this.identity = identity;
        }
    }

    public static class LockState {
        private boolean locked;
        private String holder;

        public LockState() {
        }

        public LockState(boolean locked, String holder) {
            this.locked = locked;
            this.holder = holder;
        }

        public boolean isLocked() {
            return locked;
        }

        public void setLocked(boolean locked) {
            this.locked = locked;
        }

        public String getHolder() {
            return holder;
        }

        public void setHolder(String holder) {
            this.holder = holder;
        }
    }

    public static class LockStateMessage {
        private LockState lockState;

        public LockStateMessage() {
        }

        public LockStateMessage(LockState lockState) {
            this.lockState = lockState;
        }

        public LockState getLockState() {
            return lockState;
        }

        public void setLockState(LockState lockState) {
            this.lockState = lockState;
        }
    }

    public static class CounterMessage {
        private String message;

        public CounterMessage() {
        }

        public CounterMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
