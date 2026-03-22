/**
 * EXAMPLE 04 – Child Component Mock (Badge)
 *
 * A standalone child component that renders a coloured badge.
 * In the parent's test (dashboard.component.spec.ts) this whole component
 * will be replaced by an inline stub so the parent can be tested in isolation.
 */
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge" [attr.data-status]="status()">
      {{ label() }}
    </span>
  `,
  styles: [`.badge { padding: 4px 8px; border-radius: 4px; }`],
})
export class BadgeComponent {
  label = input<string>('');
  status = input<'active' | 'inactive' | 'pending'>('pending');
}
