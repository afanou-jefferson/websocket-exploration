import { Component, Input, signal, inject, computed } from '@angular/core';
import { WebSocketStompService } from './websocket-stomp.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-chat-stomp',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule],
    template: `
    <mat-card class="chat-card stomp-theme">
      <mat-card-header>
        <mat-card-title>{{ identity }}</mat-card-title>
        <mat-card-subtitle class="lock-status">
          @if (isLockedByOther()) {
            <span style="color: red;"><mat-icon inline>lock</mat-icon> Locked by {{ lockHolder() }}</span>
          } @else if (isLockedByMe()) {
            <span style="color: green;"><mat-icon inline>lock_open</mat-icon> You have the lock</span>
          } @else {
            <span style="color: gray;">Unlocked</span>
          }
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content class="messages-container">
        <div class="messages">
          @for (msg of messages(); track $index) {
            <div class="message-bubble">{{ msg }}</div>
          }
        </div>
      </mat-card-content>

      <mat-card-actions class="chat-actions">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Type a message</mat-label>
          <input 
            matInput
            #input 
            type="text" 
            [disabled]="isLockedByOther()"
            (keyup.enter)="sendMessage(input.value); input.value = ''">
        </mat-form-field>

        <div class="button-row">
          <button 
            mat-flat-button
            color="primary"
            (click)="sendMessage(input.value); input.value = ''"
            [disabled]="isLockedByOther()">
            <mat-icon>send</mat-icon> Send
          </button>
          
          <button 
            mat-stroked-button
            color="accent"
            (click)="toggleLock()">
            <mat-icon>{{ isLockedByMe() ? 'lock_open' : 'lock' }}</mat-icon>
            {{ isLockedByMe() ? 'Unlock' : 'Lock' }}
          </button>
        </div>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .chat-card { width: 350px; margin: 10px; }
    .stomp-theme { border-top: 4px solid #f50057; }
    .messages-container { height: 200px; overflow-y: auto; margin-bottom: 15px; border-radius: 4px; padding: 10px; }
    .message-bubble { padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; border: 1px solid #e0e0e0; width: fit-content; max-width: 90%; word-break: break-word; }
    .lock-status { font-weight: 500; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
    .chat-actions { display: flex; flex-direction: column; align-items: stretch; padding: 0 16px 16px; }
    .full-width { width: 100%; }
    .button-row { display: flex; gap: 8px; justify-content: flex-end; }
  `]
})
export class ChatStompComponent {
    @Input() identity = '';
    private wsService = inject(WebSocketStompService);
    protected messages = signal<string[]>([]);
    protected lockHolder = signal<string>('');
    protected isLocked = signal<boolean>(false);

    protected isLockedByMe = computed(() => this.isLocked() && this.lockHolder() === this.identity);
    protected isLockedByOther = computed(() => this.isLocked() && this.lockHolder() !== this.identity);

    constructor() {
        this.wsService.messages$.subscribe(data => {
            if (data.text) {
                this.messages.update(msgs => [...msgs, data.text]);
            }
        });

        this.wsService.lockState$.subscribe(data => {
            if (data.lockState) {
                this.isLocked.set(data.lockState.locked);
                this.lockHolder.set(data.lockState.holder);
            }
        });
    }

    sendMessage(text: string) {
        if (!text.trim()) return;
        const message = `[${this.identity}]: ${text}`;
        this.wsService.sendMessage(message);
    }

    toggleLock() {
        const isLocking = !this.isLockedByMe();
        this.wsService.sendLockRequest(isLocking, this.identity);
    }
}
