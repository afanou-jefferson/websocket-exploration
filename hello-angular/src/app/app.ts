import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LegacyTimerComponent } from './features/old-syntax/components/legacy-timer/legacy-timer.component';
import { ZoneAdvancedComponent } from './features/vitest-tutorial/32-zone-js/zone-advanced.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    LegacyTimerComponent,
    ZoneAdvancedComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly greeting = signal('');
}
