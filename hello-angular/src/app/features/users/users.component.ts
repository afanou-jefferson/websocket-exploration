import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  standalone: false,
  template: `
    <mat-card class="users-card">
      <mat-card-header>
        <mat-card-title>Users</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          @for (user of users(); track user.id) {
            <mat-list-item>
              <span matListItemTitle>{{ user.name }}</span>
              <span matListItemLine>
                @if (user.profession) {
                  <span>{{ user.profession }}</span>
                } @else {
                  <span style="color: #888; font-style: italic;">Hidden</span>
                }
              </span>
              @if (!user.profession) {
                <button mat-stroked-button matListItemMeta color="accent" (click)="fetchProfession(user)">Show</button>
              }
            </mat-list-item>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>
  `
})
export class UsersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly users = signal<{ id: number, name: string, profession?: string }[]>([]);

  ngOnInit() {
    this.http.get<{ id: number, name: string }[]>('http://localhost:8080/api/users')
      .subscribe(users => this.users.set(users));
  }

  fetchProfession(user: { id: number, name: string, profession?: string }) {
    this.http.get<{ profession: string }>(`http://localhost:8080/api/users/${user.id}/profession`)
      .subscribe(response => {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, profession: response.profession } : u));
      });
  }
}
