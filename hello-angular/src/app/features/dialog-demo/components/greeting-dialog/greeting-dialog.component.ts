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
  styleUrls: ['./greeting-dialog.component.scss']
})
export class GreetingDialogComponent {
  // 🔑 La modale reçoit l'instance du service 'DialogDemoService' via 'MAT_DIALOG_DATA'.
  // Comme les deux composants partagent la même référence mémoire, toute modification
  // du Signal ici est immédiatement répercutée sur l'interface du parent.
  protected service = inject<DialogDemoService>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<GreetingDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
