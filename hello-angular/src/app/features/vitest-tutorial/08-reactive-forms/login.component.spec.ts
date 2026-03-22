/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 08 – Reactive Forms
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Reactive forms are plain JavaScript objects – most of the logic can be
 *   tested by interacting with the FormGroup directly (not through the DOM).
 *   Test the DOM only when you need to verify UX (error message visibility,
 *   disabled state, etc.).
 *
 * PATTERNS COVERED:
 *   - Testing form validity via form.valid / form.invalid
 *   - setValue() vs patchValue() – when to use each
 *   - Triggering touched state with control.markAsTouched()
 *   - Asserting error messages appear in the DOM
 *   - Testing the submit output with a vi.fn() listener
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent, LoginPayload } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Initial state ──────────────────────────────────────────────────────────
  it('should create with an invalid form initially', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should have an invalid email control initially', () => {
    expect(component.email.hasError('required')).toBe(true);
  });

  // ── Form control validation (via FormGroup API) ────────────────────────────
  describe('email control', () => {
    it('should be invalid with a non-email string', () => {
      // ✅ PATTERN: use setValue on the individual control, not the full form.
      component.email.setValue('not-an-email');
      expect(component.email.hasError('email')).toBe(true);
    });

    it('should be valid with a proper email address', () => {
      component.email.setValue('alice@example.com');
      expect(component.email.valid).toBe(true);
    });
  });

  describe('password control', () => {
    it('should be invalid when fewer than 8 characters', () => {
      component.password.setValue('short');
      expect(component.password.hasError('minlength')).toBe(true);
    });

    it('should be valid with 8 or more characters', () => {
      component.password.setValue('securePassword!');
      expect(component.password.valid).toBe(true);
    });
  });

  describe('whole form', () => {
    it('should become valid when both fields are correctly filled', () => {
      // ✅ PATTERN: setValue on the FormGroup sets ALL controls at once.
      component.form.setValue({ email: 'alice@example.com', password: 'securePassword!' });
      expect(component.form.valid).toBe(true);
    });
  });

  // ── DOM-level tests (error messages) ──────────────────────────────────────
  describe('error messages in the DOM', () => {
    it('should show email error when email is touched and empty', () => {
      // ✅ PATTERN: markAsTouched() triggers the *ngIf / @if guard in the template.
      component.email.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="email-error"]');
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain('Email is required.');
    });

    it('should show format error for invalid email', () => {
      component.email.setValue('bad-email');
      component.email.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="email-error"]');
      expect(errorEl.textContent).toContain('valid email');
    });

    it('should show password error when password is touched and too short', () => {
      component.password.setValue('abc');
      component.password.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="password-error"]');
      expect(errorEl).toBeTruthy();
    });

    it('should disable the submit button when form is invalid', () => {
      const btn = fixture.nativeElement.querySelector('[data-testid="btn-submit"]');
      expect(btn.disabled).toBe(true);
    });

    it('should enable the submit button when form is valid', () => {
      component.form.setValue({ email: 'alice@example.com', password: 'securePassword!' });
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('[data-testid="btn-submit"]');
      expect(btn.disabled).toBe(false);
    });
  });

  // ── Submit output ──────────────────────────────────────────────────────────
  describe('form submission', () => {
    it('should emit the LoginPayload when the form is valid and submitted', () => {
      // ✅ PATTERN: subscribe to an output() signal using vi.fn() as the listener.
      // Note: vi.fn() with no generics works fine for capturing calls.
      const submitSpy = vi.fn<(payload: LoginPayload) => void>();
      component.submitted.subscribe(submitSpy);

      component.form.setValue({ email: 'alice@example.com', password: 'myP@ssw0rd' });
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector('[data-testid="login-form"]');
      form.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(submitSpy).toHaveBeenCalledOnce();
      expect(submitSpy).toHaveBeenCalledWith({
        email:    'alice@example.com',
        password: 'myP@ssw0rd',
      });
    });

    it('should NOT emit when the form is invalid', () => {
      const submitSpy = vi.fn();
      component.submitted.subscribe(submitSpy);

      // Form is still invalid (empty fields).
      component.onSubmit();

      expect(submitSpy).not.toHaveBeenCalled();
    });
  });
});
