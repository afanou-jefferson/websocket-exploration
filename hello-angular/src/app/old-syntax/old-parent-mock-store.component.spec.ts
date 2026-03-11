import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OldParentMockStoreComponent } from './old-parent-mock-store.component';

describe('OldParentMockStoreComponent (Mock Store Strategy)', () => {
  let fixture: ComponentFixture<OldParentMockStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ----------------------------------------------------------------------
      // STRATEGY: Isolated Mock Store Test
      // ----------------------------------------------------------------------
      // WHEN TO USE: 
      // When you only want to test the component's HTML/TS logic, completely 
      // ignoring reducers and modules.
      // ----------------------------------------------------------------------
      
      // [CRITICAL OLD SYNTAX WORKAROUND]
      // We CANNOT import `OldSyntaxModule` here! 
      // If we import OldSyntaxModule, it will trigger `StoreModule.forFeature`.
      // `provideMockStore()` does not create a real root store, so `.forFeature` 
      // would crash the test!
      // Therefore, we MUST declare the component directly to isolate it from its own module.
      declarations: [OldParentMockStoreComponent],
      providers: [
        provideMockStore({
          initialState: { oldFeature: { value: 'Mocked Old Value' } }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OldParentMockStoreComponent);
    fixture.detectChanges();
  });

  it('should create and read from the mock store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Mocked Old Value');
  });
});
