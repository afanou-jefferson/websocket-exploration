import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-shallow-parent',
  standalone: false,
  template: `
    <h3>Shallow Parent Store: {{ (state$ | async)?.value }}</h3>
    <app-new-child [stateValue]="(state$ | async)?.value"></app-new-child>
  `
})
export class NewShallowParentComponent {
  state$: Observable<any>;
  constructor(private store: Store<any>) {
    this.state$ = this.store.select('newFeature');
  }
}
