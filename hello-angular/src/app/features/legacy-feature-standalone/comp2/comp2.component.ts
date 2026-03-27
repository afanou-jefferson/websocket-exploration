import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-standalone-comp2',
  templateUrl: './comp2.component.html',
  // Explicit Comment: Same here, standalone component managing its own routing links and material buttons.
  standalone: true,
  imports: [RouterModule, MatButtonModule]
})
export class Comp2Component {
}
