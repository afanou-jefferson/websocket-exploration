import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { oldSyntaxReducer } from './old-syntax.reducer';
import { OldRealStoreComponent } from './old-real-store.component';
import { OldMockStoreComponent } from './old-mock-store.component';

@NgModule({
  declarations: [OldRealStoreComponent, OldMockStoreComponent],
  imports: [
    CommonModule,
    // [OLD SYNTAX] Eagerly registers the feature at module compilation
    StoreModule.forFeature('oldFeature', oldSyntaxReducer)
  ],
  exports: [OldRealStoreComponent, OldMockStoreComponent]
})
export class OldSyntaxModule { }
