import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { createActionGroup, props } from '@ngrx/store';
import { ConfirmDialogComponent } from '../15-mat-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';

export const ItemActions = createActionGroup({
  source: 'Item',
  events: { Delete: props<{ id: string }>() },
});

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <button
      mat-raised-button color="warn"
      (click)="confirmDelete()"
      data-testid="delete-btn">
      Delete
    </button>
  `,
})
export class DeleteButtonComponent {
  itemId = input.required<string>();

  private dialog = inject(MatDialog);
  private store  = inject(Store);

  confirmDelete(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete item ${this.itemId()}?` },
    });
    ref.afterClosed().pipe(
      filter(Boolean),  // only proceed if user confirmed
    ).subscribe(() => {
      this.store.dispatch(ItemActions.delete({ id: this.itemId() }));
    });
  }
}
