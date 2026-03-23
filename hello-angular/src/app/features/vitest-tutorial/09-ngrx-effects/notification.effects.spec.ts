/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 09 – NgRx Effects Testing
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   An NgRx Effect is an RxJS observable pipeline that listens to actions
 *   and emits new actions. To test it in isolation, we inject a fake action
 *   stream using `provideMockActions()` and push actions into it manually.
 *
 *   We do NOT use marble testing here — a simple `ReplaySubject` + async
 *   subscription is sufficient and more readable for most cases.
 *
 * NGRX TESTING APIS COVERED:
 *   - provideMockActions()     ← replaces the real Actions stream
 *   - ReplaySubject<Action>   ← lets us push actions on demand
 *   - vi.fn() service mock     ← controls what the service returns
 *   - Testing success path     ← happy path effect chain
 *   - Testing error path       ← catchError dispatches correct action
 *
 * WHEN TO USE THIS:
 *   Test effects in full isolation — no real service calls, no real store.
 *   The only thing under test is the effect's RxJS logic.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed }              from '@angular/core/testing';
import { Action }               from '@ngrx/store';
import { provideMockActions }   from '@ngrx/effects/testing';
import { ReplaySubject }        from 'rxjs';
import { of, throwError }       from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NotificationEffects }  from './notification.effects';
import { NotificationService }  from './notification.service';
import { NotificationActions }  from './notification.actions';

describe('NotificationEffects', () => {
  // ✅ PATTERN: a ReplaySubject lets us push actions into the effect manually.
  // ReplaySubject(1) replays the last emitted value to late subscribers.
  let actions$ = new ReplaySubject<Action>(1);
  let effects:  NotificationEffects;
  let serviceSpy: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    // Mock the service — no real HTTP
    serviceSpy = { getAll: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
        // ✅ provideMockActions wires the ReplaySubject as the NgRx Actions stream
        provideMockActions(() => actions$),
        { provide: NotificationService, useValue: serviceSpy },
      ],
    });

    effects   = TestBed.inject(NotificationEffects);
    actions$  = new ReplaySubject<Action>(1);
  });

  // ── Success path ───────────────────────────────────────────────────────────
  it('should dispatch loadSuccess when service resolves', () =>
    new Promise<void>(resolve => {
      const items = [{ id: '1', message: 'Hello' }];

      // ✅ Control what the service returns for this test
      serviceSpy.getAll.mockReturnValue(of(items));

      // Subscribe BEFORE dispatching the trigger action
      effects.loadNotifications$.subscribe(resultAction => {
        // ✅ Verify the output action has the correct shape
        expect(resultAction).toEqual(NotificationActions.loadSuccess({ items }));
        resolve();
      });

      // Push the trigger action into the stream
      actions$.next(NotificationActions.load());
    }));

  // ── Error path ─────────────────────────────────────────────────────────────
  it('should dispatch loadFailure when service throws', () =>
    new Promise<void>(resolve => {
      // ✅ Simulate a network error
      serviceSpy.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      effects.loadNotifications$.subscribe(resultAction => {
        // ✅ catchError must produce a loadFailure action — never let the stream die
        expect(resultAction).toEqual(
          NotificationActions.loadFailure({ error: 'Network error' }),
        );
        resolve();
      });

      actions$.next(NotificationActions.load());
    }));

  // ── exhaustMap behaviour ───────────────────────────────────────────────────
  it('should call service.getAll() exactly once per load action', () =>
    new Promise<void>(resolve => {
      const items = [{ id: '1', message: 'One' }];
      serviceSpy.getAll.mockReturnValue(of(items));

      effects.loadNotifications$.subscribe(() => {
        // ✅ exhaustMap ignores concurrent load actions while one is in flight
        expect(serviceSpy.getAll).toHaveBeenCalledTimes(1);
        resolve();
      });

      actions$.next(NotificationActions.load());
    }));
});
