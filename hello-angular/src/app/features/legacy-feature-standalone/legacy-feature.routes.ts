// Explicit Comment: We no longer import NgModule or RouterModule.forChild().
// Instead, we just export a Routes array. This simplifies routing immensely.
import { Routes } from '@angular/router';
import { Comp1Component } from './comp1/comp1.component';
import { Comp2Component } from './comp2/comp2.component';
import { Comp3Component } from './comp3/comp3.component';
import { LayoutComponent } from './layout/layout.component';

export const legacyFeatureStandaloneRoutes: Routes = [
  {
    path: '',
    // Explicit Comment: Because LayoutComponent is standalone, Angular can route directly to it
    // without loading a module first. We just define its children here.
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'comp1', pathMatch: 'full' },
      { path: 'comp1', component: Comp1Component },
      { path: 'comp2', component: Comp2Component },
      { path: 'comp3', component: Comp3Component }
    ]
  }
];
