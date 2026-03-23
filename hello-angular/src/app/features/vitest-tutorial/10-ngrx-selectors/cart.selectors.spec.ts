/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 10 – NgRx Selector Unit Tests
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Selectors are PURE functions — they take state slices as input and
 *   return derived data. You test them using the `.projector()` method,
 *   which calls the selector's derivation function directly, bypassing
 *   the memoization layer.  NO TestBed, no store — just function calls.
 *
 * NGRX TESTING APIS COVERED:
 *   - selector.projector()    ← calls the derivation fn directly
 *   - Testing input selectors ← verify they read correct slice
 *   - Testing composed selectors ← each selector in isolation
 *   - Testing reducers        ← pure function, action in → state out
 *
 * WHY projector() OVER running the full selector?
 *   Full selectors read from real state, requiring you to construct the
 *   entire AppState. projector() only needs the inputs listed in the
 *   createSelector() call — much simpler and faster.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { describe, it, expect } from 'vitest';
import {
  CartActions,
  cartFeature,
  selectSubtotal,
  selectTotal,
  selectItemCount,
  selectIsEmpty,
  CartState,
  CartItem,
} from './cart.store';

// ── Test fixtures ──────────────────────────────────────────────────────────
const book:  CartItem = { id: '1', name: 'Clean Code',   price: 30, quantity: 2 };
const mouse: CartItem = { id: '2', name: 'Logitech MX3', price: 80, quantity: 1 };

describe('Cart Selectors (pure projector tests – no TestBed)', () => {

  // ── selectSubtotal ─────────────────────────────────────────────────────────
  describe('selectSubtotal', () => {
    it('should sum price × quantity across all items', () => {
      // ✅ projector() takes the exact inputs declared in createSelector()
      // selectSubtotal depends on selectItems → projector receives items array
      const result = selectSubtotal.projector([book, mouse]);
      // 30×2 + 80×1 = 140
      expect(result).toBe(140);
    });

    it('should return 0 for an empty cart', () => {
      expect(selectSubtotal.projector([])).toBe(0);
    });
  });

  // ── selectTotal ────────────────────────────────────────────────────────────
  describe('selectTotal', () => {
    it('should apply the discount to the subtotal', () => {
      // selectTotal depends on selectSubtotal + selectDiscountPercent
      // projector receives (subtotal, discountPercent)
      const result = selectTotal.projector(100, 20); // 100 − 20% = 80
      expect(result).toBe(80);
    });

    it('should return full subtotal when discount is 0', () => {
      expect(selectTotal.projector(100, 0)).toBe(100);
    });

    it('should return 0 when subtotal is 0', () => {
      expect(selectTotal.projector(0, 10)).toBe(0);
    });
  });

  // ── selectItemCount ────────────────────────────────────────────────────────
  describe('selectItemCount', () => {
    it('should sum all item quantities', () => {
      // book.quantity=2, mouse.quantity=1 → total 3
      expect(selectItemCount.projector([book, mouse])).toBe(3);
    });

    it('should return 0 for empty cart', () => {
      expect(selectItemCount.projector([])).toBe(0);
    });
  });

  // ── selectIsEmpty ──────────────────────────────────────────────────────────
  describe('selectIsEmpty', () => {
    it('should return true when items array is empty', () => {
      expect(selectIsEmpty.projector([])).toBe(true);
    });

    it('should return false when items are present', () => {
      expect(selectIsEmpty.projector([book])).toBe(false);
    });
  });
});

// ── Reducer tests (also pure functions) ───────────────────────────────────
describe('Cart Reducer (pure function test – no TestBed)', () => {
  const empty: CartState = { items: [], discountPercent: 0 };

  it('should add an item on addItem', () => {
    const next = cartFeature.reducer(empty, CartActions.addItem({ item: book }));
    expect(next.items).toHaveLength(1);
    expect(next.items[0]).toEqual(book);
  });

  it('should remove an item by id on removeItem', () => {
    const withItems = cartFeature.reducer(empty, CartActions.addItem({ item: book }));
    const next      = cartFeature.reducer(withItems, CartActions.removeItem({ id: book.id }));
    expect(next.items).toHaveLength(0);
  });

  it('should set the discount percent', () => {
    const next = cartFeature.reducer(empty, CartActions.setDiscount({ percent: 15 }));
    expect(next.discountPercent).toBe(15);
  });

  it('should reset to initial state on clear', () => {
    const withItems = cartFeature.reducer(
      { items: [book], discountPercent: 10 },
      CartActions.clear(),
    );
    expect(withItems).toEqual({ items: [], discountPercent: 0 });
  });
});
