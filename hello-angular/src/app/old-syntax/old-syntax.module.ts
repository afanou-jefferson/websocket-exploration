import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { oldSyntaxReducer } from './old-syntax.reducer';
import { OldParentRealStoreComponent } from './old-parent-real-store.component';
import { OldParentMockStoreComponent } from './old-parent-mock-store.component';

@NgModule({
  declarations: [OldParentRealStoreComponent, OldParentMockStoreComponent],
  imports: [
    CommonModule,
    // [OLD SYNTAX] Eagerly registers the feature at module compilation
    StoreModule.forFeature('oldFeature', oldSyntaxReducer)
  ],
  exports: [OldParentRealStoreComponent, OldParentMockStoreComponent]
})
export class OldSyntaxModule { }
