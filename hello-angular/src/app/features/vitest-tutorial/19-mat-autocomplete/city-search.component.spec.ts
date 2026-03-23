/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 19 – MatAutocomplete
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   MatAutocomplete renders its options in a CDK overlay appended to
 *   document.body — NOT inside the component's native element.
 *   However, in these tests we skip the overlay entirely and test the
 *   REACTIVE LOGIC: does the filter work correctly when the form control
 *   value changes?
 *
 *   This is the right level of unit testing: verify that the filtering
 *   Observable produces the correct values. The overlay rendering is
 *   Angular Material's responsibility, not ours.
 *
 * PATTERNS COVERED:
 *   - Testing filteredCities$ Observable via firstValueFrom()
 *   - Setting FormControl value via setValue()
 *   - startWith('') ensures the stream emits immediately on subscribe
 *   - provideNoopAnimations() disables CDK overlay animations
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { firstValueFrom, take, skip } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { CitySearchComponent } from './city-search.component';

describe('CitySearchComponent (MatAutocomplete)', () => {
  let fixture:   ComponentFixture<CitySearchComponent>;
  let component: CitySearchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [CitySearchComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture   = TestBed.createComponent(CitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Filter logic ───────────────────────────────────────────────────────────
  it('should emit all cities when search is empty', async () => {
    component.searchCtrl.setValue('');
    const cities = await firstValueFrom(component.filteredCities$);
    expect(cities).toHaveLength(5);
  });

  it('should filter cities matching the query', async () => {
    const nextEmission = firstValueFrom(component.filteredCities$.pipe(skip(1)));
    component.searchCtrl.setValue('ber');
    
    const cities = await nextEmission;
    // ✅ 'Berlin' matches 'ber'
    expect(cities).toEqual(['Berlin']);
  });

  it('should be case-insensitive', async () => {
    const nextEmission = firstValueFrom(component.filteredCities$.pipe(skip(1)));
    component.searchCtrl.setValue('AM');

    const cities = await nextEmission;
    expect(cities).toEqual(['Amsterdam']);
  });

  it('should return empty array when no city matches', async () => {
    const nextEmission = firstValueFrom(component.filteredCities$.pipe(skip(1)));
    component.searchCtrl.setValue('xyz');

    const cities = await nextEmission;
    expect(cities).toHaveLength(0);
  });

  it('should match cities containing the substring', async () => {
    component.searchCtrl.setValue('n');
    const cities = await firstValueFrom(component.filteredCities$);
    // Amsterdam, Copenhagen, Edinburgh all contain 'n'
    expect(cities.length).toBeGreaterThan(1);
    expect(cities).toContain('Copenhagen');
  });

  // ── Render test ────────────────────────────────────────────────────────────
  it('should render the input element', () => {
    const input = fixture.nativeElement.querySelector('[data-testid="city-input"]');
    expect(input).toBeTruthy();
  });
});
