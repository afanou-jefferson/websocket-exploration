import { createAction, createReducer, on, props } from '@ngrx/store';

export const setOldValue = createAction('[Old] Set Value', props<{ value: string }>());

export const oldSyntaxReducer = createReducer(
  { value: 'Initial Old Value' },
  on(setOldValue, (state, { value }) => ({ ...state, value }))
);
