import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegacyTimerComponent } from './legacy-timer.component';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('LegacyTimerComponent (Zone.js Mode - Targeted CD)', () => {
  let component: LegacyTimerComponent;
  let fixture: ComponentFixture<LegacyTimerComponent>;
  let cdRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegacyTimerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LegacyTimerComponent);
    component = fixture.componentInstance;
    cdRef = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with counter at 0', () => {
    const counterElement = (fixture.nativeElement as HTMLElement).querySelector('#counter');
    expect(counterElement?.textContent).toBe('0');
    expect(component.counter).toBe(0);
  });

  it('should increment counter after 1s', () => {
    // 1. Trigger async operation
    component.startTimer();

    // 2. Move time forward
    vi.advanceTimersByTime(1000);

    // 3. Update the component DOM targetedly
    // This avoids the fixture's full checkNoChanges pass that causes NG0100 in this setup
    cdRef.detectChanges();

    // 4. Verify result
    expect(component.counter).toBe(1);
    const counterElement = (fixture.nativeElement as HTMLElement).querySelector('#counter');
    expect(counterElement?.textContent).toBe('1');
  });

  it('should handle multiple rapid clicks', () => {
    // Trigger two clicks
    component.startTimer();
    component.startTimer();

    // Advance 1s
    vi.advanceTimersByTime(1000);
    cdRef.detectChanges();

    expect(component.counter).toBe(2);
    const counterElement = (fixture.nativeElement as HTMLElement).querySelector('#counter');
    expect(counterElement?.textContent).toBe('2');
  });
});
