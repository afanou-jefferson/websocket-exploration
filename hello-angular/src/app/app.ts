import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from './websocket.service';
import { ChatComponent } from './chat.component';
import { WebSocketStompService } from './websocket-stomp.service';
import { ChatStompComponent } from './chat-stomp.component';

@Component({
  selector: 'app-root',
  imports: [ChatComponent, ChatStompComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('hello-angular');
  protected readonly greeting = signal('');
  private readonly http = inject(HttpClient);
  private readonly wsService = inject(WebSocketService);
  private readonly wsStompService = inject(WebSocketStompService);

  protected readonly users = signal<{ id: number, name: string, profession?: string }[]>([]);

  ngOnInit() {
    this.wsService.messages$.subscribe(data => {
      if (data.message) {
        this.greeting.set(data.message);
      }
    });

    this.wsStompService.counter$.subscribe(message => {
      this.greeting.set(message);
    });

    this.http.get<{ id: number, name: string }[]>('http://localhost:8080/api/users')
      .subscribe(users => this.users.set(users));
  }

  fetchProfession(user: { id: number, name: string, profession?: string }) {
    this.http.get<{ profession: string }>(`http://localhost:8080/api/users/${user.id}/profession`)
      .subscribe(response => {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, profession: response.profession } : u));
      });
  }
}
