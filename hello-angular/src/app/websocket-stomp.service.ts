import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
    providedIn: 'root'
})
export class WebSocketStompService {
    private client: Client;
    public messages$ = new Subject<any>();
    public counter$ = new Subject<string>();
    public lockState$ = new Subject<any>();

    constructor() {
        this.client = new Client({
            webSocketFactory: () => {
                // Handle potential default export issue with SockJS
                const _SockJS = (SockJS as any).default || SockJS;
                return new _SockJS('http://localhost:8080/ws-stomp');
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            onConnect: () => {
                console.log('STOMP connected');

                // Subscribe to chat messages
                this.client.subscribe('/topic/messages', (message) => {
                    const data = JSON.parse(message.body);
                    this.messages$.next(data);
                });

                // Subscribe to counter updates
                this.client.subscribe('/topic/counter', (message) => {
                    const data = JSON.parse(message.body);
                    this.counter$.next(data.message);
                });

                // Subscribe to lock state updates
                this.client.subscribe('/topic/lock', (message) => {
                    const data = JSON.parse(message.body);
                    this.lockState$.next(data);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
            }
        });

        this.client.activate();
    }

    sendMessage(text: string) {
        if (this.client.connected) {
            this.client.publish({
                destination: '/app/chat',
                body: JSON.stringify({ text })
            });
        }
    }

    sendLockRequest(lock: boolean, identity: string) {
        if (this.client.connected) {
            this.client.publish({
                destination: '/app/lock',
                body: JSON.stringify({ lock, identity })
            });
        }
    }
}
