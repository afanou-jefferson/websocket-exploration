import { Component } from '@angular/core';

@Component({
  selector: 'app-legacy-timer',
  standalone: true,
  template: `
    <div>
      <h3>Legacy Timer (Zone-based)</h3>
      <p>Counter: <span id="counter">{{ counter }}</span></p>
      <button (click)="startTimer()">Start Timer (1s delay)</button>
    </div>
  `,
  styles: [`
    h3 { color: #d32f2f; }
    #counter { font-weight: bold; font-size: 1.2rem; }
  `]
})
export class LegacyTimerComponent {
  counter = 0;

  startTimer() {
    // This uses standard setTimeout, which relies on Zone.js 
    // to trigger change detection automatically when the callback finishes.
    setTimeout(() => {
      this.counter++;
    }, 1000);
  }
}
