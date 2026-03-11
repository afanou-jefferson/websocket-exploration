import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, delay } from 'rxjs/operators';
import { loadText, setText } from './text.reducer';

@Injectable()
export class TextEffects {
  private actions$ = inject(Actions);

  loadText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadText),
      delay(2000), // Simulate API call
      map(() => setText({ text: 'Title from Simulated API via Effect!' }))
    );
  });
}
