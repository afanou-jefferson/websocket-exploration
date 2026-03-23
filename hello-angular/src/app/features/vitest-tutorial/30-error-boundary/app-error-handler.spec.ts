/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 30 – Global ErrorHandler + NgRx Dispatch
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   The ErrorHandler is a low-level Angular service that catches all
 *   unhandled exceptions. Since it's a class, we test it by calling
 *   handleError() directly and verifying the side-effect (NgRx dispatch).
 *
 *   We use MockStore to verify that our global handler correctly
 *   translates raw Error objects (or strings) into well-defined
 *   NgRx actions that the rest of the app can react to (e.g., showing
 *   a global error notification).
 *
 * PATTERNS COVERED:
 *   - Testing ErrorHandler.handleError()
 *   - Verifying error message and stack trace extraction
 *   - Mocking console.error to avoid polluting test logs
 *   - MockStore dispatch verification
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AppErrorHandler, AppErrorActions } from './app-error-handler';

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler;
  let store:   MockStore;

  beforeEach(() => {
    // ✅ Mock console.error to keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        AppErrorHandler,
        provideMockStore(),
      ],
    });

    handler = TestBed.inject(AppErrorHandler);
    store   = TestBed.inject(MockStore);
  });

  it('should dispatch Unhandled Error action when an Error object is caught', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const error = new Error('Critical failure');

    handler.handleError(error);

    expect(dispatchSpy).toHaveBeenCalledWith(
      AppErrorActions.unhandledError({
        message: 'Critical failure',
        stack: error.stack,
      }),
    );
  });

  it('should dispatch Unhandled Error action when a string error is caught', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    handler.handleError('Something went wrong');

    expect(dispatchSpy).toHaveBeenCalledWith(
      AppErrorActions.unhandledError({
        message: 'Something went wrong',
        stack: undefined,
      }),
    );
  });

  it('should log the error to console.error', () => {
    const error = new Error('Log this');
    handler.handleError(error);
    expect(console.error).toHaveBeenCalledWith('[AppErrorHandler]', error);
  });
});
