import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { OldParentRealStoreComponent } from './old-parent-real-store.component';
import { OldSyntaxModule } from '../../old-syntax.module';
import { oldSyntaxReducer } from '../../old-syntax.reducer';

describe('OldParentRealStoreComponent (Real Store Strategy)', () => {
  let fixture: ComponentFixture<OldParentRealStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ----------------------------------------------------------------------
      // STRATEGY: Real Store Integration Test
      // ----------------------------------------------------------------------
      // WHEN TO USE: 
      // When you want to test the component AND its reducer/module integration.
      // ----------------------------------------------------------------------
      imports: [
        OldSyntaxModule, // Imports the component AND its StoreModule.forFeature
        
        // [CRITICAL OLD SYNTAX REQUIREMENT]
        // Because OldSyntaxModule uses `StoreModule.forFeature`, it forces Angular 
        // to look for the Root Store during compilation.
        // We MUST provide StoreModule.forRoot({}) here, otherwise it throws NG0201!
        StoreModule.forRoot({}),
        StoreModule.forFeature('oldFeature', oldSyntaxReducer)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OldParentRealStoreComponent);
    fixture.detectChanges();
  });

  it('should create and read from the real store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Initial Old Value');
  });
});
