/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 23 – MatTable Fed from NgRx Entity
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   When a table's data comes from the NgRx store, you combine two patterns:
 *   - MockStore with entity-shaped initialState
 *   - MatTable rendering from the resulting selector
 *
 *   The trick is building the correct entity state shape for initialState:
 *   { ids: [...], entities: { id: entity } }
 *   Use the entity adapter's helper or build it manually.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed }    from '@angular/core/testing';
import { MockStore, provideMockStore }  from '@ngrx/store/testing';
import { provideNoopAnimations }        from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

import { InventoryComponent }    from './inventory.component';
import { productsFeature, productAdapter } from '../11-ngrx-entity/products.store';

const PRODUCTS = [
  { id: 'p1', name: 'Laptop',  price: 999,  inStock: true  },
  { id: 'p2', name: 'Monitor', price: 399,  inStock: true  },
  { id: 'p3', name: 'Webcam',  price:  79,  inStock: false },
];

describe('InventoryComponent (MatTable + NgRx Entity)', () => {
  let fixture: ComponentFixture<InventoryComponent>;
  let store:   MockStore;

  beforeEach(async () => {
    // ✅ Build the entity-shaped state the selector expects
    const entityState = productAdapter.setAll(PRODUCTS, productAdapter.getInitialState());

    await TestBed.configureTestingModule({
      imports:   [InventoryComponent],
      providers: [
        provideNoopAnimations(),
        provideMockStore({
          initialState: { products: entityState },
        }),
      ],
    }).compileComponents();

    store   = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(InventoryComponent);
    fixture.detectChanges();
  });

  it('should render a row for each product in the entity store', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-testid="product-row"]');
    expect(rows.length).toBe(3);
  });

  it('should display the product name in each row', () => {
    const laptop = fixture.nativeElement.querySelector('[data-testid="product-p1"]');
    expect(laptop.textContent).toContain('Laptop');
  });

  it('should hide the empty message when products are loaded', () => {
    const empty = fixture.nativeElement.querySelector('[data-testid="empty-msg"]');
    expect(empty).toBeNull();
  });

  it('should show the empty message when the store has no products', () => {
    // ✅ Override the selector to simulate empty state
    store.overrideSelector(productsFeature.selectAll, []);
    store.refreshState();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('[data-testid="empty-msg"]');
    expect(empty).toBeTruthy();
  });
});
