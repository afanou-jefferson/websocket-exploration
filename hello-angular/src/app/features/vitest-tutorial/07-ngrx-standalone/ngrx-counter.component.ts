/**
 * EXAMPLE 07 – NgRx Standalone (Component)
 *
 * Standalone component that uses the store via the inject() pattern and
 * the auto-generated selectors from createFeature.
 */
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CounterActions, counterFeature, selectProgress } from './counter.store';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ngrx-counter',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="ngrx-counter">
      <h2 data-testid="count-display">Count: {{ count$ | async }}</h2>
      <p data-testid="progress">Progress towards target: {{ progress$ | async }}%</p>
      <button data-testid="btn-inc" (click)="increment()">+</button>
      <button data-testid="btn-dec" (click)="decrement()">−</button>
      <button data-testid="btn-reset" (click)="reset()">Reset</button>
    </div>
  `,
})
export class NgrxCounterComponent {
  private store = inject(Store);

  count$    = this.store.select(counterFeature.selectCount);
  progress$ = this.store.select(selectProgress);

  increment(): void { this.store.dispatch(CounterActions.increment()); }
  decrement(): void { this.store.dispatch(CounterActions.decrement()); }
  reset():     void { this.store.dispatch(CounterActions.reset()); }
}
