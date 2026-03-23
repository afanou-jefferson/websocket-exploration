import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// ── Entity Adapter ─────────────────────────────────────────────────────────
// ✅ createEntityAdapter gives you: addOne, addMany, setAll, removeOne,
//    updateOne, upsertOne, and pre-built selectors (selectAll, selectIds, etc.)
export const productAdapter = createEntityAdapter<Product>();

export type ProductsState = EntityState<Product>;

// ── Actions ────────────────────────────────────────────────────────────────
export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Success': props<{ products: Product[] }>(),
    'Add One':      props<{ product: Product }>(),
    'Remove One':   props<{ id: string }>(),
    'Update Price': props<{ id: string; price: number }>(),
  },
});

// ── Reducer ────────────────────────────────────────────────────────────────
export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    productAdapter.getInitialState(),
    on(ProductActions.loadSuccess, (state, { products }) =>
      productAdapter.setAll(products, state),
    ),
    on(ProductActions.addOne, (state, { product }) =>
      productAdapter.addOne(product, state),
    ),
    on(ProductActions.removeOne, (state, { id }) =>
      productAdapter.removeOne(id, state),
    ),
    on(ProductActions.updatePrice, (state, { id, price }) =>
      productAdapter.updateOne({ id, changes: { price } }, state),
    ),
  ),
  extraSelectors: ({ selectProductsState }) => ({
    ...productAdapter.getSelectors(selectProductsState),
  }),
});
