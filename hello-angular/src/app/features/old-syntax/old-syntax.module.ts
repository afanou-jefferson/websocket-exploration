import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { oldSyntaxReducer } from './old-syntax.reducer';
import { OldParentRealStoreComponent } from './components/old-parent-real-store/old-parent-real-store.component';
import { OldParentMockStoreComponent } from './components/old-parent-mock-store/old-parent-mock-store.component';

@NgModule({
  declarations: [OldParentRealStoreComponent, OldParentMockStoreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: OldParentRealStoreComponent }
    ]),
    // [OLD SYNTAX] Eagerly registers the feature at module compilation
    StoreModule.forFeature('oldFeature', oldSyntaxReducer)
  ],
  exports: [OldParentRealStoreComponent, OldParentMockStoreComponent]
})
export class OldSyntaxModule { }
