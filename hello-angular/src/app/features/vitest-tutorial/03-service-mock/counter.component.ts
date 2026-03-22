/**
 * EXAMPLE 03 – Service Mock (Component)
 *
 * This standalone component injects CounterService and delegates all state
 * management to it.  In the test we will replace this service with a mock.
 */
import { Component, inject } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <h2 data-testid="count-value">Count: {{ svc.count() }}</h2>
      @if (svc.isZero()) {
        <p data-testid="zero-label">The counter is at zero!</p>
      }
      <button data-testid="btn-increment" (click)="svc.increment()">+</button>
      <button data-testid="btn-decrement" (click)="svc.decrement()">−</button>
      <button data-testid="btn-reset"      (click)="svc.reset()">Reset</button>
    </div>
  `,
})
export class CounterComponent {
  /** Modern Angular 14+ inject() function – no constructor needed. */
  protected readonly svc = inject(CounterService);
}
