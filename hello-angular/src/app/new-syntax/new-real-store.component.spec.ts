import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { NewRealStoreComponent } from './new-real-store.component';
import { NewSyntaxModule } from './new-syntax.module';

describe('NewRealStoreComponent (Real Store Strategy)', () => {
  let fixture: ComponentFixture<NewRealStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ----------------------------------------------------------------------
      // STRATEGY: Real Store Integration Test
      // ----------------------------------------------------------------------
      imports: [NewSyntaxModule],
      providers: [
        // [NEW SYNTAX BENEFIT]
        // Because NewSyntaxModule uses `provideState`, we do NOT need to import 
        // the heavy `StoreModule.forRoot({})` to satisfy the compiler!
        // We can just use the lightweight, tree-shakable `provideStore()` function 
        // to setup the base store right alongside our module import.
        provideStore()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewRealStoreComponent);
    fixture.detectChanges();
  });

  it('should create and read from the real store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Initial New Value');
  });
});
