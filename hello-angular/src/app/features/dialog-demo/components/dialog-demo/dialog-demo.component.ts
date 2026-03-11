import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GreetingDialogComponent } from '../greeting-dialog/greeting-dialog.component';
import { DialogDemoService } from '../../dialog-demo.service';

@Component({
  selector: 'app-dialog-demo',
  standalone: false,
  // 🔑 The service is scoped to THIS component's injector.
  // Every child (including the dialog when we pass the instance)
  // will reference the same object in memory.
  providers: [DialogDemoService],
  template: `
    <div class="dialog-demo-container">
      <h2>MatDialog + Service Signal Demo</h2>

      <p class="subtitle">
        Open the dialog and type a value — it will update the signal below in real time,
        because the dialog receives the <strong>same service instance</strong> via
        <code>MAT_DIALOG_DATA</code>.
      </p>

      <div class="signal-box">
        <span class="signal-label">service.value()</span>
        <span class="signal-value">{{ service.value() || '(empty — open the dialog)' }}</span>
      </div>

      <button mat-raised-button color="primary" (click)="openDialog()">
        Open Dialog
      </button>
    </div>
  `,
  styles: [`
    .dialog-demo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 24px;
      gap: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    h2 { margin: 0; }
    .subtitle { color: #666; text-align: center; }
    .signal-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px 28px;
      gap: 6px;
      min-width: 300px;
    }
    .signal-label { font-size: 0.75rem; color: #999; font-family: monospace; }
    .signal-value { font-size: 1.25rem; font-weight: 500; color: #3f51b5; }
  `]
})
export class DialogDemoComponent {
  protected service = inject(DialogDemoService);
  private dialog = inject(MatDialog);

  openDialog(): void {
    // In this version of Angular Material, MatDialogConfig does not have a 'providers' option.
    // The idiomatic way to share a reactive service instance with a dialog is to pass it
    // as 'data' — the dialog injects it via MAT_DIALOG_DATA.
    // This preserves full reactivity: both sides share the same object reference in memory.
    this.dialog.open(GreetingDialogComponent, {
      width: '420px',
      data: this.service
    });
  }
}
