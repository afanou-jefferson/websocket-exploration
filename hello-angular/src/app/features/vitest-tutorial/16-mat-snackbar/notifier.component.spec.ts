import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar }               from '@angular/material/snack-bar';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { provideHttpClient }         from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { NotifierComponent } from './notifier.component';

describe('NotifierComponent – MatSnackBar', () => {
  let fixture:     ComponentFixture<NotifierComponent>;
  let controller:  HttpTestingController;
  let snackSpy:    any;

  beforeEach(async () => {
    snackSpy = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports:   [NotifierComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    .overrideComponent(NotifierComponent, {
      add: { providers: [{ provide: MatSnackBar, useValue: snackSpy }] }
    })
    .compileComponents();

    controller = TestBed.inject(HttpTestingController);
    fixture    = TestBed.createComponent(NotifierComponent);
    fixture.detectChanges();
  });

  afterEach(() => controller.verify());

  it('should show a success snackbar when save completes', async () => {
    fixture.nativeElement.querySelector('[data-testid="btn-save"]').click();

    controller.expectOne('/api/save').flush({ ok: true });
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(snackSpy.open).toHaveBeenCalledOnce();
    expect(snackSpy.open).toHaveBeenCalledWith(
      'Saved successfully!',
      'Close',
      expect.objectContaining({ duration: 3000 }),
    );
  });

  it('should show an error snackbar when save fails', async () => {
    fixture.nativeElement.querySelector('[data-testid="btn-save"]').click();

    controller.expectOne('/api/save').flush(
      { error: 'Failed' },
      { status: 500, statusText: 'Server Error' },
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(snackSpy.open).toHaveBeenCalledOnce();
    expect(snackSpy.open).toHaveBeenCalledWith(
      'Save failed. Please try again.',
      'Dismiss',
      expect.objectContaining({ duration: 4000 }),
    );
  });
});
