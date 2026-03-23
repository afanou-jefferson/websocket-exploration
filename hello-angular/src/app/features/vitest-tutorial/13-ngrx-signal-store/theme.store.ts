import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

const initialState: ThemeState = {
  mode: 'system',
  primaryColor: '#6200ea',
  fontSize: 'md',
};

export const ThemeStore = signalStore(
  // withState creates a signal for each property
  withState(initialState),

  // withComputed derives read-only signals from state
  withComputed(store => ({
    isDark: computed(() => store.mode() === 'dark'),
    isLight: computed(() => store.mode() === 'light'),
    label: computed(() => `Theme: ${store.mode()} / ${store.fontSize()}`),
  })),

  // withMethods defines the store's public API
  withMethods(store => ({
    setMode(mode: ThemeMode): void {
      patchState(store, { mode });
    },
    setFontSize(fontSize: ThemeState['fontSize']): void {
      patchState(store, { fontSize });
    },
    setPrimaryColor(primaryColor: string): void {
      patchState(store, { primaryColor });
    },
    reset(): void {
      patchState(store, initialState);
    },
  })),
);
