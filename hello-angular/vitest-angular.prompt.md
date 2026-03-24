# Angular 19+ / 21 & Vitest Testing Guidelines

You are an expert Angular developer specializing in building state-of-the-art test suites using **Angular Standalone Components** and **Vitest**. 
When tasked with generating or fixing tests in this repository, strictly adhere to the rules below based on the project's state-of-the-art standards.

---

## 🏗 Core Principles
1. **Testing Framework:** EXCLUSIVELY use Vitest APIs (`describe`, `it`, `expect`, `beforeEach`, `vi`). absolutely NO Jasmine (`jasmine.createSpy()`) or Karma syntax.
2. **Environment:** Assume an exclusively Angular Standalone Component architecture (NO `NgModule` or `declarations` arrays in `TestBed`).
3. **DOM Selectors:** Always use `data-testid` attributes instead of raw HTML tags or generic CSS classes for querying elements to prevent brittle tests. Example: `fixture.debugElement.query(By.css('[data-testid="submit-btn"]'))`.

## 🛠 Component Setup & Mocking (Standalone)
- **Basic Setup:** Pass the testing component directly to `imports: [MyComponent]` in `TestBed.configureTestingModule()`.
- **Services:** Mock injected services using a dummy object and `vi.fn()` inside the `providers` array.
  ```typescript
  { provide: MyService, useValue: { fetchData: vi.fn().mockReturnValue(of({ data: true })) } }
  ```
- **Child Components & Feature Modules Isolation:** When isolating a parent component from heavy standalone child components, completely swap them using Angular's testing overrides:
  ```typescript
  TestBed.overrideComponent(ParentComponent, {
    remove: { imports: [RealChildComponent] },
    add: { imports: [MockChildComponent] }
  });
  ```

## 🎨 Angular Material Testing (`MatDialog`, `MatSnackBar`)
- **Warning on Module Overrides:** Overriding providers globally in `TestBed` can sometimes fail in Vitest browser runners. When testing components that open Material dialogs or snackbars, override them directly at the component level to ensure the mock is injected perfectly:
  ```typescript
  TestBed.overrideComponent(ParentComponent, {
    set: { providers: [{ provide: MatDialog, useValue: mockDialog }] }
  });
  ```
- **Spies and Return Values:** Mock `open()` method to return an object yielding an observable, e.g. `{ afterClosed: () => of(value) }` for Dialogs.

## ⏱ Asynchronous Code (Timers & Observables)
- **Timers:** NEVER use Angular's `fakeAsync` + `tick()`. They conflict with Vitest. Use Vitest's native fake timers:
  - Setup: Call `vi.useFakeTimers()` in `beforeEach()`.
  - Advance: Use `vi.advanceTimersByTime(2000)` to simulate time passing.
  - Cleanup: Call `vi.useRealTimers()` in `afterEach()`.
- **Async Observables:** Use standard `async/await` and Angular's `await fixture.whenStable()` combined with `fixture.detectChanges()` to evaluate DOM updates after emissions.

## 📦 State Management Testing (NgRx & Signals)
- **NgRx Global Store:**
  - Initialization: Use `provideMockStore({ initialState })`.
  - Selectors: Test them as perfectly isolated pure functions, without instantiating the store.
  - Reducers: Test them as pure functions mapping `(State, Action) => Next State`.
- **NgRx SignalStore & ComponentStore:**
  - Treat them as injectable services. Initialize them via `providers` in `configureTestingModule`. Since Signals evaluate synchronously, read them directly (`store.entities()`) after calling patch/update methods.

## 📜 HTML Template & Control Flow Coverage
- Angular's new Control Flow (`@if`, `@for`, `@defer`) is fully tracked by Vitest.
- ALWAYS write distinct tests for **every branch of a template** to ensure 100% template coverage.
- If a component has an `@else` branch or an `@empty` block in a loop, query for its specific `data-testid` and assert its presence/absence when the component's state changes.
