# 🌟 La Stack "State of the Art" pour les Tests Angular 21+ avec Vitest

En 2025, l'écosystème frontend s'est massivement rationalisé autour de Vite. L'équipe Angular a officiellement abandonné le vieillissant Karma au profit de **Vitest** comme *Test Runner* par défaut (dès Angular 21). 

Cependant, Vitest seul ne suffit pas pour construire une suite de tests pérenne, robuste et lisible. Voici la **Stack State of the Art officielle** recommandée par la communauté et les experts Angular.

---

## 1. Le Core Runner : Vitest (Remplaçant de Karma/Jasmine)

Vitest n'est "que" le moteur qui exécute les tests, mais c'est un moteur surpuissant.

**Pourquoi = La Logique :**
Historiquement, Angular lançait physiquement un navigateur Chrome pour chaque test unitaire via Karma. C'était lent et gourmand. Vitest, basé sur Vite, exécute les tests dans **Node.js** en simulant le DOM (via `jsdom` ou `happy-dom`).
* **Vitesse :** Hot Module Replacement (HMR) natif. Il ne recompile que ce qui change en quelques millisecondes.
* **Syntaxe :** Compatible à 99% avec l'API Jest (`vi.fn()`, `describe`, `expect`).

**Exemple Natif :**
```typescript
import { describe, it, expect, vi } from 'vitest';

it('should stub a function', () => {
  const spy = vi.fn().mockReturnValue(42);
  expect(spy()).toBe(42);
});
```

---

## 2. Le Test d'Interface : `@testing-library/angular`

**STATUS 2025 : OBLIGATOIRE (Pour l'UI et l'Interaction DOM)**

C'est LE standard absolu de l'industrie pour tester les composants d'interface graphique (UI), remplaçant complètement la manipulation manuelle de l'outil `fixture.debugElement`.

**Pourquoi = La Logique :**
La philosophie de *Testing Library* est : **"Plus vos tests ressemblent à la façon dont votre logiciel est utilisé, plus ils vous donnent confiance."**
Plutôt que de tester les détails d'implémentation d'Angular (les instances de classe, chercher des éléments par classe CSS interne), Testing Library vous force à chercher les éléments par leur *rôle d'accessibilité* ou leur *texte* (comme le fait un humain ou un lecteur d'écran).

Il est souvent couplé avec `@testing-library/user-event` pour simuler parfaitement les frappes claviers ou clics de souris réels (cycle complet de l'événement).

**Exemple :**
```bash
npm install -D @testing-library/angular @testing-library/user-event
```
```typescript
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { LoginComponent } from './login.component';

it('should show error when submitting empty form', async () => {
  // L'outil "render" remplace tout le boilerplate du TestBed !
  await render(LoginComponent);
  
  // On simule un utilisateur humain
  const user = userEvent.setup();
  
  // On cherche le bouton par son rôle (accessible) et on clique
  await user.click(screen.getByRole('button', { name: /se connecter/i }));
  
  // On vérifie que le texte "Requis" apparaît à l'écran
  expect(screen.getByText(/email requis/i)).toBeTruthy();
});
```

---

## 3. Le Mock Réseau (API) : `MSW` (Mock Service Worker)

Oubliez `HttpTestingController` et les Intercepteurs Angular complexes dédiés aux tests. L'état de l'art du mock d'API, c'est MSW.

**Pourquoi = La Logique :**
MSW n'est pas lié à Angular. Il intercepte les requêtes réseau **au niveau de la machine** (Node.js Request Interceptor en environnement Vitest, ou Service Worker dans le navigateur).
* **Universel :** Les mêmes Mocks que vous écrivez pour vos tests unitaires marcheront pour vos E2E, pour Storybook, ou même pour développer votre application Angular si l'API backend n'est pas encore prête !
* **Fidélité :** Votre code Angular utilise de "vrais" appels réseau, ce qui évite de fausser les tests des intercepteurs.

**Exemple :**
```bash
npm install -D msw
```
```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// On crée un serveur virtuel qui intercepte l'appel réseau
export const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'John Doe' }]);
  }),
);

// Dans setupFiles de Vitest (s'applique à toute votre application)
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Dans vos tests Angular : rien ne change, vous faites votre appel fetch ou HttpClient normalement !
```

---

## 4. Isolement et Productivité : `ng-mocks`

**STATUS 2025 : OPTIONNEL MAIS TRÈS RECOMMANDÉ (Le couteau suisse du Mocking)**

**Pourquoi = La Logique :**
Avec l'avènement d'Angular Standalone, le besoin de mocker des `NgModule` entiers a disparu, rendant `ng-mocks` moins *critique* qu'avant. Cependant, il reste la librairie reine pour la productivité.
Quand vous testez un parent lourd, vous ne voulez pas tester ses enfants, directives ou pipes (qui peuvent faire crasher le test s'ils manquent de `providers` complexes). Vous deviez écrire un `MockEnfant` à la main (`@Component({...}) class FakeEnfant`). 
`ng-mocks` fait cela automatiquement. Il "efface" le contenu de n'importe quel composant, pipe ou directive passé en argument, vous gardant concentré sur le fichier en cours d'analyse.

**Exemple :**
```bash
npm install -D ng-mocks
```
```typescript
import { MockBuilder, MockRender, MockComponent } from 'ng-mocks';

it('doit isoler le Dashboard', async () => {
  // MockBuilder simplifie immensément la syntaxe du TestBed
  await MockBuilder(DashboardComponent)
    .mock(HeavyChartComponent) // Remplace le graphique HD par une coquille vide 
    .mock(AuthService);        // Instancie un faux service vide automatiquement

  const fixture = MockRender(DashboardComponent);
  expect(fixture.point.componentInstance).toBeTruthy();
});
```

---

## 5. Le typage parfait : `vitest-mock-extended`

**STATUS 2025 : HAUTEMENT RECOMMANDÉ (Pour les as du TypeScript)**

**Pourquoi = La Logique :**
Quand vous mockez un gros service Angular (`AuthService` avec 15 méthodes), utiliser `vi.fn()` manuellement vous oblige souvent à tricher avec TypeScript (`as unknown as AuthService`), ce qui perd tout l'intérêt du typage fort.
`vitest-mock-extended` résout ce problème en générant des objets "Proxy" qui respectent à 100% les interfaces ou classes TypeScript. Si l'interface de votre service change, votre test plantera (ce qui est le but recherché !).

**Exemple :**
```bash
npm install -D vitest-mock-extended
```
```typescript
import { mock, mockClear } from 'vitest-mock-extended';
import { AuthService } from './auth.service';

describe('LoginComponent', () => {
  // Crée un mock 100% typé ! Pas besoin de .mockReturnValue sur toutes les méthodes.
  const authMock = mock<AuthService>();

  beforeEach(() => {
    mockClear(authMock); // Nettoie l'historique des appels
    // Setup spécifique pour un test
    authMock.isLoggedIn.mockReturnValue(true);
  });

  it('should compile safely', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authMock }]
    });
    // ...
  });
});
```

---

## 6. Le Test Navigateur & End-to-End : Playwright

Historiquement dominé par Cypress, le marché du E2E est en grande partie migré vers **Playwright** (par Microsoft).

**Pourquoi = La Logique :**
Dans le cadre de Vitest, la synergie est **immense**. L'équipe Vitest développe `@vitest/browser`, un plugin qui permet d'utiliser votre suite de tests Unitaires Vitest *directement à l'intérieur de Playwright*, exécutés dans de vrais navigateurs Chromium, Webkit ou Firefox.
Cela efface la frontière complexe entre "Test Unitaire" et "E2E".

**Exemple (Vitest Browser Mode avec Playwright) :**
```bash
npm install -D playwright @vitest/browser
```
```typescript
// vitest.workspace.ts
export default [
  {
    test: {
      name: 'unit',
      environment: 'jsdom'
    }
  },
  {
    test: {
      name: 'browser',
      browser: {
        enabled: true,
        provider: 'playwright', // Laisse Playwright prendre la main !
        instances: [{ browser: 'chromium' }]
      }
    }
  }
];
```

---

### Bilan de la "Dream Team" :
1. Orquestation & Runner : **Vitest**
2. Tests Comportementaux DOM : **@testing-library/angular** (Status: Obligatoire)
3. Typage Fort des Mocks : **vitest-mock-extended** (Status: Hautement Recommandé)
4. Mocks Express Angular : **ng-mocks** (Status: Optionnel mais Recommandé)
5. Mocking API Global : **MSW** (Status: Standard de l'industrie)
6. End-to-End / Vrai Navigateur : **Playwright**
