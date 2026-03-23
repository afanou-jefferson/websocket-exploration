import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { LiveClockComponent } from './live-clock.component';

describe('LiveClockComponent (AsyncPipe)', () => {
  let fixture:   ComponentFixture<LiveClockComponent>;
  let component: LiveClockComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [LiveClockComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(LiveClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the clock container', () => {
    const display = fixture.nativeElement.querySelector('[data-testid="clock-display"]');
    expect(display).toBeTruthy();
  });

  it('should show tick count = 1 after 1 second', async () => {
    // Advance virtual time by 1s
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    const countEl = fixture.nativeElement.querySelector('[data-testid="tick-count"]');
    expect(countEl?.textContent).toContain('Tick: 1');
  });

  it('should increment tick count after 3 seconds', async () => {
    vi.advanceTimersByTime(3000);
    fixture.detectChanges();

    const countEl = fixture.nativeElement.querySelector('[data-testid="tick-count"]');
    expect(countEl?.textContent).toContain('Tick: 3');
  });
});
