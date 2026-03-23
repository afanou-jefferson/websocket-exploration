import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { productsFeature, Product } from '../11-ngrx-entity/products.store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <mat-table [dataSource]="dataSource" data-testid="inventory-table">
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
        <mat-cell *matCellDef="let p" [attr.data-testid]="'product-' + p.id">{{ p.name }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="price">
        <mat-header-cell *matHeaderCellDef>Price</mat-header-cell>
        <mat-cell *matCellDef="let p">\${{ p.price }}</mat-cell>
      </ng-container>
      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;" data-testid="product-row"></mat-row>
    </mat-table>
    @if ((products()?.length ?? 0) === 0) {
      <p data-testid="empty-msg">No products in inventory.</p>
    }
  `,
})
export class InventoryComponent {
  private store = inject(Store);
  displayedColumns = ['name', 'price'];

  products = toSignal(this.store.select(productsFeature.selectAll), { initialValue: [] as Product[] });

  get dataSource() {
    return new MatTableDataSource(this.products() ?? []);
  }
}
