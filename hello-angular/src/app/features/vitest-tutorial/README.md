# Vitest + Angular Testing Tutorial

> **Repo**: `src/app/features/vitest-tutorial/`  
> **Stack**: Angular 21 · Vitest 4 · Browser Mode (Playwright/Chromium)

Run all specs:
```bash
npx vitest run
```

---

## Example Map

| # | Folder | What it teaches |
|---|--------|-----------------|
| 01 | `01-pure-service/` | Pure Vitest: `vi.fn()`, `vi.spyOn()`, `toThrow` — **no TestBed** |
| 02 | `02-standalone-component-basic/` | Standalone component + signal `input()` + `computed()` · `fixture.componentRef.setInput()` |
| 03 | `03-service-mock/` | Mock an injectable service with `vi.fn()` · `{ provide, useValue }` |
| 04 | `04-child-component-mock/` | Child component isolation: **inline stub** vs `NO_ERRORS_SCHEMA` |
| 05 | `05-http-service/` | `provideHttpClientTesting()` + `HttpTestingController` |
| 06 | `06-router/` | `provideRouter([])` + spy on `router.navigate()` |
| 07 | `07-ngrx-standalone/` | `provideMockStore` · selector override · dispatch spy · pure reducer tests |
| 08 | `08-reactive-forms/` | Form validity · `setValue` · `markAsTouched` · `output()` event assertion |

---

## Key Patterns at a Glance

### 1 — No TestBed for pure services
```ts
// ✅ Just instantiate directly
const svc = new CalculatorService();
expect(svc.add(2, 3)).toBe(5);
```

### 2 — Signal inputs require `componentRef.setInput()`
```ts
// ✅ Correct
fixture.componentRef.setInput('name', 'Alice');
// ❌ Wrong — bypass Angular's change-tracking
// component.name = signal('Alice');
```

### 3 — Mock services via `useValue`
```ts
const mockSvc = { count: signal(0).asReadonly(), increment: vi.fn() };
providers: [{ provide: CounterService, useValue: mockSvc }]
```

### 4 — Mock child components via `overrideComponent`
```ts
@Component({ selector: 'app-badge', standalone: true, template: `<span>stub</span>` })
class BadgeStub {}

TestBed.overrideComponent(DashboardComponent, {
  remove: { imports: [BadgeComponent] },
  add:    { imports: [BadgeStub] },
});
```

### 5 — HTTP: always call `controller.verify()` in `afterEach`
```ts
afterEach(() => controller.verify()); // fails on unhandled requests
```

### 6 — Router: spy on navigate
```ts
vi.spyOn(router, 'navigate').mockResolvedValue(true);
btn.click();
expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
```

### 7 — NgRx: override selectors surgically
```ts
store.overrideSelector(counterFeature.selectCount, 9);
store.refreshState();
fixture.detectChanges();
```

### 8 — Forms: test logic through the FormGroup, not the DOM
```ts
component.email.setValue('bad');
expect(component.email.hasError('email')).toBe(true);
// Only use DOM queries for UX assertions (error labels, disabled buttons)
```
