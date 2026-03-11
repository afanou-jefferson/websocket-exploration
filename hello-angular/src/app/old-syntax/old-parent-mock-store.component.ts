import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-old-parent-mock-store',
  standalone: false,
  template: `<h3>Old Mock Store: {{ (state$ | async)?.value }}</h3>`
})
export class OldParentMockStoreComponent {
  state$: Observable<any>;
  constructor(private store: Store<any>) {
    this.state$ = this.store.select('oldFeature');
  }
}
