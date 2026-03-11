import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-old-parent-real-store',
  standalone: false,
  template: `<h3>Old Real Store: {{ (state$ | async)?.value }}</h3>`
})
export class OldParentRealStoreComponent {
  state$: Observable<any>;
  constructor(private store: Store<any>) {
    this.state$ = this.store.select('oldFeature');
  }
}
