import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private counterSocket: WebSocket;
    private chatSocket: WebSocket;
    private lockSocket: WebSocket;
    public messages$ = new Subject<any>();
    private socketsReady = { counter: false, chat: false, lock: false };

    constructor() {
        // Connect to counter endpoint
        this.counterSocket = new WebSocket('ws://localhost:8080/ws/counter');
        this.counterSocket.onopen = () => {
            this.socketsReady.counter = true;
            console.log('Counter WebSocket connected');
        };
        this.counterSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messages$.next(data);
        };
        this.counterSocket.onerror = (error) => {
            console.error('Counter WebSocket error:', error);
        };

        // Connect to chat endpoint
        this.chatSocket = new WebSocket('ws://localhost:8080/ws/chat');
        this.chatSocket.onopen = () => {
            this.socketsReady.chat = true;
            console.log('Chat WebSocket connected');
        };
        this.chatSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messages$.next(data);
        };
        this.chatSocket.onerror = (error) => {
            console.error('Chat WebSocket error:', error);
        };

        // Connect to lock endpoint
        this.lockSocket = new WebSocket('ws://localhost:8080/ws/lock');
        this.lockSocket.onopen = () => {
            this.socketsReady.lock = true;
            console.log('Lock WebSocket connected');
        };
        this.lockSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messages$.next(data);
        };
        this.lockSocket.onerror = (error) => {
            console.error('Lock WebSocket error:', error);
        };
    }

    send(message: any) {
        // Determine which socket to use based on message content
        if (message.lock !== undefined) {
            // Lock message goes to lock socket
            if (this.lockSocket.readyState === WebSocket.OPEN) {
                this.lockSocket.send(JSON.stringify(message));
            } else {
                console.warn('Lock socket not ready, message not sent:', message);
            }
        } else {
            // Chat message goes to chat socket
            if (this.chatSocket.readyState === WebSocket.OPEN) {
                this.chatSocket.send(JSON.stringify(message));
            } else {
                console.warn('Chat socket not ready, message not sent:', message);
            }
        }
    }
}
