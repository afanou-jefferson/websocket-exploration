/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 03 – Service Mock with vi.fn()
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   When a component depends on a service, provide a hand-crafted mock in
 *   TestBed so the component never touches the real implementation.
 *   This keeps tests fast, deterministic, and focused on the component alone.
 *
 * PATTERNS COVERED:
 *   - Creating a mock object with vi.fn() methods
 *   - Using signal() from Vitest/Angular to simulate reactive state
 *   - { provide: RealService, useValue: mockService } provider override
 *   - Asserting that a button click dispatches the right service method
 *   - Controlling mock return values with mockReturnValue / mockImplementation
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CounterComponent } from './counter.component';
import { CounterService } from './counter.service';

describe('CounterComponent (with mocked CounterService)', () => {
  let fixture: ComponentFixture<CounterComponent>;
  let mockCounterService: Partial<CounterService>;

  beforeEach(async () => {
    // ✅ PATTERN: build a mock that matches the interface of the real service.
    // Use signal() so the template's {{ svc.count() }} still works reactively.
    //
    // We use a partial object – only the properties and methods the component
    // actually calls.  Vitest will tell us if we missed anything.
    const countSignal  = signal(0);
    const isZeroSignal = signal(true);

    mockCounterService = {
      count:     countSignal.asReadonly(),
      isZero:    isZeroSignal.asReadonly(),
      increment: vi.fn(() => countSignal.update((n) => n + 1)),
      decrement: vi.fn(() => countSignal.update((n) => n - 1)),
      reset:     vi.fn(() => countSignal.set(0)),
    };

    await TestBed.configureTestingModule({
      imports: [CounterComponent],
      providers: [
        // ✅ PATTERN: replace the real service token with the mock object.
        { provide: CounterService, useValue: mockCounterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the initial count of 0', () => {
    const countEl = fixture.nativeElement.querySelector('[data-testid="count-value"]');
    expect(countEl.textContent).toContain('Count: 0');
  });

  it('should call increment() when + button is clicked', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="btn-increment"]');
    btn.click();
    fixture.detectChanges();

    // ✅ PATTERN: verify mock was called – we don't care HOW increment works,
    // only THAT the component delegates to the service.
    expect(mockCounterService.increment).toHaveBeenCalledOnce();
  });

  it('should call decrement() when − button is clicked', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="btn-decrement"]');
    btn.click();

    expect(mockCounterService.decrement).toHaveBeenCalledOnce();
  });

  it('should call reset() and display 0 again after reset', () => {
    // First simulate some increments
    const incBtn   = fixture.nativeElement.querySelector('[data-testid="btn-increment"]');
    const resetBtn = fixture.nativeElement.querySelector('[data-testid="btn-reset"]');

    incBtn.click();
    incBtn.click();
    fixture.detectChanges();

    const countEl = fixture.nativeElement.querySelector('[data-testid="count-value"]');
    expect(countEl.textContent).toContain('Count: 2');

    resetBtn.click();
    fixture.detectChanges();

    expect(mockCounterService.reset).toHaveBeenCalledOnce();
    expect(countEl.textContent).toContain('Count: 0');
  });
});
