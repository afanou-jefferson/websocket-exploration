# 🚀 Le Guide Ultime : 31 Cas Pratiques de Tests Angular 21 + Vitest

Ce guide exhaustif et pédagogique a pour but de vous former sur les **31 cas d'usage réels** rencontrés lors de la création d'applications complexes en Angular 19+ (Standalone Components, Signals, Control Flow) avec Vitest. 

---

## 🏗️ Bloc 1 : Les Fondations (Services et Composants Basiques)

### Cas 01 : Service Pur & Signals (`01-pure-service`)
**La Logique :** Les Signals sont synchrones. On les lit en appelant leur fonction sans avoir besoin de s'y abonner.
**Exemple :**
```typescript
const service = new CalculatorService();
service.add(5);
expect(service.result()).toBe(5);
```

### Cas 02 : Standalone Component Basique (`02-standalone-component-basic`)
**La Logique :** Angular 19+ supprime les `NgModule`. Le test doit importer le composant directement via `imports` dans le `TestBed`.
**Exemple :**
```typescript
await TestBed.configureTestingModule({ imports: [HelloComponent] }).compileComponents();
```

### Cas 03 : Mocking de Service (`03-service-mock`)
**La Logique :** On injecte un "mock" dans les `providers`. L'API `vi.fn()` remplace les anciens espions Jasmine (`jasmine.createSpy`).
**Exemple :**
```typescript
const mockService = { fetch: vi.fn().mockReturnValue(of([])) };
TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: mockService }] });
```

### Cas 04 : Isolation de Composant Enfant (`04-child-component-mock`)
**La Logique :** Pour isoler un parent d'un gros module enfant standalone, utilisez `overrideComponent`.
**Exemple :**
```typescript
TestBed.overrideComponent(Parent, { 
  remove: { imports: [VraiEnfant] }, add: { imports: [MockEnfant] } 
});
```

---

## 🌐 Bloc 2 : Réseau et Routage

### Cas 05 : Service HTTP (`05-http-service`)
**La Logique :** On utilise `provideHttpClientTesting()` avec `HttpTestingController` pour vérifier dynamiquement la requête émise et valider l'URL.
**Exemple :**
```typescript
const req = httpController.expectOne('/api/users');
expect(req.request.method).toBe('GET');
req.flush([{ name: 'Alice' }]);
```

### Cas 06 : Routage Basique (`06-router`)
**La Logique :** Fournir une simple constante `MockRouter` est suffisant pour valider qu'un clic redirige la page sans alourdir le test.
**Exemple :**
```typescript
const mockRouter = { navigate: vi.fn() };
// Setup: { provide: Router, useValue: mockRouter }
component.goHome();
expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
```

### Cas 24 : Guards de Route (`24-route-guard`)
**La Logique :** Les guards sont des fonctions (`CanActivateFn`). Instanciez-les de manière fonctionnelle via `runInInjectionContext`.
**Exemple :**
```typescript
const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
expect(result).toBe(true);
```

### Cas 27 : Intercepteurs HTTP Fonctionnels (`27-http-interceptor`)
**La Logique :** Les intercepteurs se testent en les fournissant avec `withInterceptors` dans la configuration HTTP du test.
**Exemple :**
```typescript
TestBed.configureTestingModule({
  providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()]
});
```

---

## 🗃️ Bloc 3 : L'Écosystème NgRx (Le State Management)

### Cas 07 : NgRx Standalone Counter (`07-ngrx-standalone`)
**La Logique :** Vous devez mocker le framework global NgRx à l'aide de `provideMockStore`.
**Exemple :**
```typescript
TestBed.configureTestingModule({ providers: [provideMockStore({ initialState: { count: 0 } })] });
```

### Cas 09 : NgRx Effects (`09-ngrx-effects`)
**La Logique :** Les Effects lisent un flux d'actions global que l'on émule manuellement.
**Exemple :**
```typescript
let actions$ = of(loadUsers());
TestBed.configureTestingModule({ providers: [UserEffects, provideMockActions(() => actions$)] });
```

### Cas 10 : NgRx Selectors (`10-ngrx-selectors`)
**La Logique :** Un selector est toujours une fonction pure. Ne chargez jamais de Store entier pour tester ça.
**Exemple :**
```typescript
const state = { auth: { token: '123' } };
expect(selectToken.projector(state.auth)).toBe('123');
```

### Cas 11 & 23 : NgRx Entity (`11-ngrx-entity` & `23-table-entity`)
**La Logique :** Un Adapter génère lui-même des sélecteurs très solides. Référez-vous-y toujours dans les tests.
**Exemple :**
```typescript
const { selectAll } = userAdapter.getSelectors();
expect(selectAll(mockState)).toHaveLength(3);
```

### Cas 12 : NgRx Component Store (`12-ngrx-component-store`)
**La Logique :** Le ComponentStore se fournit simplement comme un service natif dans les `providers` du composant. 
**Exemple :**
```typescript
TestBed.configureTestingModule({ providers: [TodoStore] });
const store = TestBed.inject(TodoStore);
store.addTodo('Test');
```

### Cas 13 : NgRx Signal Store (`13-ngrx-signal-store`)
**La Logique :** Les `SignalStore` sont réactifs mais lisibles de manière synchrone. Injection simple, lecture immédiate (`store.value()`).
**Exemple :**
```typescript
const store = TestBed.inject(ThemeStore);
store.toggle();
expect(store.isDark()).toBe(true);
```

### Cas 14 : NgRx Router Store (`14-ngrx-router-store`)
**La Logique :** Simulez l'état sérialisé du routeur en l'initialisant dans `MockStore` dans les providers de TestBed.
**Exemple :**
```typescript
provideMockStore({ initialState: { router: { state: { params: { id: 42 } } } } });
```

---

## 🎨 Bloc 4 : Angular Material & UI

### Cas 15, 16, 22 : Les Pièges Headless (Dialog & Snackbar)
**La Logique (Cruciale) :** Placer le mock globalement dans `TestBed` empêche Vitest de l'injecter si le composant est en mode Standalone avec `MatDialog`. On *doit* écraser le composant (Component Level Provider).
**Exemple :**
```typescript
TestBed.overrideComponent(TriggerDialogComponent, {
  set: { providers: [{ provide: MatDialog, useValue: { open: vi.fn() } }] }
});
```

### Cas 17, 18, 19, 20 : UI Complexe (Table, Stepper, Autocomplete, Select)
**La Logique :** Toujours cibler l'API native d'Angular Material via le DOM (ex: classes CDK) si possible, et manipuler les `FormControl` associés plutôt que de chercher comment faire cliquer Vitest sur des éléments d'Overlay inaccessibles.
**Exemple :**
```typescript
// (Autocomplete)
const input = fixture.debugElement.query(By.css('input')).nativeElement;
input.value = 'Paris';
input.dispatchEvent(new Event('input'));
```

### Cas 08 & 21 : Reactive Forms & Form-NgRx (`08-reactive-forms`, `21-form-ngrx`)
**La Logique :** Lorsque `control.setValue()` modifie une donnée couplée avec NgRx, le cycle de vie d'Angular doit être poussé manuellement (`detectChanges`) !
**Exemple :**
```typescript
component.searchForm.setValue({ term: 'Hello' });
fixture.detectChanges();
expect(store.dispatch).toHaveBeenCalledWith(searchAction({ term: 'Hello' }));
```

---

## ⚡ Bloc 5 : Concepts Avancés & Outils Modernes

### Cas 25 : Signals isolés (`25-signals`)
**La Logique :** Les `computed()` misent sur la *lazy evaluation*. Tant que leur valeur n'est pas appelée une fois dans le test, la valeur interne cachette n'est pas mise à jour par les effets.
**Exemple :**
```typescript
store.temperature.set(30);
expect(store.computedFahrenheit()).toBe(86); // Force l'évaluation !
```

### Cas 26 : Les blocs `@defer` (`26-defer-blocks`)
**La Logique :** La mécanique native du defer demande qu'on la pousse artificiellement à se résoudre car c'est bloqué réseau (chunks de composants lâches).
**Exemple :**
```typescript
await fixture.whenStable(); // Attendre que le chunk "@defer" charge
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('Deferred Loaded');
```

### Cas 28 : Directives d'Attribut (`28-custom-directive`)
**La Logique :** Créez un faux composant qui sert d'hôte ("Dummy Host" component) au sein même du fichier de test.
**Exemple :**
```typescript
@Component({ template: '<div appHighlight></div>', standalone: true, imports: [HighlightDirective] })
class HostComponent {}
```

### Cas 29 : AsyncPipe vs Vitest FakeTimers (`29-async-pipe`)
**La Logique :** Adieu l'outil préhistorique `fakeAsync`. Vive les API natives de fausses horloges de l'environnement Vitest qui gèlent l'Observable.
**Exemple :**
```typescript
vi.useFakeTimers();
// Action qui dure
vi.advanceTimersByTime(3000); 
fixture.detectChanges();
vi.useRealTimers();
```

### Cas 30 : Gestion Globale des Erreurs (`30-error-boundary`)
**La Logique :** Pour valider un log sans cracher le test terminal, espionnez `console.error` de la machine NodeJS.
**Exemple :**
```typescript
const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
handler.handleError(new Error('Test Crash'));
expect(spy).toHaveBeenCalled();
```

### Cas 31 : Couverture du HTML et Control Flow (`31-html-coverage`)
**La Logique :** Le nouvel `@if` d'Angular est une "vraie branche conditionnelle JavaScript" dans la compilation. Si vous ne testez pas le point critique `état = faux`, votre HTML manquera un bloc rouge de couverture.
**Exemple :**
```typescript
// Cas: "Else"
component.isVisible.set(false);
fixture.detectChanges(); 
const loginBtn = fixture.debugElement.query(By.css('[data-testid="login-btn"]'));
expect(loginBtn).toBeTruthy(); 
```
