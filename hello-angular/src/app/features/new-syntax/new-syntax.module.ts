import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideState } from '@ngrx/store';
import { newSyntaxReducer } from './new-syntax.reducer';
import { NewParentRealStoreComponent } from './components/new-parent-real-store.component';
import { NewParentMockStoreComponent } from './components/new-parent-mock-store.component';
import { NewChildComponent } from './components/new-child.component';
import { NewShallowParentComponent } from './components/new-shallow-parent.component';

@NgModule({
  declarations: [NewParentRealStoreComponent, NewParentMockStoreComponent, NewChildComponent, NewShallowParentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: NewParentRealStoreComponent }
    ])
  ],
  providers: [],
  exports: [NewParentRealStoreComponent, NewParentMockStoreComponent, NewChildComponent, NewShallowParentComponent]
})
export class NewSyntaxModule { }
