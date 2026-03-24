# ENCYCLOPEDIA: Angular 19/21 + Vitest Testing Guide (31 Use Cases)

You are an expert Angular developer generating tests for Angular 19+ Standalone components using Vitest. 
A strict requirement: DO NOT use Jasmine (`jasmine.createSpy()`), Karma, or `fakeAsync`/`tick`. Use ONLY native Vitest (`vi.fn()`, `vi.useFakeTimers()`).

Here is the exact boilerplate dictionary for ALL 31 scenarios covering modern Angular testing. Copy these exact patterns.

---

### [Case 01 & 25] Pure Services & Signals
Signals update synchronously. Read them via calling the function: `signal()`.
```typescript
it('should test a signal', () => {
  const service = new CalculatorService();
  service.add(5);
  expect(service.result()).toBe(5); // Sync read
});
```

### [Case 02 & 03] Standalone Components & Mocking Providers
Use `imports: [Component]` and `TestBed.configureTestingModule`. Mock services using `vi.fn()`.
```typescript
const mockService = { getData: vi.fn().mockReturnValue(of([])) };
await TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [{ provide: ApiService, useValue: mockService }]
}).compileComponents();
```

### [Case 04] Isolating Heavy Child Components
```typescript
TestBed.overrideComponent(ParentComponent, {
  remove: { imports: [RealChildComponent] },
  add: { imports: [MockChildComponent] }
});
```

### [Case 05 & 27] HTTP Services & Interceptors (`HttpTestingController`)
Use `provideHttpClient()` and `provideHttpClientTesting()`.
```typescript
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [MyHttpService, provideHttpClient(), provideHttpClientTesting()]
  });
  httpController = TestBed.inject(HttpTestingController);
});
it('should call API', () => {
  service.fetch().subscribe(data => expect(data).toBeTruthy());
  const req = httpController.expectOne('/api/data');
  req.flush({ id: 1 });
});
```

### [Case 06 & 24] Router Navigation & Route Guards
Mock `Router` using an object. For Guards, use `TestBed.runInInjectionContext`.
```typescript
const mockRouter = { navigate: vi.fn() };
TestBed.configureTestingModule({
  providers: [{ provide: Router, useValue: mockRouter }]
});
it('guard should redirect', () => {
  const result = TestBed.runInInjectionContext(() => myGuard(mockRoute, mockState));
  expect(mockRouter.navigate).toHaveBeenCalled();
});
```

### [Case 07, 10] NgRx Standalone Store & Selectors
Use `provideMockStore`. Test selectors individually as pure functions.
```typescript
it('should project state', () => {
  const result = selectUser.projector({ id: 1 });
  expect(result.id).toBe(1);
});
```

### [Case 08, 21] Reactive Forms & NgRx Sync
Always trigger `fixture.detectChanges()` after calling `control.setValue()`.

### [Case 09] NgRx Effects (`provideMockActions`)
```typescript
import { provideMockActions } from '@ngrx/effects/testing';
let actions$ = new Observable<Action>();
TestBed.configureTestingModule({
  providers: [MyEffects, provideMockActions(() => actions$)]
});
it('should trigger effect', async () => {
  actions$ = of(loadAction());
  const result = await firstValueFrom(effects.load$);
  expect(result).toEqual(successAction());
});
```

### [Case 11 & 23] NgRx Entity
Test entity state directly via the adapter's selectors (e.g. `productAdapter.getSelectors()`). Don't use heavy full-state selectors if they fail in the browser runner.

### [Case 12] NgRx Component Store
Provide the store directly in `providers: [MyComponentStore]`. Subscribe to selectors to test derived state.

### [Case 13] NgRx Signal Store
Provide directly in `providers`. Do NOT mock it. Mutate via `patchState` and read synchronously.
```typescript
const store = TestBed.inject(ThemeStore);
store.toggleTheme();
expect(store.isDark()).toBe(true);
```

### [Case 14] NgRx Router Store
Mock the selector `selectRouteParams`, or explicitly provide a mocked routing state via `MockStore`. 

### [Case 15, 16, 22] Material Dialog & Snackbar (CRITICAL)
NEVER provide `MatDialog` globally in tests (crashes headless browser). Override at the component level:
```typescript
const mockDialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
TestBed.overrideComponent(MyComponent, {
  set: { providers: [{ provide: MatDialog, useValue: mockDialog }] }
});
```

### [Case 17, 18, 19, 20] Material Table, Stepper, Autocomplete, Select
Use `TestBed.overrideComponent` to remove generic Material module dependencies if isolated testing is required, OR import the exact Material modules (`MatTableModule`). Query elements using `data-testid`. Trigger events by finding the input and dispatching a `new Event('input')` or clicking `.mat-option`.

### [Case 26] `@defer` Blocks
Currently, `@defer` renders placeholders immediately in tests unless `deferBlockBehavior` is explicitly changed. Use `await fixture.whenStable()` to wait for defer resolution if behavior is `PlayThrough`.

### [Case 28] Custom Attribute Directives
Test directives by creating a HostComponent inline:
```typescript
@Component({ template: '<div appHighlight></div>', standalone: true, imports: [HighlightDirective] })
class HostComponent {}
```

### [Case 29] AsyncPipe & Live Clock (Replaces `fakeAsync`)
```typescript
vi.useFakeTimers();
it('should update clock', () => {
  vi.advanceTimersByTime(1000); // 1 second
  fixture.detectChanges();
});
vi.useRealTimers();
```

### [Case 30] Global Error Handler
Implement standard class testing. Call `handler.handleError(new Error())` and deeply assert `console.error` spies using `vi.spyOn(console, 'error')`.

### [Case 31] HTML Template Logic (100% Coverage)
Vitest Istanbul natively traces `@if` and `@else` branches inside TS coverage.
```typescript
it('tests the @else branch explicitly', () => {
  component.isVisible.set(false);
  fixture.detectChanges();
  expect(fixture.debugElement.query(By.css('[data-testid="else-block"]'))).toBeTruthy();
});
```
