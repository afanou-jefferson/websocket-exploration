import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OldSyntaxDialogService } from '../../old-syntax-dialog.service';

@Component({
  selector: 'app-old-syntax-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Set the Module-Level Signal</h2>

    <mat-dialog-content>
      <p class="hint">
        This dialog received the <strong>module-level</strong>
        <code>OldSyntaxDialogService</code> instance via <code>MAT_DIALOG_DATA</code>.
        The service is provided by <code>OldSyntaxModule</code> — all components
        in this module share the same bean.
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
    .hint { color: #666; font-size: 0.875rem; margin-bottom: 16px; }
    .preview { font-size: 0.875rem; color: #3f51b5; margin-top: 4px; }
  `]
})
export class OldSyntaxDialogComponent {
  // The component receives the module-level service instance via MAT_DIALOG_DATA,
  // so it shares the same signal as OldParentRealStoreComponent.
  protected service = inject<OldSyntaxDialogService>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<OldSyntaxDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
