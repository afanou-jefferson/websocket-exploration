import { Injectable, signal } from '@angular/core';

/**
 * Module-level service: provided in OldSyntaxModule's providers array.
 * This means every component inside the module shares the SAME instance.
 * No @Injectable({ providedIn: ... }) — the module owns the lifecycle.
 */
@Injectable()
export class OldSyntaxDialogService {
  readonly value = signal('');
}
