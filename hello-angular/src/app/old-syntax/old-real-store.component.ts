import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-old-real-store',
  standalone: false,
  template: `<h3>Old Real Store: {{ (state$ | async)?.value }}</h3>`
})
export class OldRealStoreComponent {
  state$: Observable<any>;
  constructor(private store: Store<any>) {
    this.state$ = this.store.select('oldFeature');
  }
}
