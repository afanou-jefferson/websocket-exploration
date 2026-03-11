import { createReducer, on, createAction, props } from '@ngrx/store';

export const loadText = createAction('[Title] Load Text');
export const setText = createAction('[Title] Set Text', props<{ text: string }>());

export const initialState: string = 'Title from NgRx Store!';

export const textReducer = createReducer(
  initialState,
  on(setText, (state, { text }) => text)
);
