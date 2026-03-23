import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createActionGroup, props } from '@ngrx/store';

export const SearchActions = createActionGroup({
  source: 'Search',
  events: { 'Execute': props<{ query: string }>() },
});

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" data-testid="search-form">
      <mat-form-field>
        <input matInput formControlName="query" placeholder="Search…" data-testid="search-input" />
      </mat-form-field>
      <button
        mat-raised-button type="submit"
        [disabled]="form.invalid"
        data-testid="search-btn">
        Search
      </button>
    </form>
  `,
})
export class SearchBarComponent {
  private store = inject(Store);
  private fb    = new FormBuilder().nonNullable;

  form = this.fb.group({ query: ['', [Validators.required, Validators.minLength(2)]] });

  onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(SearchActions.execute({ query: this.form.value.query! }));
      this.form.reset();
    }
  }
}
