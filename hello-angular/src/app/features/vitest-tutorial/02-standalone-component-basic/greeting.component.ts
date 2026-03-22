/**
 * EXAMPLE 02 – Standalone Component (Basic)
 *
 * A minimal standalone component that:
 *   - uses `input()` (the signal-based @Input replacement, Angular 17+)
 *   - uses `computed()` to derive data
 *
 * This example shows how to test a component in pure isolation:
 *   no services, no router, no store.
 */
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  standalone: true,
  template: `
    <section class="greeting-card">
      <h1 data-testid="greeting-title">{{ fullGreeting() }}</h1>
      <p data-testid="greeting-sub">Welcome to the Vitest + Angular tutorial!</p>
    </section>
  `,
})
export class GreetingComponent {
  /** Signal-based input (Angular 17+).  No decorator needed. */
  name = input<string>('World');

  /** Computed value – recalculates whenever `name` changes. */
  fullGreeting = computed(() => `Hello, ${this.name()}! 👋`);
}
