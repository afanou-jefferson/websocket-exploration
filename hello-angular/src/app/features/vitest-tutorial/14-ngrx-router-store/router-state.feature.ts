import { createSelector } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

// ✅ getRouterSelectors() extracts common router pieces from the router state
export const {
  selectUrl,
  selectRouteParams,
  selectQueryParams,
} = getRouterSelectors();

// Custom composed selector — read a specific route param
export const selectUserId = createSelector(
  selectRouteParams,
  params => params?.['userId'] ?? null,
);

// Group as a "feature" for cleaner imports in the component and tests
export const routerFeature = {
  selectUrl,
  selectUserId,
};
