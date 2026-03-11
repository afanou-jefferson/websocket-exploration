import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideState } from '@ngrx/store';
import { newSyntaxReducer } from './new-syntax.reducer';
import { NewParentRealStoreComponent } from './new-parent-real-store.component';
import { NewParentMockStoreComponent } from './new-parent-mock-store.component';
import { NewChildComponent } from './new-child.component';
import { NewShallowParentComponent } from './new-shallow-parent.component';

@NgModule({
  declarations: [NewParentRealStoreComponent, NewParentMockStoreComponent, NewChildComponent, NewShallowParentComponent],
  imports: [CommonModule],
  providers: [],
  exports: [NewParentRealStoreComponent, NewParentMockStoreComponent, NewChildComponent, NewShallowParentComponent]
})
export class NewSyntaxModule { }
