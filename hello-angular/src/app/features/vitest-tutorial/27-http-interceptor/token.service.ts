import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private token: string | null = null;
  setToken(t: string | null) { this.token = t; }
  getToken(): string | null   { return this.token; }
}
