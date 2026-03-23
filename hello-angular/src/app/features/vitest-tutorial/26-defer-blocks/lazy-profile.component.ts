import { Component } from '@angular/core';

@Component({
  selector: 'app-lazy-profile',
  standalone: true,
  template: `
    @defer {
      <div data-testid="profile-content">
        <h2 data-testid="profile-name">Alice Johnson</h2>
        <p data-testid="profile-bio">Senior Angular Developer</p>
      </div>
    } @placeholder {
      <div data-testid="placeholder">Loading profile…</div>
    } @loading {
      <div data-testid="loading-spinner">Please wait…</div>
    } @error {
      <div data-testid="error-msg">Failed to load profile.</div>
    }
  `,
})
export class LazyProfileComponent {}
