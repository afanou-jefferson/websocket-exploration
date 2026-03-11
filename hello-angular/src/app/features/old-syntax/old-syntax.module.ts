import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { oldSyntaxReducer } from './old-syntax.reducer';
import { OldParentRealStoreComponent } from './components/old-parent-real-store/old-parent-real-store.component';
import { OldParentMockStoreComponent } from './components/old-parent-mock-store/old-parent-mock-store.component';
import { OldSyntaxDialogComponent } from './components/old-syntax-dialog/old-syntax-dialog.component';
import { OldSyntaxDialogService } from './old-syntax-dialog.service';

@NgModule({
  declarations: [OldParentRealStoreComponent, OldParentMockStoreComponent, OldSyntaxDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild([
      { path: '', component: OldParentRealStoreComponent }
    ]),
    // [OLD SYNTAX] Eagerly registers the feature at module compilation
    StoreModule.forFeature('oldFeature', oldSyntaxReducer)
  ],
  // 🔑 Module-level provider: every component inside OldSyntaxModule
  //    (declared, or the dialog opened from within) shares this ONE instance.
  providers: [OldSyntaxDialogService],
  exports: [OldParentRealStoreComponent, OldParentMockStoreComponent]
})
export class OldSyntaxModule { }
