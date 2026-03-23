import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { routerFeature } from './router-state.feature';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav data-testid="breadcrumb">
      @if (url()) {
        <span data-testid="current-url">{{ url() }}</span>
      }
      @if (userId()) {
        <span data-testid="user-id">User: {{ userId() }}</span>
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  private store = inject(Store);

  // Read router state via @ngrx/router-store selectors
  url    = this.store.selectSignal(routerFeature.selectUrl);
  userId = this.store.selectSignal(routerFeature.selectUserId);
}
