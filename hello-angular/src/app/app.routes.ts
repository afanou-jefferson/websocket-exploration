import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent), pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'new-syntax',
    loadChildren: () => import('./features/new-syntax/new-syntax.module').then(m => m.NewSyntaxModule)
  },
  {
    path: 'old-syntax',
    loadChildren: () => import('./features/old-syntax/old-syntax.module').then(m => m.OldSyntaxModule)
  }
];
