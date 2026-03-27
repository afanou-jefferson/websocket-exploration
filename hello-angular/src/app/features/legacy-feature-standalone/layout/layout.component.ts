import { Component } from '@angular/core';
// Explicit Comment: In the standalone approach, we must directly import the modules/components needed by the template.
// Here we need RouterModule for <router-outlet> and routerLink, and MatButtonModule for buttons.
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-standalone-layout',
  templateUrl: './layout.component.html',
  // Explicit Comment: Setting standalone to true is the key here. It removes the need for an NgModule.
  standalone: true,
  imports: [RouterModule, MatButtonModule]
})
export class LayoutComponent {
}
