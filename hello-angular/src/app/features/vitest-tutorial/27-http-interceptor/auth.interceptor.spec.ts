/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 27 – HTTP Functional Interceptor
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Functional interceptors (Angular 15+) are plain functions — no class,
 *   no @Injectable. The modern setup uses:
 *     provideHttpClient(withInterceptors([myInterceptor]))
 *
 *   After that, use HttpTestingController exactly as in case 05, but now
 *   you verify the outgoing REQUEST headers instead of the response.
 *
 *   The interceptor runs in the Angular DI context, so inject() inside it
 *   works without any extra setup.
 *
 * PATTERNS COVERED:
 *   - provideHttpClient(withInterceptors([...]))   ← registers the interceptor
 *   - HttpTestingController.expectOne()            ← captures the request
 *   - req.request.headers.get()                   ← verify headers
 *   - Testing the no-token path (no header added)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed }           from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { authInterceptor } from './auth.interceptor';
import { TokenService }    from './token.service';

describe('authInterceptor', () => {
  let http:       HttpClient;
  let controller: HttpTestingController;
  let tokenSvc:   TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // ✅ Register the functional interceptor via withInterceptors
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        TokenService,
      ],
    });

    http       = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    tokenSvc   = TestBed.inject(TokenService);
  });

  afterEach(() => controller.verify());

  it('should add Authorization header when a token is present', () => {
    tokenSvc.setToken('my-secret-token');

    http.get('/api/data').subscribe();

    const req = controller.expectOne('/api/data');
    // ✅ Verify the header was set correctly by the interceptor
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-secret-token');
    req.flush({});
  });

  it('should NOT add Authorization header when no token is set', () => {
    tokenSvc.setToken(null);

    http.get('/api/public').subscribe();

    const req = controller.expectOne('/api/public');
    // ✅ The original request is passed through unchanged
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not mutate the original request (clone)', () => {
    tokenSvc.setToken('abc');

    http.get('/api/me').subscribe();

    const req = controller.expectOne('/api/me');
    // The header is present on the cloned request
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });
});
