import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket: WebSocket;
    public messages$ = new Subject<any>();

    constructor() {
        this.socket = new WebSocket('ws://localhost:8080/ws');
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messages$.next(data);
        };
    }

    send(message: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }
}
