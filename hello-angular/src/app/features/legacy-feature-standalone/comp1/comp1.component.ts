import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-standalone-comp1',
  templateUrl: './comp1.component.html',
  // Explicit Comment: Standalone true, we manage dependencies locally now.
  standalone: true,
  imports: [RouterModule, MatButtonModule]
})
export class Comp1Component {
}
