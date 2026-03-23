import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-dialog-trigger',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <button data-testid="open-btn" mat-raised-button (click)="openDialog()">
      Delete item
    </button>
    
    @if (confirmed()) {
      <p data-testid="result-msg">Item deleted!</p>
    }
    
    @if (confirmed() === false) {
      <p data-testid="cancel-msg">Cancelled.</p>
    }
  `,
})
export class DialogTriggerComponent {
  private dialog = inject(MatDialog);
  
  // ✅ Use a signal for robust change detection in tests
  readonly confirmed = signal<boolean | null>(null);

  openDialog(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    ref.afterClosed().subscribe((result: boolean | undefined) => {
      // ✅ result can be undefined if dialog is dismissed (e.g. Backdrop click)
      this.confirmed.set(result ?? false);
    });
  }
}
