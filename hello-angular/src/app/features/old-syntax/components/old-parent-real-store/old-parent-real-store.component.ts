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
  styles: [`
    .container { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px; }
    .signal-box {
      display: flex; flex-direction: column; align-items: center;
      background: #f5f5f5; border-radius: 8px; padding: 12px 24px; gap: 4px; min-width: 280px;
    }
    .signal-label { font-size: 0.75rem; color: #999; font-family: monospace; }
    .signal-value { font-size: 1.1rem; font-weight: 500; color: #3f51b5; }
  `]
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
