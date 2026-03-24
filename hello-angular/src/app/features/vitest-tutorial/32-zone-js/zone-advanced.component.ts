import { Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zone-advanced',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="zone-tutorial-container">
      <h2>32 — Zone.js Advanced Testing</h2>
      
      <div class="stats-board">
        <p data-testid="counter">Counter: <strong>{{ counter }}</strong></p>
        <p data-testid="status">Status: 
          <span [class.running]="isRunning" [class.stopped]="!isRunning">
            {{ isRunning ? 'Running' : 'Stopped' }}
          </span>
        </p>
      </div>
      
      <div class="actions">
        <button data-testid="start-btn" (click)="startTimer()" [disabled]="isRunning">Start Interval (1s)</button>
        <button data-testid="stop-btn" (click)="stopTimer()" [disabled]="!isRunning">Stop</button>
        <button data-testid="async-btn" (click)="runNestedAsync()">Nested Async (+10)</button>
        <button data-testid="outside-btn" (click)="runOutsideZone()">Run Outside Zone (No Auto CD)</button>
        <button data-testid="reset-btn" (click)="reset()">Reset</button>
      </div>

      <div class="note">
        <p>This component demonstrates how <code>zone.js</code> tracks macro-tasks and how it behaves when tasks are explicitly escaped from the Angular Zone.</p>
      </div>
    </div>
  `,
  styles: [`
    .zone-tutorial-container { padding: 1rem; border: 1px solid #ccc; border-radius: 8px; max-width: 400px; }
    .stats-board { background: #f0f0f0; padding: 0.5rem; border-radius: 4px; margin-bottom: 1rem; }
    .running { color: green; font-weight: bold; }
    .stopped { color: red; font-weight: bold; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    button { padding: 0.5rem; cursor: pointer; }
    button:disabled { cursor: not-allowed; opacity: 0.5; }
    .note { margin-top: 1rem; font-size: 0.9rem; color: #666; font-style: italic; }
  `]
})
export class ZoneAdvancedComponent {
  private ngZone = inject(NgZone);
  
  counter = 0;
  isRunning = false;
  private intervalId: any = null;

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.counter++;
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  reset() {
    this.stopTimer();
    this.counter = 0;
  }

  runNestedAsync() {
    // schedules macro-task 1
    setTimeout(() => {
      this.counter += 5;
      // schedules macro-task 2 inside task 1
      setTimeout(() => {
        this.counter += 5;
      }, 500);
    }, 500);
  }

  runOutsideZone() {
    // This escape the Angular Zone. Zone.js still sees it, 
    // but it won't trigger Angular CD because CD is hooked to the Angular Zone finish.
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // State changes, but DOM won't reflect it until next CD cycle
        this.counter++;
      }, 100);
    });
  }
}
