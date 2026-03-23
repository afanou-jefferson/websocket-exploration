import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface Notification {
  id: string;
  message: string;
}

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ items: Notification[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
