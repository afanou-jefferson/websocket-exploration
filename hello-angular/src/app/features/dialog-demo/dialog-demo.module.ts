import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogDemoComponent } from './components/dialog-demo/dialog-demo.component';
import { GreetingDialogComponent } from './components/greeting-dialog/greeting-dialog.component';

@NgModule({
  declarations: [
    DialogDemoComponent,
    GreetingDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild([
      { path: '', component: DialogDemoComponent }
    ])
  ]
})
export class DialogDemoModule {}
