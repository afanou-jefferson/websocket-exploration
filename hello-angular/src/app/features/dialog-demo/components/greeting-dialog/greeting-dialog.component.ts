import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDemoService } from '../../dialog-demo.service';

@Component({
  selector: 'app-greeting-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Set the Signal Value</h2>

    <mat-dialog-content>
      <p class="hint">
        Type below — the parent component's signal updates <strong>live</strong>
        because this dialog received the same service instance.
      </p>

      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Signal value</mat-label>
        <input
          matInput
          [value]="service.value()"
          (input)="service.value.set($any($event.target).value)"
          placeholder="Type something…">
      </mat-form-field>

      <p class="preview">Current signal: <strong>{{ service.value() || '(empty)' }}</strong></p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .hint { color: #666; font-size: 0.9rem; margin-bottom: 16px; }
    .preview { font-size: 0.9rem; color: #3f51b5; margin-top: 4px; }
  `]
})
export class GreetingDialogComponent {
  // The dialog receives the DialogDemoService *instance* via MAT_DIALOG_DATA.
  // Both the parent component and this dialog share the exact same object reference,
  // so mutating the signal here is immediately visible in the parent.
  protected service = inject<DialogDemoService>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<GreetingDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
