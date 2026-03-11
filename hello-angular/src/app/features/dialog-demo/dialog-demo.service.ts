import { Injectable, signal } from '@angular/core';

@Injectable()
export class DialogDemoService {
  readonly value = signal('');
}
