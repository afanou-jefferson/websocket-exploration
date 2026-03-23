/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 21 – Material Form + NgRx Dispatch
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   This case combines two concepts: Reactive Forms validation (case 08)
 *   and NgRx MockStore dispatch verification (case 07).
 *   The form is the UI gate; the store dispatch is the side-effect.
 *
 *   Test the full user flow:
 *     1. User types into the Material input
 *     2. Form becomes valid
 *     3. User clicks Search
 *     4. Correct action is dispatched to the store
 *
 *  Also verify the guard: no dispatch when form is invalid.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SearchBarComponent, SearchActions } from './search-bar.component';

describe('SearchBarComponent (Form + NgRx)', () => {
  let fixture:   ComponentFixture<SearchBarComponent>;
  let component: SearchBarComponent;
  let store:     MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [SearchBarComponent],
      providers: [provideNoopAnimations(), provideMockStore()],
    }).compileComponents();

    store     = TestBed.inject(MockStore);
    fixture   = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disable the search button when query is empty', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="search-btn"]');
    expect(btn.disabled).toBe(true);
  });

  it('should disable the button when query is too short (< 2 chars)', () => {
    component.form.setValue({ query: 'x' });
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('[data-testid="search-btn"]');
    expect(btn.disabled).toBe(true);
  });

  it('should enable the button when query is valid', () => {
    component.form.setValue({ query: 'angular' });
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('[data-testid="search-btn"]');
    expect(btn.disabled).toBe(false);
  });

  it('should dispatch SearchActions.execute with the query on valid submit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.form.setValue({ query: 'vitest' });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('[data-testid="search-form"]');
    form.dispatchEvent(new Event('submit'));

    expect(dispatchSpy).toHaveBeenCalledWith(
      SearchActions.execute({ query: 'vitest' }),
    );
  });

  it('should reset the form after a successful dispatch', () => {
    component.form.setValue({ query: 'angular' });
    component.onSubmit();
    // ✅ Form resets to initial invalid state after dispatch
    expect(component.form.value.query).toBe('');
  });

  it('should NOT dispatch when form is invalid', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
