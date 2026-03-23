import { Component } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-live-clock',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  template: `
    <div data-testid="clock-display">
      {{ (tick$ | async) | date: 'HH:mm:ss' }}
    </div>
    @if (count$ | async; as count) {
      <span data-testid="tick-count">Tick: {{ count }}</span>
    }
  `,
})
export class LiveClockComponent {
  // Emits a date every second (take(5) limits for demo)
  readonly tick$ = interval(1000).pipe(
    take(5),
    map(() => new Date()),
  );

  // A simple incrementing counter shown via async pipe
  readonly count$: Observable<number> = interval(1000).pipe(
    take(5),
    map((_, i) => i + 1),
  );
}
