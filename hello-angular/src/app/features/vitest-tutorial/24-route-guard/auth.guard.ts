import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createActionGroup, props, emptyProps } from '@ngrx/store';

// ── Auth state ─────────────────────────────────────────────────────────────
export interface AuthState { isLoggedIn: boolean; role: 'admin' | 'user' | null; }

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login:  props<{ role: 'admin' | 'user' }>(),
    Logout: emptyProps(),
  },
});

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    { isLoggedIn: false, role: null } as AuthState,
    on(AuthActions.login,  (_, { role }) => ({ isLoggedIn: true,  role })),
    on(AuthActions.logout, ()            => ({ isLoggedIn: false, role: null })),
  ),
});

export const selectIsLoggedIn = authFeature.selectIsLoggedIn;
export const selectIsAdmin    = createSelector(authFeature.selectRole, role => role === 'admin');

// ── Guard ──────────────────────────────────────────────────────────────────
export const authGuard: CanActivateFn = () => {
  const store  = inject(Store);
  const router = inject(Router);

  return store.select(selectIsLoggedIn).pipe(
    take(1),
    map(loggedIn => loggedIn ? true : router.createUrlTree(['/login'])),
  );
};

export const adminGuard: CanActivateFn = () => {
  const store  = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAdmin).pipe(
    take(1),
    map(isAdmin => isAdmin ? true : router.createUrlTree(['/forbidden'])),
  );
};
