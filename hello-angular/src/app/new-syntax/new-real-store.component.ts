import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-real-store',
  standalone: false,
  template: `<h3>New Real Store: {{ (state$ | async)?.value }}</h3>`
})
export class NewRealStoreComponent {
  state$: Observable<any>;
  constructor(private store: Store<any>) {
    this.state$ = this.store.select('newFeature');
  }
}
