import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Type } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat.component';
import { WebSocketService } from './websocket.service';
import { Subject } from 'rxjs';

// ---------------------------------------------------------------------------
// Minimal Angular "render" helper — mounts the component into document.body
// so it appears in the Vitest UI browser preview pane.
// ---------------------------------------------------------------------------

/** Pause test execution so you can visually inspect the rendered component. */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function render<T extends object>(
  componentType: Type<T>,
  options: {
    inputs?: Partial<T>;
    providers?: any[];
    imports?: any[];
  } = {}
): Promise<{ fixture: ComponentFixture<T>; element: HTMLElement; cleanup: () => void }> {
  await TestBed.configureTestingModule({
    imports: [componentType, BrowserAnimationsModule, ...(options.imports ?? [])],
    providers: options.providers ?? [],
  }).compileComponents();

  const fixture = TestBed.createComponent(componentType);

  // Apply any @Input() values
  if (options.inputs) {
    Object.assign(fixture.componentInstance, options.inputs);
  }

  fixture.detectChanges();
  await fixture.whenStable();

  // 👇 Attach to body — this is what makes it visible in Vitest UI
  document.body.appendChild(fixture.nativeElement);

  const cleanup = () => {
    fixture.destroy();
    fixture.nativeElement.remove();
    TestBed.resetTestingModule();
  };

  return { fixture, element: fixture.nativeElement as HTMLElement, cleanup };
}

// ---------------------------------------------------------------------------
// Mock WebSocketService
// ---------------------------------------------------------------------------
class MockWebSocketService {
  messages$ = new Subject<any>();
  send = vi.fn();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ChatComponent (browser render)', () => {
  let mockWsService: MockWebSocketService;
  let cleanup: () => void;

  beforeEach(() => {
    mockWsService = new MockWebSocketService();
  });

  afterEach(() => {
    cleanup?.();
  });

  it('renders with the identity as title and is visible in the browser', async () => {
    ({ cleanup } = await render(ChatComponent, {
      inputs: { identity: 'Alice' },
      providers: [{ provide: WebSocketService, useValue: mockWsService }],
    }));

    const title = document.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Alice');
    await sleep(2000); // 👈 pause so you can see it
  });

  it('renders messages received from the WebSocket', async () => {
    let fixture: ComponentFixture<ChatComponent>;
    ({ fixture, cleanup } = await render(ChatComponent, {
      inputs: { identity: 'Bob' },
      providers: [{ provide: WebSocketService, useValue: mockWsService }],
    }));

    // Simulate an incoming message
    mockWsService.messages$.next({ text: 'Hello from server!' });
    fixture.detectChanges();

    const bubbles = document.querySelectorAll('.message-bubble');
    expect(bubbles.length).toBe(1);
    expect(bubbles[0].textContent).toContain('Hello from server!');
    await sleep(2000); // 👈 pause so you can see it
  });

  it('shows "Locked by" status when another user holds the lock', async () => {
    let fixture: ComponentFixture<ChatComponent>;
    ({ fixture, cleanup } = await render(ChatComponent, {
      inputs: { identity: 'Carol' },
      providers: [{ provide: WebSocketService, useValue: mockWsService }],
    }));

    mockWsService.messages$.next({ lockState: { locked: true, holder: 'Dave' } });
    fixture.detectChanges();

    const lockStatus = document.querySelector('.lock-status');
    expect(lockStatus?.textContent).toContain('Locked by Dave');
    await sleep(2000); // 👈 pause so you can see it
  });
});
