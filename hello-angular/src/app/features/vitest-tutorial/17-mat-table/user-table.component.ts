import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  template: `
    <mat-table [dataSource]="dataSource" matSort data-testid="user-table">
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
        <mat-cell *matCellDef="let u" [attr.data-testid]="'name-' + u.id">{{ u.name }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="email">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Email</mat-header-cell>
        <mat-cell *matCellDef="let u">{{ u.email }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="role">
        <mat-header-cell *matHeaderCellDef>Role</mat-header-cell>
        <mat-cell *matCellDef="let u">{{ u.role }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;" data-testid="table-row"></mat-row>
    </mat-table>

    <mat-paginator
      [pageSizeOptions]="[5, 10, 25]"
      [pageSize]="5"
      data-testid="paginator">
    </mat-paginator>
  `,
})
export class UserTableComponent implements OnInit {
  @Input() users: User[] = [];

  displayedColumns = ['name', 'email', 'role'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort)      sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.data = this.users;
  }

  ngAfterViewInit() {
    this.dataSource.sort      = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
