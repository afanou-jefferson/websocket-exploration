/**
 * EXAMPLE 04 – Child Component Mock (Dashboard / Parent)
 *
 * This parent component owns a list of users and renders a BadgeComponent
 * for each one.  The test will replace <app-badge> with an inline stub so
 * that the parent's own logic can be verified without spinning up the real
 * badge implementation.
 */
import { Component, signal } from '@angular/core';
import { BadgeComponent } from './badge.component';

export interface User {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <section>
      <h2 data-testid="dashboard-title">User Dashboard</h2>
      <ul>
        @for (user of users(); track user.id) {
          <li data-testid="user-row">
            <span data-testid="user-name">{{ user.name }}</span>
            <app-badge [label]="user.status" [status]="user.status" />
          </li>
        }
      </ul>
      @if (users().length === 0) {
        <p data-testid="empty-msg">No users found.</p>
      }
    </section>
  `,
})
export class DashboardComponent {
  users = signal<User[]>([
    { id: 1, name: 'Alice', status: 'active' },
    { id: 2, name: 'Bob',   status: 'inactive' },
  ]);
}
