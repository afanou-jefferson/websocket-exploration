import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, provideStore, StoreRootModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { TitleModule } from './title/title.module';
import { Component, Input } from '@angular/core';
import { NewSyntaxModule } from './new-syntax/new-syntax.module';
import { WebSocketService } from './websocket.service';
import { WebSocketStompService } from './websocket-stomp.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { vi } from 'vitest';

class MockWebSocketService {
  messages$ = new Subject<any>();
  send = vi.fn();
}

class MockWebSocketStompService {
  messages$ = new Subject<any>();
  lockState$ = new Subject<any>();
  counter$ = new Subject<any>();
  sendMessage = vi.fn();
  sendLockRequest = vi.fn();
}

@Component({
  selector: 'app-new-child',
  template: '<div class="mock-child">Mocked Child in App</div>',
  standalone: false
})
class MockNewChildComponent {
  @Input() stateValue: any;
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App, BrowserAnimationsModule, TitleModule          
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore(),
        { provide: StoreRootModule, useValue: {} },
        provideEffects(),
        { provide: WebSocketService, useClass: MockWebSocketService },
        { provide: WebSocketStompService, useClass: MockWebSocketStompService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    //debugger;
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span')?.textContent).toContain('Hello World');
  });
});
