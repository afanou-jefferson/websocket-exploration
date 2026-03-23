import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm</h2>
    <mat-dialog-content>
      <p data-testid="dialog-message">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button data-testid="btn-cancel" mat-button (click)="close(false)">Cancel</button>
      <button data-testid="btn-confirm" mat-raised-button color="warn" (click)="close(true)">
        Confirm
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  readonly data   = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
