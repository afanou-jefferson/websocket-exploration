import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegacyFeatureRoutingModule } from './legacy-feature-routing.module';
import { Comp1Component } from './comp1/comp1.component';
import { Comp2Component } from './comp2/comp2.component';
import { Comp3Component } from './comp3/comp3.component';
import { LayoutComponent } from './layout/layout.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    Comp1Component,
    Comp2Component,
    Comp3Component,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LegacyFeatureRoutingModule,
    MatButtonModule,
    RouterModule
  ]
})
export class LegacyFeatureModule { }
