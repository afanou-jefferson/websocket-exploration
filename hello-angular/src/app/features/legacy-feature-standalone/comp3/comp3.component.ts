import { Component } from '@angular/core';

@Component({
  selector: 'app-standalone-comp3',
  templateUrl: './comp3.component.html',
  // Explicit Comment: Standalone true. As this template doesn't use routerLink or Material buttons yet, no imports array is needed.
  standalone: true
})
export class Comp3Component {
}
