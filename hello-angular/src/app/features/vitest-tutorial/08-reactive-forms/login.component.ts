/**
 * EXAMPLE 08 – Reactive Forms
 *
 * A login form component using ReactiveFormsModule and Validators.
 * The spec will test form validity, error messages, and form submission.
 */
import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface LoginPayload {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" data-testid="login-form">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          data-testid="input-email"
        />
        @if (email.invalid && email.touched) {
          <span data-testid="email-error">
            {{ emailErrorMessage }}
          </span>
        }
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          data-testid="input-password"
        />
        @if (password.invalid && password.touched) {
          <span data-testid="password-error">
            Password must be at least 8 characters.
          </span>
        }
      </div>

      <button type="submit" data-testid="btn-submit" [disabled]="form.invalid">
        Log In
      </button>
    </form>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  /** Emits when the form is validly submitted. */
  submitted = output<LoginPayload>();

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get email()    { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  get emailErrorMessage(): string {
    if (this.email.hasError('required')) return 'Email is required.';
    if (this.email.hasError('email'))    return 'Please enter a valid email address.';
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value as LoginPayload);
    }
  }
}
