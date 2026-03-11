import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewChildService {
  getData() {
    return 'real service data';
  }
}
