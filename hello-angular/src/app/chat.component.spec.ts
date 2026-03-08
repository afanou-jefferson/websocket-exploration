import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { WebSocketService } from './websocket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

class MockWebSocketService {
  messages$ = new Subject<any>();
  send = vi.fn();
}

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockWsService: MockWebSocketService;

  beforeEach(async () => {
    mockWsService = new MockWebSocketService();

    await TestBed.configureTestingModule({
      imports: [ChatComponent, BrowserAnimationsModule],
      providers: [
        { provide: WebSocketService, useValue: mockWsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    component.identity = 'Test User';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the identity in the title', () => {
    const title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Test User');
  });

  it('should send a message via WebSocketService', () => {
    component.sendMessage('Hello');
    expect(mockWsService.send).toHaveBeenCalledWith({ text: '[Test User]: Hello' });
  });

  it('should not send an empty message', () => {
    component.sendMessage('   ');
    expect(mockWsService.send).not.toHaveBeenCalled();
  });

  it('should receive messages from WebSocketService', () => {
    mockWsService.messages$.next({ text: 'Incoming message' });
    fixture.detectChanges();
    
    // As it uses signals, we can check the component state or DOM directly
    const bubbles = fixture.nativeElement.querySelectorAll('.message-bubble');
    expect(bubbles.length).toBe(1);
    expect(bubbles[0].textContent).toContain('Incoming message');
  });

  it('should handle incoming lock state', () => {
    // Another user locks it
    mockWsService.messages$.next({ lockState: { locked: true, holder: 'Other User' } });
    fixture.detectChanges();

    const subtitle = fixture.nativeElement.querySelector('.lock-status').textContent;
    expect(subtitle).toContain('Locked by Other User');

    const input = fixture.nativeElement.querySelector('input');
    const sendButton = fixture.nativeElement.querySelector('button[color="primary"]');
    
    // Check disabled state via ng-reflect-disabled or the DOM disabled property
    expect(input.disabled).toBe(true);
    expect(sendButton.disabled).toBe(true);
  });

  it('should handle when I have the lock', () => {
    // I lock it
    mockWsService.messages$.next({ lockState: { locked: true, holder: 'Test User' } });
    fixture.detectChanges();

    const subtitle = fixture.nativeElement.querySelector('.lock-status').textContent;
    expect(subtitle).toContain('You have the lock');

    const input = fixture.nativeElement.querySelector('input');
    const sendButton = fixture.nativeElement.querySelector('button[color="primary"]');
    const lockButton = fixture.nativeElement.querySelectorAll('button')[1]; // the second button is lock
    
    expect(input.disabled).toBe(false);
    expect(sendButton.disabled).toBe(false);
    expect(lockButton.textContent).toContain('Unlock');
  });

  it('should toggle lock on button click', () => {
    component.toggleLock();
    // initially unlocked, so it should request lock lock: true
    expect(mockWsService.send).toHaveBeenCalledWith({ lock: true, identity: 'Test User' });
  });
});
