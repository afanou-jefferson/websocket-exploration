/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 11 – NgRx Entity Adapter
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   `createEntityAdapter` normalises a collection into { ids[], entities{} }.
 *   This shape enables O(1) lookups by id instead of O(n) array scans.
 *
 *   Testing strategy:
 *   1. Reducer tests → direct calls to `reducer(state, action)` — pure fn
 *   2. Selector tests → use the adapter's `getSelectors()` with a state stub
 *
 *   No TestBed or store is needed — entity reducers and selectors are
 *   entirely pure functions operating on plain JS objects.
 *
 * NGRX ENTITY APIS COVERED:
 *   - productAdapter.getInitialState()  ← { ids: [], entities: {} }
 *   - productAdapter.setAll / addOne / removeOne / updateOne
 *   - productAdapter.getSelectors()     ← selectAll, selectEntities, selectIds
 *   - extraSelectors via createFeature
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  productAdapter,
  productsFeature,
  ProductActions,
  Product,
  ProductsState,
} from './products.store';

// ── Fixtures ───────────────────────────────────────────────────────────────
const laptop: Product = { id: 'p1', name: 'MacBook',   price: 1500, inStock: true  };
const mouse:  Product = { id: 'p2', name: 'MX Master',  price:   80, inStock: true  };
const broken: Product = { id: 'p3', name: 'Keyboard',   price:   40, inStock: false };

// Helper: build EntityState from an array
const stateFrom = (products: Product[]): ProductsState =>
  productAdapter.setAll(products, productAdapter.getInitialState());

describe('Products Entity Reducer (pure function – no TestBed)', () => {

  it('should start with empty entity state', () => {
    const state = productAdapter.getInitialState();
    // ✅ Entity initial state shape is always { ids: [], entities: {} }
    expect(state.ids).toHaveLength(0);
    expect(state.entities).toEqual({});
  });

  it('should normalize an array of products on loadSuccess', () => {
    const state = productsFeature.reducer(
      productAdapter.getInitialState(),
      ProductActions.loadSuccess({ products: [laptop, mouse] }),
    );
    // ✅ ids are stored as an ordered array
    expect(state.ids).toEqual(['p1', 'p2']);
    // ✅ entities is a dictionary keyed by id — O(1) lookup
    expect(state.entities['p1']).toEqual(laptop);
  });

  it('should add one product without touching others', () => {
    const initial = stateFrom([laptop]);
    const next = productsFeature.reducer(initial, ProductActions.addOne({ product: mouse }));
    expect(next.ids).toHaveLength(2);
    expect(next.entities['p2']).toEqual(mouse);
  });

  it('should remove a product by id', () => {
    const initial = stateFrom([laptop, mouse]);
    const next = productsFeature.reducer(initial, ProductActions.removeOne({ id: 'p1' }));
    expect(next.ids).not.toContain('p1');
    expect(next.entities['p1']).toBeUndefined();
  });

  it('should update only the price of a specific product', () => {
    const initial = stateFrom([laptop]);
    const next = productsFeature.reducer(initial, ProductActions.updatePrice({ id: 'p1', price: 1299 }));
    // ✅ updateOne merges — other fields stay untouched
    expect(next.entities['p1']!.price).toBe(1299);
    expect(next.entities['p1']!.name).toBe('MacBook');
  });
});

// ── Entity Selector tests ──────────────────────────────────────────────────
describe('Products Entity Selectors', () => {
  const { selectAll, selectEntities, selectIds, selectTotal } = productAdapter.getSelectors();
  
  // Build a state slice for these selectors
  const state = stateFrom([laptop, mouse, broken]);

  it('selectAll should return all products as a flat array', () => {
    // ✅ Use adapter selectors directly on the slice for unit tests
    const all = selectAll(state);
    expect(all).toHaveLength(3);
    expect(all[0]).toEqual(laptop);
  });

  it('selectEntities should return the id→entity dictionary', () => {
    const entities = selectEntities(state);
    expect(entities['p1']).toEqual(laptop);
    expect(entities['p3']).toEqual(broken);
  });

  it('selectIds should return the ordered id array', () => {
    const ids = selectIds(state);
    expect(ids).toEqual(['p1', 'p2', 'p3']);
  });

  it('selectTotal should return the count of entities', () => {
    const total = selectTotal(state);
    expect(total).toBe(3);
  });
});
