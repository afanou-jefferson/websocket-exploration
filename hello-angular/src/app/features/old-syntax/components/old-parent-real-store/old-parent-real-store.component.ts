import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OldSyntaxDialogService } from '../../old-syntax-dialog.service';
import { OldSyntaxDialogComponent } from '../old-syntax-dialog/old-syntax-dialog.component';

@Component({
  selector: 'app-old-parent-real-store',
  standalone: false,
  template: `
    <div class="container">
      <h3>Old Real Store: {{ (state$ | async)?.value }}</h3>

      <div class="signal-box">
        <span class="signal-label">dialogService.value()</span>
        <span class="signal-value">{{ dialogService.value() || '(empty — open dialog)' }}</span>
      </div>

      <button mat-raised-button color="accent" (click)="openDialog()">Open Dialog</button>
    </div>
  `,
  styleUrls: ['./old-parent-real-store.component.scss']
})
export class OldParentRealStoreComponent {
  state$: Observable<any>;

  // 🔑 Injected from the MODULE injector (declared in OldSyntaxModule.providers).
  //    All components in this module share the exact same instance.
  protected dialogService = inject(OldSyntaxDialogService);
  private dialog = inject(MatDialog);

  constructor(private store: Store<any>) {
    this.state$ = this.store.select('oldFeature');
  }

  openDialog(): void {
    // Pass the module-level service instance — same approach as dialog-demo.
    this.dialog.open(OldSyntaxDialogComponent, {
      width: '420px',
      data: this.dialogService
    });
  }
}
