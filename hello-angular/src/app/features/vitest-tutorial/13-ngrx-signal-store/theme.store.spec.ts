/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 13 – NgRx Signal Store
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   signalStore() is the modern, signal-native alternative to the classic
 *   NgRx store. Each piece of state becomes a signal automatically.
 *   withComputed() derives computed signals. withMethods() exposes the API.
 *
 *   Testing strategy:
 *   - The Signal Store is a plain class — test it like a service with `new`
 *     (inject via TestBed for DI, or just instantiate in an injection context)
 *   - Read state via signal calls: store.mode()
 *   - Call methods directly: store.setMode('dark')
 *   - No actions, no dispatch, no MockStore needed
 *
 * SIGNAL STORE APIS COVERED:
 *   - withState()     ← state becomes auto-signal properties
 *   - withComputed()  ← derived signals (computed)
 *   - withMethods()   ← the store's public mutation API
 *   - patchState()    ← partial state update inside withMethods
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeStore } from './theme.store';

describe('ThemeStore (Signal Store)', () => {
  let store: InstanceType<typeof ThemeStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // ✅ Signal Store is provided just like any service
      providers: [ThemeStore],
    });
    store = TestBed.inject(ThemeStore);
  });

  // ── Initial state ──────────────────────────────────────────────────────────
  it('should have initial mode = "system"', () => {
    // ✅ withState() makes store.mode a signal — call it like a function
    expect(store.mode()).toBe('system');
  });

  it('should have isDark = false initially (mode is system, not dark)', () => {
    // ✅ withComputed() — derived signal, read the same way
    expect(store.isDark()).toBe(false);
  });

  it('should have isLight = false initially', () => {
    expect(store.isLight()).toBe(false);
  });

  // ── withMethods() ──────────────────────────────────────────────────────────
  describe('setMode()', () => {
    it('should update the mode signal', () => {
      store.setMode('dark');
      expect(store.mode()).toBe('dark');
    });

    it('should make isDark = true when mode is dark', () => {
      store.setMode('dark');
      // ✅ computed signals automatically react to state changes
      expect(store.isDark()).toBe(true);
    });

    it('should make isLight = true when mode is light', () => {
      store.setMode('light');
      expect(store.isLight()).toBe(true);
    });
  });

  describe('setFontSize()', () => {
    it('should update font size without affecting other state', () => {
      store.setMode('dark');
      store.setFontSize('lg');

      // ✅ patchState merges — other fields remain intact
      expect(store.fontSize()).toBe('lg');
      expect(store.mode()).toBe('dark');
    });
  });

  describe('label computed signal', () => {
    it('should reflect the current mode and fontSize', () => {
      store.setMode('dark');
      store.setFontSize('lg');
      expect(store.label()).toBe('Theme: dark / lg');
    });
  });

  describe('reset()', () => {
    it('should restore all state to initial values', () => {
      store.setMode('dark');
      store.setFontSize('lg');
      store.setPrimaryColor('#ff0000');
      store.reset();

      expect(store.mode()).toBe('system');
      expect(store.fontSize()).toBe('md');
      expect(store.primaryColor()).toBe('#6200ea');
    });
  });
});
