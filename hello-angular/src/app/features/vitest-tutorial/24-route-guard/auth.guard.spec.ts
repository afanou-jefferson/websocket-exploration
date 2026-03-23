/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 24 – CanActivate Guard + NgRx Store
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Guards are functions — they can be tested without a real router or
 *   component. The modern approach uses TestBed.runInInjectionContext()
 *   which provides the Angular DI context that inject() requires inside
 *   a functional guard.
 *
 *   provideMockStore() gives us control over the auth state.
 *   We call the guard directly and observe the Observable it returns.
 *
 * PATTERNS COVERED:
 *   - TestBed.runInInjectionContext()    ← required for functional guards
 *   - provideMockStore + provideRouter   ← minimal setup, no full app
 *   - firstValueFrom()                  ← read the guard's Observable result
 *   - Testing allow / redirect / admin-only scenarios
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed }               from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom }        from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { authGuard, adminGuard, AuthActions, selectIsLoggedIn, selectIsAdmin } from './auth.guard';

// Minimal route snapshots (guard doesn't use them in this example)
const routeSnap  = {} as ActivatedRouteSnapshot;
const stateSnap  = {} as RouterStateSnapshot;

describe('authGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { auth: { isLoggedIn: false, role: null } } }),
        provideRouter([]),
      ],
    });
    store = TestBed.inject(MockStore);
  });

  it('should allow navigation when user is logged in', async () => {
    store.overrideSelector(selectIsLoggedIn, true);
    store.refreshState();

    // ✅ runInInjectionContext provides the DI context for inject() inside the guard
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(authGuard(routeSnap, stateSnap) as any),
    );

    expect(result).toBe(true);
  });

  it('should redirect to /login when user is not logged in', async () => {
    store.overrideSelector(selectIsLoggedIn, false);
    store.refreshState();

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(authGuard(routeSnap, stateSnap) as any),
    );

    // ✅ Guard returns a UrlTree for redirects — not just false
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});

describe('adminGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { auth: { isLoggedIn: true, role: 'user' } } }),
        provideRouter([]),
      ],
    });
    store = TestBed.inject(MockStore);
  });

  it('should allow access for admin role', async () => {
    store.overrideSelector(selectIsAdmin, true);
    store.refreshState();

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(adminGuard(routeSnap, stateSnap) as any),
    );

    expect(result).toBe(true);
  });

  it('should redirect non-admins to /forbidden', async () => {
    store.overrideSelector(selectIsAdmin, false);
    store.refreshState();

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(adminGuard(routeSnap, stateSnap) as any),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/forbidden');
  });
});
