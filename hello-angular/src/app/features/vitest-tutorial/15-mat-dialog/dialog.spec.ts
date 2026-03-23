import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { of }                        from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DialogTriggerComponent } from './dialog-trigger.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('DialogTriggerComponent (the opener)', () => {
  let fixture: ComponentFixture<DialogTriggerComponent>;
  let dialogSpy: any;

  const setup = async (mockResult: boolean) => {
    dialogSpy = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(mockResult),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [DialogTriggerComponent],
      providers: [provideNoopAnimations()],
    })
    .overrideComponent(DialogTriggerComponent, {
      add: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTriggerComponent);
    fixture.detectChanges();
  };

  it('should open the dialog with the correct config when button is clicked', async () => {
    await setup(true);
    fixture.nativeElement.querySelector('[data-testid="open-btn"]').click();
    
    expect(dialogSpy.open).toHaveBeenCalledOnce();
    expect(dialogSpy.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        width: '350px',
        data: { message: 'Are you sure you want to delete this item?' },
      })
    );
  });

  it('should show "Item deleted!" after the dialog resolves with true', async () => {
    await setup(true);
    fixture.nativeElement.querySelector('[data-testid="open-btn"]').click();
    
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="result-msg"]');
    expect(el?.textContent).toContain('Item deleted!');
  });

  it('should show "Cancelled." after the dialog resolves with false', async () => {
    await setup(false);
    fixture.nativeElement.querySelector('[data-testid="open-btn"]').click();
    
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="cancel-msg"]');
    expect(el?.textContent).toContain('Cancelled.');
  });
});
