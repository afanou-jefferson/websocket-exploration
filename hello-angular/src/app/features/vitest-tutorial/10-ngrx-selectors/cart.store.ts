import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';

// ── Model ──────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  discountPercent: number;
}

// ── Actions ────────────────────────────────────────────────────────────────
export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add Item':    props<{ item: CartItem }>(),
    'Remove Item': props<{ id: string }>(),
    'Set Discount': props<{ percent: number }>(),
    Clear:         emptyProps(),
  },
});

// ── Reducer ────────────────────────────────────────────────────────────────
const initialState: CartState = { items: [], discountPercent: 0 };

export const cartFeature = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialState,
    on(CartActions.addItem, (state, { item }) => ({
      ...state,
      items: [...state.items, item],
    })),
    on(CartActions.removeItem, (state, { id }) => ({
      ...state,
      items: state.items.filter(i => i.id !== id),
    })),
    on(CartActions.setDiscount, (state, { percent }) => ({
      ...state,
      discountPercent: percent,
    })),
    on(CartActions.clear, () => initialState),
  ),
});

// ── Composed selectors ─────────────────────────────────────────────────────
export const selectSubtotal = createSelector(
  cartFeature.selectItems,
  items => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectTotal = createSelector(
  selectSubtotal,
  cartFeature.selectDiscountPercent,
  (subtotal, discount) => subtotal * (1 - discount / 100),
);

export const selectItemCount = createSelector(
  cartFeature.selectItems,
  items => items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectIsEmpty = createSelector(
  cartFeature.selectItems,
  items => items.length === 0,
);
