import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadText } from '../../../store/text.reducer';

@Component({
  selector: 'app-title',
  standalone: false,
  template: `
    <div class="title-container">
      <h2>{{ text$ | async }}</h2>
      <mat-tab-group>
        <mat-tab label="Overview">
          <p class="tab-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </mat-tab>
        <mat-tab label="Details">
          <p class="tab-content">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .title-container { padding: 0 20px 20px 20px; }
    h2 { text-align: center; color: #3f51b5; margin-top: 20px; }
    .tab-content { padding: 16px; color: #555; }
  `]
})
export class TitleComponent implements OnInit {
  text$: Observable<string>;

  constructor(private store: Store<{ text: string }>) {
    this.text$ = this.store.select('text');
  }

  ngOnInit() {
    this.store.dispatch(loadText());
  }
}
