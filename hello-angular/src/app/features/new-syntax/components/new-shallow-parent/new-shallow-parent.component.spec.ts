import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { NewShallowParentComponent } from './new-shallow-parent.component';
import { newSyntaxReducer } from '../../new-syntax.reducer';

@Component({
  selector: 'app-new-child',
  template: '',
  standalone: false
})
class MockNewChildComponent {
  @Input() stateValue: any;
}

describe('NewShallowParentComponent (Shallow Testing Strategy)', () => {
  let fixture: ComponentFixture<NewShallowParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // We declare the parent AND the mock child. 
      declarations: [NewShallowParentComponent, MockNewChildComponent],
      
      providers: [
        provideStore({ newFeature: newSyntaxReducer })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewShallowParentComponent);
  });

  it('should create and read from the store successfully', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Parent logic still works
    expect(compiled.querySelector('h3')?.textContent).toContain('Initial New Value');
    
    // The mock child is rendered
    expect(compiled.querySelector('app-new-child')).toBeTruthy();
  });
});
