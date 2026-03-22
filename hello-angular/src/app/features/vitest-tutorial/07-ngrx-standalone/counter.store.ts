/**
 * EXAMPLE 07 – NgRx Standalone (modern syntax)
 *
 * Uses createFeature() + createReducer() (Angular 15+ / NgRx 15+ pattern).
 * The spec will use provideMockStore() and override selectors so the
 * component can be tested without a real NgRx store.
 */
import { createFeature, createReducer, createSelector, on, createAction, props } from '@ngrx/store';

// ── Actions ──────────────────────────────────────────────────────────────────
export const CounterActions = {
  increment: createAction('[Counter] Increment'),
  decrement: createAction('[Counter] Decrement'),
  reset:     createAction('[Counter] Reset'),
  setTarget: createAction('[Counter] Set Target', props<{ target: number }>()),
};

// ── State ─────────────────────────────────────────────────────────────────────
export interface CounterState {
  count: number;
  target: number;
}

const initialState: CounterState = { count: 0, target: 10 };

// ── Feature (createFeature replaces createReducer + separate selectors) ───────
export const counterFeature = createFeature({
  name: 'counter',
  reducer: createReducer(
    initialState,
    on(CounterActions.increment, (state) => ({ ...state, count: state.count + 1 })),
    on(CounterActions.decrement, (state) => ({ ...state, count: state.count - 1 })),
    on(CounterActions.reset,     (state) => ({ ...state, count: 0 })),
    on(CounterActions.setTarget, (state, { target }) => ({ ...state, target })),
  ),
});

/**
 * createFeature auto-generates selectors:
 *   counterFeature.selectCount
 *   counterFeature.selectTarget
 *   counterFeature.selectCounterState
 */

// Extra derived selector – how far from the target?
export const selectProgress = createSelector(
  counterFeature.selectCount,
  counterFeature.selectTarget,
  (count, target) => Math.min(Math.round((count / target) * 100), 100),
);
