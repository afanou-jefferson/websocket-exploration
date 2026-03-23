import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export interface TodoState {
  items: Todo[];
  filter: 'all' | 'active' | 'done';
  loading: boolean;
}

const initialState: TodoState = {
  items: [],
  filter: 'all',
  loading: false,
};

@Injectable()
export class TodoStore extends ComponentStore<TodoState> {
  private idCounter = 0;

  constructor() {
    super(initialState);
  }

  // ── Selectors ──────────────────────────────────────────────────────────────
  readonly items$   = this.select(state => state.items);
  readonly filter$  = this.select(state => state.filter);
  readonly loading$ = this.select(state => state.loading);

  readonly visibleItems$ = this.select(
    this.items$,
    this.filter$,
    (items, filter) => {
      if (filter === 'active') return items.filter(t => !t.done);
      if (filter === 'done')   return items.filter(t => t.done);
      return items;
    },
  );

  // ── Updaters ───────────────────────────────────────────────────────────────
  readonly addTodo = this.updater((state, text: string) => ({
    ...state,
    items: [...state.items, { id: ++this.idCounter, text, done: false }],
  }));

  readonly toggleTodo = this.updater((state, id: number) => ({
    ...state,
    items: state.items.map(t => t.id === id ? { ...t, done: !t.done } : t),
  }));

  readonly setFilter = this.updater((state, filter: TodoState['filter']) => ({
    ...state,
    filter,
  }));

  readonly removeTodo = this.updater((state, id: number) => ({
    ...state,
    items: state.items.filter(t => t.id !== id),
  }));
}
