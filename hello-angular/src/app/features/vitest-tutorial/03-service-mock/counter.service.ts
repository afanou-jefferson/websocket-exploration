/**
 * EXAMPLE 03 – Service Mock
 *
 * An Angular injectable service that manages a counter using signals.
 * The component that consumes this service (counter.component.ts) will be
 * tested with a *mocked* version of this service, demonstrating how to
 * isolate a component from its dependencies with vi.fn().
 */
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private _count = signal(0);

  /** Public read-only signal exposed to consumers. */
  readonly count = this._count.asReadonly();

  /** Derived signal: true when counter is at zero. */
  readonly isZero = computed(() => this._count() === 0);

  increment(): void {
    this._count.update((n) => n + 1);
  }

  decrement(): void {
    this._count.update((n) => n - 1);
  }

  reset(): void {
    this._count.set(0);
  }
}
