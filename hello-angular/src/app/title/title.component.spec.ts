import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleComponent } from './title.component';
import { loadText, setText } from '../store/text.reducer';
import { TitleModule } from './title.module';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TitleModule, 
        NoopAnimationsModule,
        StoreModule.forRoot({}), 
        EffectsModule.forRoot([])
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    vi.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create and dispatch loadText on init', () => {
    expect(component).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(loadText());
  });

  it('should display initial text from the store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Title from NgRx Store!');
  });
  
  it('should display updated text when state changes', () => {
    store.dispatch(setText({ text: 'Updated Mocked Title!' }));
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Updated Mocked Title!');
  });
});
