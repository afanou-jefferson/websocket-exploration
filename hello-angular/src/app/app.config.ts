import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore, StoreModule, StoreRootModule } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideEffects, EffectsModule } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { newSyntaxReducer } from './features/new-syntax/new-syntax.reducer';
import { oldSyntaxReducer } from './features/old-syntax/old-syntax.reducer';
import { textReducer } from './store/text.reducer';
import { TextEffects } from './store/text.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideState({ name: 'newFeature', reducer: newSyntaxReducer }),
    provideState({ name: 'text', reducer: textReducer }),
    provideEffects([TextEffects]),
    { provide: StoreRootModule, useValue: {} },
    importProvidersFrom(
      EffectsModule.forRoot([])
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
