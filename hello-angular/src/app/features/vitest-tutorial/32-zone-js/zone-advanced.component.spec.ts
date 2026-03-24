import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ZoneAdvancedComponent } from './zone-advanced.component';

describe('ZoneAdvancedComponent (Case 32 — Zone.js)', () => {
  let component: ZoneAdvancedComponent;
  let fixture: ComponentFixture<ZoneAdvancedComponent>;
  let cdRef: ChangeDetectorRef;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [ZoneAdvancedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoneAdvancedComponent);
    component = fixture.componentInstance;
    cdRef = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // Case 1: Initial state
  it('should have correct initial state', () => {
    const counterEl = fixture.nativeElement.querySelector('[data-testid="counter"]');
    const statusEl = fixture.nativeElement.querySelector('[data-testid="status"]');
    
    expect(component.counter).toBe(0);
    expect(component.isRunning).toBe(false);
    expect(counterEl.textContent).toContain('0');
    expect(statusEl.textContent).toContain('Stopped');
  });

  // Case 2: Interval tracking
  it('should increment counter twice after 2 seconds of interval', () => {
    component.startTimer();
    expect(component.isRunning).toBe(true);

    vi.advanceTimersByTime(2000); // 2 intervals
    cdRef.detectChanges();

    expect(component.counter).toBe(2);
    const counterEl = fixture.nativeElement.querySelector('[data-testid="counter"]');
    expect(counterEl.textContent).toContain('2');
  });

  // Case 3: Cancellation
  it('should stop incrementing when stopTimer is called', () => {
    component.startTimer();
    vi.advanceTimersByTime(1000);
    cdRef.detectChanges();
    expect(component.counter).toBe(1);

    component.stopTimer();
    vi.advanceTimersByTime(2000); // No more increments
    cdRef.detectChanges();

    expect(component.counter).toBe(1);
    expect(component.isRunning).toBe(false);
  });

  // Case 4: Nested macro-tasks
  it('should handle nested timeouts correctly (+5 then +5)', async () => {
    component.runNestedAsync();
    
    // First timeout (500ms)
    vi.advanceTimersByTime(500);
    cdRef.detectChanges();
    expect(component.counter).toBe(5);

    // Second timeout (another 500ms)
    vi.advanceTimersByTime(500);
    cdRef.detectChanges();
    expect(component.counter).toBe(10);
  });

  // Case 5: Zone Escape behavior
  it('should NOT update DOM automatically when running outside Angular Zone', () => {
    // 1. Initial DOM check
    const counterEl = fixture.nativeElement.querySelector('[data-testid="counter"]');
    expect(counterEl.textContent).toContain('0');

    // 2. Trigger async work outside Zone
    component.runOutsideZone();
    
    // 3. Move time forward
    vi.advanceTimersByTime(100);
    
    // 4. Verify logic changed but NO domestic change detection happened yet
    // In a real browser without manual CD, the DOM would stay '0'
    expect(component.counter).toBe(1);
    expect(counterEl.textContent).toContain('0'); // ❌ Unchanged!

    // 5. Explicitly run CD
    cdRef.detectChanges();
    expect(counterEl.textContent).toContain('1'); // ✅ Now updated
  });

  // Case 6: Reset functionality
  it('should reset counter and stop timer', () => {
    component.startTimer();
    vi.advanceTimersByTime(3000);
    component.reset();

    cdRef.detectChanges();
    expect(component.counter).toBe(0);
    expect(component.isRunning).toBe(false);
  });

  // Coverage: already running
  it('should not start a second interval if already running', () => {
    component.startTimer();
    const firstIntervalId = (component as any).intervalId;
    
    component.startTimer();
    expect((component as any).intervalId).toBe(firstIntervalId);
  });

  // Coverage: stop when not running
  it('should handle stopTimer even if not running', () => {
    expect(component.isRunning).toBe(false);
    expect(() => component.stopTimer()).not.toThrow();
  });
});
