/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 25 – Angular Signals in Isolation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Signals are plain getter functions — no Observable, no TestBed needed
 *   for pure signal/computed logic.  Instantiate the store with `new`,
 *   call signal setters, and read the results directly.
 *
 *   Effects (side effects) ARE different: they run in a reactive context.
 *   TestBed provides this context automatically.  Use TestBed.inject()
 *   for stores that have effect() declarations, then call
 *   TestBed.flushEffects() to synchronously flush pending effects.
 *
 * SIGNAL APIS COVERED:
 *   - signal()           ← writable, read by calling value()
 *   - computed()         ← lazy, memoized derived value
 *   - effect()           ← side-effect that runs when dependencies change
 *   - TestBed.flushEffects() ← synchronously run pending effects in tests
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed }   from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TemperatureStore } from './temperature.store';

describe('TemperatureStore – pure signal / computed tests  (no TestBed)', () => {
  let store: TemperatureStore;

  beforeEach(() => {
    // ✅ signal() + computed() work outside Angular DI — just use new
    // But our store has effect(), so we use TestBed to provide the reactive context
    TestBed.configureTestingModule({ providers: [TemperatureStore] });
    store = TestBed.inject(TemperatureStore);
  });

  // ── signal() ───────────────────────────────────────────────────────────────
  it('should start at 0°C', () => {
    expect(store.celsius()).toBe(0);
  });

  it('should update the celsius signal', () => {
    store.setCelsius(100);
    expect(store.celsius()).toBe(100);
  });

  // ── computed() ─────────────────────────────────────────────────────────────
  it('should compute fahrenheit from celsius', () => {
    store.setCelsius(100);
    // ✅ Computed signals are memoized — safe to read multiple times without recompute
    expect(store.fahrenheit()).toBe(212);
  });

  it('should compute isFreezingPoint = true at 0°C', () => {
    expect(store.isFreezingPoint()).toBe(true);
  });

  it('should compute isFreezingPoint = false above 0°C', () => {
    store.setCelsius(1);
    expect(store.isFreezingPoint()).toBe(false);
  });

  it('should display in celsius when unit is celsius', () => {
    store.setCelsius(25);
    expect(store.displayed()).toBe('25°C');
  });

  it('should display in fahrenheit after toggleUnit()', () => {
    store.setCelsius(0);
    store.toggleUnit();
    expect(store.displayed()).toBe('32°F');
  });

  // ── effect() ───────────────────────────────────────────────────────────────
  it('should have logged the initial temperature via effect()', () => {
    // ✅ TestBed.flushEffects() synchronously runs all pending effect() callbacks
    TestBed.flushEffects();
    const log = store.getLog();
    expect(log.length).toBeGreaterThanOrEqual(1);
    expect(log[0]).toContain('0°C');
  });

  it('should log each temperature change via effect()', () => {
    TestBed.flushEffects(); // flush initial
    store.setCelsius(37);
    TestBed.flushEffects(); // flush after mutation
    const log = store.getLog();
    expect(log[log.length - 1]).toContain('37°C');
  });
});
