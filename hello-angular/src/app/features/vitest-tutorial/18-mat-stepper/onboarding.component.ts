import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { output } from '@angular/core';

export interface OnboardingPayload {
  name: string;
  email: string;
  plan: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [MatStepperModule, MatInputModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <mat-stepper [linear]="true" data-testid="stepper">

      <!-- Step 1: Identity -->
      <mat-step [stepControl]="identityForm" label="Identity">
        <form [formGroup]="identityForm">
          <mat-form-field>
            <input matInput formControlName="name" placeholder="Full name" data-testid="name-input" />
          </mat-form-field>
          <button mat-button matStepperNext data-testid="step1-next" [disabled]="identityForm.invalid">
            Next
          </button>
        </form>
      </mat-step>

      <!-- Step 2: Contact -->
      <mat-step [stepControl]="contactForm" label="Contact">
        <form [formGroup]="contactForm">
          <mat-form-field>
            <input matInput formControlName="email" placeholder="Email" data-testid="email-input" />
          </mat-form-field>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button matStepperNext data-testid="step2-next" [disabled]="contactForm.invalid">
            Next
          </button>
        </form>
      </mat-step>

      <!-- Step 3: Plan -->
      <mat-step label="Plan">
        <div>
          <button data-testid="plan-starter" mat-button (click)="selectPlan('starter')">Starter</button>
          <button data-testid="plan-pro"     mat-button (click)="selectPlan('pro')">Pro</button>
        </div>
        <button mat-raised-button color="primary" (click)="submit()" data-testid="btn-submit">
          Finish
        </button>
      </mat-step>

    </mat-stepper>
  `,
})
export class OnboardingComponent {
  readonly submitted = output<OnboardingPayload>();
  private fb = new FormBuilder().nonNullable;

  identityForm = this.fb.group({ name: ['', Validators.required] });
  contactForm  = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  plan = '';

  selectPlan(plan: string) { this.plan = plan; }

  submit() {
    if (this.identityForm.valid && this.contactForm.valid && this.plan) {
      this.submitted.emit({
        name:  this.identityForm.value.name!,
        email: this.contactForm.value.email!,
        plan:  this.plan,
      });
    }
  }
}
