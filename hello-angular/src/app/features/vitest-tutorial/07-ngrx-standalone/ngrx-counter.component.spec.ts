/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 07 – NgRx with provideMockStore (Standalone / Modern Syntax)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   provideMockStore() replaces the real NgRx store with a controllable fake.
 *   You set the initial state directly, and you can override individual
 *   selectors at any point in the test.
 *
 * NGRX TESTING APIS COVERED:
 *   - provideMockStore({ initialState })   ← replaces the real store
 *   - MemoizedSelector overrides           ← override specific selectors
 *   - store.scannedActions$                ← observe dispatched actions
 *   - store.dispatch spy                   ← verify dispatch calls
 *
 * WHEN TO USE THIS:
 *   Use for *component* tests that depend on the store.
 *   For *reducer* or *selector* tests, test them directly without TestBed.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NgrxCounterComponent } from './ngrx-counter.component';
import {
  counterFeature,
  CounterActions,
  selectProgress,
} from './counter.store';

describe('NgrxCounterComponent', () => {
  let fixture: ComponentFixture<NgrxCounterComponent>;
  let store: MockStore;

  const initialState = {
    counter: { count: 5, target: 10 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgrxCounterComponent],
      providers: [
        // ✅ PATTERN: provideMockStore replaces EVERY store interaction.
        // The initialState object sets the global state for all selectors.
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    // Inject the MockStore instance so we can control it in tests.
    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(NgrxCounterComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset any selector overrides between tests.
    store.resetSelectors();
  });

  // ── Rendering from initial state ───────────────────────────────────────────
  it('should display the initial count from the mock store', () => {
    const el = fixture.nativeElement.querySelector('[data-testid="count-display"]');
    // Initial state has count = 5.
    expect(el.textContent).toContain('5');
  });

  it('should display the initial progress from the mock store', () => {
    // count=5, target=10 → 50%
    const el = fixture.nativeElement.querySelector('[data-testid="progress"]');
    expect(el.textContent).toContain('50%');
  });

  // ── Overriding selectors ───────────────────────────────────────────────────
  it('should update when the count selector is overridden', () => {
    // ✅ PATTERN: override a specific selector at runtime.
    // This is better than setting the entire initialState again – it is surgical.
    store.overrideSelector(counterFeature.selectCount, 9);
    store.overrideSelector(selectProgress, 90);

    // setState alone does not trigger change detection.
    // refreshState() + detectChanges() re-renders the component.
    store.refreshState();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="count-display"]');
    expect(el.textContent).toContain('9');
  });

  // ── Dispatch verification ──────────────────────────────────────────────────
  it('should dispatch CounterActions.increment when + is clicked', () => {
    // ✅ PATTERN: spy on store.dispatch to verify action shape.
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.nativeElement.querySelector('[data-testid="btn-inc"]').click();

    expect(dispatchSpy).toHaveBeenCalledWith(CounterActions.increment());
  });

  it('should dispatch CounterActions.decrement when − is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.nativeElement.querySelector('[data-testid="btn-dec"]').click();

    expect(dispatchSpy).toHaveBeenCalledWith(CounterActions.decrement());
  });

  it('should dispatch CounterActions.reset when Reset is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.nativeElement.querySelector('[data-testid="btn-reset"]').click();

    expect(dispatchSpy).toHaveBeenCalledWith(CounterActions.reset());
  });

  // ── Reducer / Selector unit tests (NO TestBed needed) ─────────────────────
  // ✅ BEST PRACTICE: test reducers and selectors in pure isolation.
  describe('Reducer (pure function test – no TestBed)', () => {
    it('should increment the count', () => {
      const state = { count: 3, target: 10 };
      const next  = counterFeature.reducer(state, CounterActions.increment());
      expect(next.count).toBe(4);
    });

    it('should decrement the count', () => {
      const state = { count: 3, target: 10 };
      const next  = counterFeature.reducer(state, CounterActions.decrement());
      expect(next.count).toBe(2);
    });

    it('should reset the count to 0', () => {
      const state = { count: 7, target: 10 };
      const next  = counterFeature.reducer(state, CounterActions.reset());
      expect(next.count).toBe(0);
    });
  });

  describe('selectProgress selector (pure function test)', () => {
    it('should compute 50% progress for count=5, target=10', () => {
      const result = selectProgress.projector(5, 10);
      expect(result).toBe(50);
    });

    it('should cap progress at 100% even when count exceeds target', () => {
      const result = selectProgress.projector(15, 10);
      expect(result).toBe(100);
    });
  });
});
