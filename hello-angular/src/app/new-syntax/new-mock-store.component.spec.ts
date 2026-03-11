import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NewMockStoreComponent } from './new-mock-store.component';

describe('NewMockStoreComponent (Mock Store Strategy)', () => {
  let fixture: ComponentFixture<NewMockStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ----------------------------------------------------------------------
      // STRATEGY: Isolated Mock Store Test
      // ----------------------------------------------------------------------
      
      // [CRITICAL LEARNING: ISOLATION IS STILL REQUIRED]
      // Even with the new `provideState` syntax, because it resides in the 
      // Module's `providers` array, Angular's TestBed eagerly evaluates it. 
      // `provideState` depends on the Root Store Provider hook. 
      // 
      // Since `provideMockStore` does NOT supply this root hook, importing 
      // `NewSyntaxModule` will still crash the test bed with NG0201!
      // 
      // To use a MockStore inside a non-standalone module architecture, 
      // you must STILL isolate the component by declaring it directly rather 
      // than importing its host module:
      declarations: [NewMockStoreComponent],
      providers: [
        provideMockStore({
          initialState: { newFeature: { value: 'Mocked New Value' } }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewMockStoreComponent);
    fixture.detectChanges();
  });

  it('should create and read from the mock store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Mocked New Value');
  });
});
