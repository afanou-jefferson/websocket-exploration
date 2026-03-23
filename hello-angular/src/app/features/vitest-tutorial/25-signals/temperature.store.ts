import { Injectable, signal, computed, effect } from '@angular/core';

export type TempUnit = 'celsius' | 'fahrenheit';

@Injectable({ providedIn: 'root' })
export class TemperatureStore {
  private readonly _celsius   = signal(0);
  private readonly _unit      = signal<TempUnit>('celsius');
  private readonly _log:      string[] = [];

  readonly celsius    = this._celsius.asReadonly();
  readonly unit       = this._unit.asReadonly();

  readonly fahrenheit = computed(() => this._celsius() * 9 / 5 + 32);
  readonly displayed  = computed(() =>
    this._unit() === 'celsius'
      ? `${this._celsius()}°C`
      : `${this.fahrenheit()}°F`,
  );
  readonly isFreezingPoint = computed(() => this._celsius() <= 0);

  constructor() {
    effect(() => {
      const msg = `Temp changed: ${this._celsius()}°C`;
      this._log.push(msg);
    });
  }

  setCelsius(value: number): void  { this._celsius.set(value); }
  toggleUnit(): void               { this._unit.update(u => u === 'celsius' ? 'fahrenheit' : 'celsius'); }
  getLog(): string[]               { return [...this._log]; }
}
