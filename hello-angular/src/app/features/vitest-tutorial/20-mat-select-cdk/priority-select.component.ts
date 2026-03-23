import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

@Component({
  selector: 'app-priority-select',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <mat-form-field>
      <mat-label>Priority</mat-label>
      <mat-select [formControl]="priorityCtrl" data-testid="priority-select">
        @for (opt of options; track opt.value) {
          <mat-option [value]="opt.value" [attr.data-testid]="'option-' + opt.value">
            {{ opt.label }}
          </mat-option>
        }
      </mat-select>
      @if (priorityCtrl.hasError('required') && priorityCtrl.touched) {
        <mat-error data-testid="priority-error">Priority is required.</mat-error>
      }
    </mat-form-field>
  `,
})
export class PrioritySelectComponent {
  priorityCtrl = new FormControl<Priority | null>(null, Validators.required);

  options: { value: Priority; label: string }[] = [
    { value: 'low',      label: 'Low'      },
    { value: 'medium',   label: 'Medium'   },
    { value: 'high',     label: 'High'     },
    { value: 'critical', label: 'Critical' },
  ];
}
