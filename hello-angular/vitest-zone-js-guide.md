# Testing Zone.js Components with Vitest (Angular 21+)

As a junior dev, you might find that testing components with "old" async logic (like `setTimeout` or `setInterval`) can be tricky in a modern Vitest environment. This guide explains how to do it correctly.

---

## 1. Do we use AnalogJS?
**No.** While AnalogJS is a great framework, this project uses the **native Angular CLI unit testing builder** (`@angular/build:unit-test`). 

In modern Angular (v19/20/21), the CLI has moved away from Karma/Jasmine and now uses **Vite** and **Vitest** internally for lightning-fast tests.

---

## 2. The Problem: The "ProxyZone" Error
In classic Angular tests, you usually use `fakeAsync` and `tick()`. These rely on a special part of `zone.js` called the `ProxyZone`. 

In many Vitest environments (especially those running in JSDOM or Browser mode), the `ProxyZone` is not automatically set up correctly. If you try to use `fakeAsync`, you will often see this error:
> `Error: Expected to be running in 'ProxyZone', but it was not found.`

---

## 3. The Solution: Use Vitest Native Timers
Instead of fighting with `fakeAsync`, the best practice in Vitest is to use **Vitest's own fake timers**.

### Step-by-Step Strategy:
1.  **Initialize Timers**: Use `vi.useFakeTimers()` in your `beforeEach`.
2.  **Restore Timers**: Use `vi.useRealTimers()` in your `afterEach`.
3.  **Advance Time**: Use `vi.advanceTimersByTime(ms)` to move time forward.
4.  **Targeted CD**: Use `ChangeDetectorRef.detectChanges()` to update your component DOM without triggering global "Expression Changed" errors.

---

## 4. Concrete Example

### The Component
```typescript
@Component({
  template: `<p id="counter">{{ counter }}</p>`
})
export class LegacyTimerComponent {
  counter = 0;
  start() {
    setTimeout(() => this.counter++, 1000);
  }
}
```

### The Test (The Right Way)
```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ChangeDetectorRef } from '@angular/core';

describe('LegacyTimerComponent', () => {
  let fixture: ComponentFixture<LegacyTimerComponent>;
  let cdRef: ChangeDetectorRef;

  beforeEach(() => {
    vi.useFakeTimers(); // 1. Start Vitest Timers
    // ... TestBed setup ...
    cdRef = fixture.componentRef.injector.get(ChangeDetectorRef);
  });

  afterEach(() => {
    vi.useRealTimers(); // 2. Clean up
  });

  it('should increment after 1s', () => {
    fixture.componentInstance.start();
    
    // 3. Jump forward in time
    vi.advanceTimersByTime(1000);

    // 4. Update ONLY this component's DOM
    // This avoids "ExpressionChangedAfterItHasBeenCheckedError"
    cdRef.detectChanges();

    const el = fixture.nativeElement.querySelector('#counter');
    expect(el.textContent).toBe('1');
  });
});
```

---

## 5. Summary Cheat Sheet

| Feature | Key Utility | Why it's used? |
| :--- | :--- | :--- |
| **Time Control** | `vi.advanceTimersByTime()` | Replaces `tick()`. Faster and works in Vitest. |
| **Async Support** | `vi.useFakeTimers()` | Replaces `fakeAsync`. |
| **DOM Update** | `cdRef.detectChanges()` | More reliable than `fixture.detectChanges()` for legacy code. |
| **Zone Escape** | `ngZone.runOutsideAngular` | Use for work that shouldn't trigger automatic re-renders. |

> [!TIP]
> If you see `NG0100` (Expression Changed), it usually means your manual `fixture.detectChanges()` is clashing with an automatic cycle triggered by `zone.js`. Switching to `cdRef.detectChanges()` (as shown above) is the most robust fix!
