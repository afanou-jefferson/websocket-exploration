import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatTabsModule } from '@angular/material/tabs';
import { textReducer } from '../store/text.reducer';
import { TextEffects } from '../store/text.effects';

@NgModule({
  declarations: [TitleComponent],
  imports: [
    CommonModule,
    MatTabsModule
  ],
  exports: [TitleComponent]
})
export class TitleModule { }
