import { Component } from '@angular/core';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatStompComponent } from './chat/chat-stomp/chat-stomp.component';
import { TitleModule } from './title/title.module';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChatComponent,
    ChatStompComponent,
    TitleModule,
    MatDividerModule,
  ],
  template: `

    <app-title></app-title>

    <h2 class="section-title">Pure Websocket Chat Components</h2>
    <div class="chat-row">
      <app-chat identity="Pure Websocket Component A"></app-chat>
      <app-chat identity="Pure Websocket Component B"></app-chat>
    </div>

    <mat-divider class="section-divider"></mat-divider>

    <h2 class="section-title">STOMP Chat Components</h2>
    <div class="chat-row">
      <app-chat-stomp identity="STOMP Component A"></app-chat-stomp>
      <app-chat-stomp identity="STOMP Component B"></app-chat-stomp>
    </div>

    <mat-divider class="section-divider"></mat-divider>
  `
})
export class HomeComponent { }
