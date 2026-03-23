/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 14 – NgRx Router Store
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   @ngrx/router-store connects Angular Router to the NgRx store, making
 *   the current URL and route params available as store selectors.
 *
 *   Testing strategy:
 *   - Use provideMockStore() with a pre-built routerState in initialState
 *   - Override router selectors surgically with store.overrideSelector()
 *   - No real Router or navigation needed in the test
 *
 * NGRX ROUTER-STORE APIS COVERED:
 *   - getRouterSelectors()      ← selectUrl, selectRouteParams, etc.
 *   - MockStore initialState    ← inject router state directly
 *   - store.overrideSelector()  ← change what the component sees
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BreadcrumbComponent } from './breadcrumb.component';
import { routerFeature } from './router-state.feature';

describe('BreadcrumbComponent (Router Store)', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        // ✅ Provide a fake router state — no real router needed
        provideMockStore({
          initialState: {
            router: {
              state: {
                url: '/users/42',
                params: { userId: '42' },
                queryParams: {},
              },
              navigationId: 1,
            },
          },
        }),
      ],
    }).compileComponents();

    store   = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.detectChanges();
  });

  afterEach(() => store.resetSelectors());

  // ── Rendering from router state ────────────────────────────────────────────
  it('should display the current URL from the router store', () => {
    // ✅ Override the selector to control exactly what the component sees
    store.overrideSelector(routerFeature.selectUrl, '/users/42');
    store.refreshState();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="current-url"]');
    expect(el?.textContent).toContain('/users/42');
  });

  it('should display the userId param from route params', () => {
    store.overrideSelector(routerFeature.selectUserId, '42');
    store.refreshState();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="user-id"]');
    expect(el?.textContent).toContain('42');
  });

  it('should hide the user-id element when param is null', () => {
    // ✅ Simulates navigating to a route without :userId param
    store.overrideSelector(routerFeature.selectUserId, null);
    store.refreshState();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="user-id"]');
    expect(el).toBeNull();
  });

  // ── Selector unit tests (pure function – no TestBed) ──────────────────────
  describe('selectUserId selector', () => {
    it('should extract userId from route params', () => {
      const result = routerFeature.selectUserId.projector({ userId: '99' });
      expect(result).toBe('99');
    });

    it('should return null when userId is not in params', () => {
      const result = routerFeature.selectUserId.projector({});
      expect(result).toBeNull();
    });
  });
});
