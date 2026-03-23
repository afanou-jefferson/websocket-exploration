import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog }                 from '@angular/material/dialog';
import { provideNoopAnimations }     from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of }                        from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DeleteButtonComponent, ItemActions } from './delete-button.component';

describe('DeleteButtonComponent (Dialog + NgRx)', () => {
  let fixture:   ComponentFixture<DeleteButtonComponent>;
  let store:     MockStore;
  let dialogSpy: any;

  const setup = async (confirmed: boolean) => {
    dialogSpy = {
      open: vi.fn().mockReturnValue({ afterClosed: () => of(confirmed) }),
    };

    await TestBed.configureTestingModule({
      imports: [DeleteButtonComponent],
      providers: [
        provideNoopAnimations(),
        provideMockStore(),
      ],
    })
    .overrideComponent(DeleteButtonComponent, {
      add: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
    })
    .compileComponents();

    store   = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DeleteButtonComponent);
    fixture.componentRef.setInput('itemId', 'item-123');
    fixture.detectChanges();
  };

  it('should dispatch ItemActions.delete when user confirms', async () => {
    await setup(true);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.nativeElement.querySelector('[data-testid="delete-btn"]').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ItemActions.delete({ id: 'item-123' }),
    );
  });

  it('should NOT dispatch when user cancels the dialog', async () => {
    await setup(false);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.nativeElement.querySelector('[data-testid="delete-btn"]').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should open the dialog with the item id in the message', async () => {
    await setup(true);
    fixture.nativeElement.querySelector('[data-testid="delete-btn"]').click();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        data: expect.objectContaining({ message: expect.stringContaining('item-123') }),
      }),
    );
  });
});
