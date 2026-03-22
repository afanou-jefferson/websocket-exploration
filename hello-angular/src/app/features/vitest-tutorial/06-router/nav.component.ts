/**
 * EXAMPLE 06 – Router Integration
 *
 * A simple nav component that uses the Angular Router.
 * The spec will use provideRouter([]) and RouterTestingHarness to test
 * navigation without a real browser URL bar.
 */
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a
        data-testid="link-home"
        routerLink="/home"
        routerLinkActive="active">
        Home
      </a>
      <a
        data-testid="link-about"
        routerLink="/about"
        routerLinkActive="active">
        About
      </a>
      <button data-testid="btn-dashboard" (click)="goToDashboard()">
        Dashboard
      </button>
    </nav>
    <p data-testid="current-url">Current URL: {{ currentUrl() }}</p>
  `,
})
export class NavComponent {
  private router = inject(Router);

  currentUrl(): string {
    return this.router.url;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
