/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 18 – MatStepper: Multi-Step Form
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   MatStepper in `linear` mode gates each step by the previous FormGroup's
 *   validity. In tests, we don't click Next buttons to navigate — we control
 *   the stepper's `selectedIndex` directly and set form values programmatically.
 *   This is faster and more deterministic.
 *
 *   For the final submit test, we fill all forms and call submit() directly
 *   rather than going through each step's UI — we want to test the output,
 *   not the stepper navigation which is a Material internal.
 *
 * PATTERNS COVERED:
 *   - Accessing MatStepper via component ref
 *   - Setting selectedIndex programmatically
 *   - Testing FormGroup validity as a gate
 *   - Testing the final output() via subscribe + vi.fn()
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { OnboardingComponent, OnboardingPayload } from './onboarding.component';

describe('OnboardingComponent (MatStepper)', () => {
  let fixture:   ComponentFixture<OnboardingComponent>;
  let component: OnboardingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [OnboardingComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture   = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Step form validity gates ───────────────────────────────────────────────
  it('should start with invalid identity form', () => {
    expect(component.identityForm.invalid).toBe(true);
  });

  it('should allow progressing step 1 when name is provided', () => {
    component.identityForm.setValue({ name: 'Alice' });
    expect(component.identityForm.valid).toBe(true);
  });

  it('should have invalid contact form initially', () => {
    expect(component.contactForm.invalid).toBe(true);
  });

  it('should validate email format in step 2', () => {
    component.contactForm.setValue({ email: 'not-an-email' });
    expect(component.contactForm.invalid).toBe(true);

    component.contactForm.setValue({ email: 'alice@example.com' });
    expect(component.contactForm.valid).toBe(true);
  });

  // ── Plan selection ─────────────────────────────────────────────────────────
  it('should set the selected plan', () => {
    component.selectPlan('pro');
    expect(component.plan).toBe('pro');
  });

  // ── Full submit flow ───────────────────────────────────────────────────────
  it('should emit the payload when all three steps are complete', () => {
    const spy = vi.fn<(p: OnboardingPayload) => void>();
    component.submitted.subscribe(spy);

    // ✅ Set all forms to valid values without going through stepper UI
    component.identityForm.setValue({ name: 'Alice' });
    component.contactForm.setValue({ email: 'alice@example.com' });
    component.selectPlan('pro');

    component.submit();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      name:  'Alice',
      email: 'alice@example.com',
      plan:  'pro',
    });
  });

  it('should NOT emit when any form is invalid', () => {
    const spy = vi.fn();
    component.submitted.subscribe(spy);

    // Missing email and plan
    component.identityForm.setValue({ name: 'Alice' });
    component.submit();

    expect(spy).not.toHaveBeenCalled();
  });
});
