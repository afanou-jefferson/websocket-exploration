import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationActions } from './notification.actions';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationEffects {
  private readonly actions$ = inject(Actions);
  private readonly service  = inject(NotificationService);

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.load),
      exhaustMap(() =>
        this.service.getAll().pipe(
          map(items => NotificationActions.loadSuccess({ items })),
          catchError(err => of(NotificationActions.loadFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}
