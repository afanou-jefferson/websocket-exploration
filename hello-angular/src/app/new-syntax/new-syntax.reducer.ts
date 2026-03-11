import { createAction, createReducer, on, props } from '@ngrx/store';

export const setNewValue = createAction('[New] Set Value', props<{ value: string }>());

export const newSyntaxReducer = createReducer(
  { value: 'Initial New Value' },
  on(setNewValue, (state, { value }) => ({ ...state, value }))
);
