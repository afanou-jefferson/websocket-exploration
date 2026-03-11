import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NewShallowParentComponent } from './new-shallow-parent.component';
import { newSyntaxReducer } from './new-syntax.reducer';

describe('NewShallowParentComponent (Shallow Testing Strategy)', () => {
  let fixture: ComponentFixture<NewShallowParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ----------------------------------------------------------------------
      // STRATEGY: Shallow Testing (Isolate component from its children)
      // ----------------------------------------------------------------------
      // We ONLY declare the component we are testing. 
      // We do NOT import NewSyntaxModule, so NewChildComponent is unknown to Angular.
      declarations: [NewShallowParentComponent],
      
      // We manually provide what the component needs (the Store).
      // Here we provide the real reducer for our feature.
      providers: [
        provideStore({ newFeature: newSyntaxReducer })
      ],

      // [CRITICAL SHALLOW TESTING REQUIREMENT]
      // This tells Angular: "If you see a tag you don't know like <app-new-child>, 
      // just ignore it and don't throw an error."
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewShallowParentComponent);
    fixture.detectChanges();
  });

  it('should create and read from the store without crashing on unknown child tags', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // The parent's own HTML should render properly
    expect(compiled.querySelector('h3')?.textContent).toContain('Initial New Value');
    
    // The child tag <app-new-child> will be present in the DOM, 
    // but it won't be instantiated as an Angular component (no child logic or services run).
    expect(compiled.querySelector('app-new-child')).toBeTruthy();
  });
});
