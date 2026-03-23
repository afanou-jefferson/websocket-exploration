import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-notifier',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
  template: `
    <button data-testid="btn-save" mat-raised-button (click)="save()">
      Save
    </button>
  `,
})
export class NotifierComponent {
  private http     = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  save(): void {
    this.http.post('/api/save', {}).pipe(
      catchError(() => {
        this.snackBar.open('Save failed. Please try again.', 'Dismiss', { duration: 4000 });
        return EMPTY;
      }),
    ).subscribe(() => {
      this.snackBar.open('Saved successfully!', 'Close', { duration: 3000 });
    });
  }
}
