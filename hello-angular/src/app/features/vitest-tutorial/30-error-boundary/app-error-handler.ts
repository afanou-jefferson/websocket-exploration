import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { createActionGroup, props } from '@ngrx/store';

export const AppErrorActions = createActionGroup({
  source: 'App Error',
  events: { 'Unhandled Error': props<{ message: string; stack?: string }>() },
});

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private store = inject(Store);

  handleError(error: unknown): void {
    console.error('[AppErrorHandler]', error);

    const message = error instanceof Error ? error.message : String(error);
    const stack   = error instanceof Error ? error.stack   : undefined;

    this.store.dispatch(AppErrorActions.unhandledError({ message, stack }));
  }
}
