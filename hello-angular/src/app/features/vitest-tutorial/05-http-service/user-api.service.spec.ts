/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 05 – HTTP Service Testing
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Never make real HTTP calls in tests.  Use Angular's built-in
 *   provideHttpClientTesting() + HttpTestingController to intercept requests,
 *   assert their shape, and flush fake responses.
 *
 * ANGULAR APIS COVERED:
 *   - provideHttpClient()         ← required alongside the testing provider
 *   - provideHttpClientTesting()  ← installs the testing backend
 *   - HttpTestingController       ← intercepts and controls pending requests
 *   - req.flush()                 ← resolve the request with a fake response
 *   - req.error()                 ← simulate a network error
 *   - afterEach: controller.verify() ← fails if any request was left unhandled
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserApiService, User } from './user-api.service';

describe('UserApiService', () => {
  let service: UserApiService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // ✅ PATTERN: always include both providers together.
        provideHttpClient(),          // real HttpClient token
        provideHttpClientTesting(),   // swaps the backend with a test double
        UserApiService,
      ],
    });

    service    = TestBed.inject(UserApiService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // ✅ BEST PRACTICE: call verify() after every test.
    // This throws if any request was made but never flushed, preventing silent
    // test gaps.
    controller.verify();
  });

  // ── getUsers() ─────────────────────────────────────────────────────────────
  describe('getUsers()', () => {
    it('should GET /users and return an array of users', () => {
      const fakeUsers: User[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob',   email: 'bob@example.com' },
      ];

      // 1. Subscribe first (the request fires on subscribe).
      let result: User[] | undefined;
      service.getUsers().subscribe((users) => (result = users));

      // 2. Intercept the pending request.
      const req = controller.expectOne('https://jsonplaceholder.typicode.com/users');

      // 3. Assert its shape.
      expect(req.request.method).toBe('GET');

      // 4. Flush a fake response – this resolves the observable.
      req.flush(fakeUsers);

      // 5. Now the subscriber has run.
      expect(result).toEqual(fakeUsers);
    });
  });

  // ── getUser(id) ────────────────────────────────────────────────────────────
  describe('getUser(id)', () => {
    it('should GET /users/:id', () => {
      const fakeUser: User = { id: 42, name: 'Carol', email: 'carol@example.com' };

      let result: User | undefined;
      service.getUser(42).subscribe((u) => (result = u));

      const req = controller.expectOne('https://jsonplaceholder.typicode.com/users/42');
      expect(req.request.method).toBe('GET');
      req.flush(fakeUser);

      expect(result).toEqual(fakeUser);
    });
  });

  // ── createUser() ───────────────────────────────────────────────────────────
  describe('createUser()', () => {
    it('should POST /users with the user payload', () => {
      const newUser = { name: 'Dave', email: 'dave@example.com' };
      const created: User = { id: 101, ...newUser };

      let result: User | undefined;
      service.createUser(newUser).subscribe((u) => (result = u));

      const req = controller.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toBe('POST');
      // Assert the request body matches what we passed in.
      expect(req.request.body).toEqual(newUser);

      req.flush(created);
      expect(result).toEqual(created);
    });
  });

  // ── Error handling ─────────────────────────────────────────────────────────
  describe('error handling', () => {
    it('should propagate a 404 error from getUser()', () => {
      let errorMessage: string | undefined;

      service.getUser(999).subscribe({
        next: () => { /* should not reach here */ },
        error: (err) => (errorMessage = err.statusText),
      });

      const req = controller.expectOne('https://jsonplaceholder.typicode.com/users/999');

      // ✅ PATTERN: flush with an error status to simulate a failed request.
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(errorMessage).toBe('Not Found');
    });
  });
});
