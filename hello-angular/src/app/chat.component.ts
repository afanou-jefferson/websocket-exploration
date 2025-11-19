import { Component, Input, signal, inject, computed } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <h3>{{ identity }}</h3>
      <div class="lock-status">
        @if (isLockedByOther()) {
          <span style="color: red;">🔒 Locked by {{ lockHolder() }}</span>
        } @else if (isLockedByMe()) {
          <span style="color: green;">🔓 You have the lock</span>
        } @else {
          <span style="color: gray;">Unlocked</span>
        }
      </div>
      <div class="messages">
        @for (msg of messages(); track $index) {
          <div>{{ msg }}</div>
        }
      </div>
      <input 
        #input 
        type="text" 
        placeholder="Type a message" 
        [disabled]="isLockedByOther()"
        (keyup.enter)="sendMessage(input.value); input.value = ''">
      <button 
        (click)="sendMessage(input.value); input.value = ''"
        [disabled]="isLockedByOther()">Send</button>
      <button (click)="toggleLock()">{{ isLockedByMe() ? 'Unlock' : 'Lock' }}</button>
    </div>
  `,
  styles: [`
    .chat-container { border: 1px solid #ccc; padding: 10px; margin: 10px; width: 300px; }
    .messages { height: 150px; overflow-y: auto; border-bottom: 1px solid #eee; margin-bottom: 10px; }
    .lock-status { margin-bottom: 10px; font-weight: bold; }
    input:disabled, button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ChatComponent {
  @Input() identity = '';
  private wsService = inject(WebSocketService);
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
      if (data.lockState) {
        this.isLocked.set(data.lockState.locked);
        this.lockHolder.set(data.lockState.holder);
      }
    });
  }

  sendMessage(text: string) {
    if (!text.trim()) return;
    const message = `[${this.identity}]: ${text}`;
    this.wsService.send({ text: message });
  }

  toggleLock() {
    const isLocking = !this.isLockedByMe();
    this.wsService.send({ lock: isLocking, identity: this.identity });
  }
}
