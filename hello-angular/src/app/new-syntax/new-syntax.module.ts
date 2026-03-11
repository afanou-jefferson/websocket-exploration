import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideState } from '@ngrx/store';
import { newSyntaxReducer } from './new-syntax.reducer';
import { NewRealStoreComponent } from './new-real-store.component';
import { NewMockStoreComponent } from './new-mock-store.component';

@NgModule({
  declarations: [NewRealStoreComponent, NewMockStoreComponent],
  imports: [CommonModule],
  providers: [
    // [NEW SYNTAX] Lazily provides the feature state via dependency injection
    provideState({ name: 'newFeature', reducer: newSyntaxReducer })
  ],
  exports: [NewRealStoreComponent, NewMockStoreComponent]
})
export class NewSyntaxModule { }
