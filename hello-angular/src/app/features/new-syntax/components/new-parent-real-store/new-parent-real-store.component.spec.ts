import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore, provideState } from '@ngrx/store';
import { NewParentRealStoreComponent } from './new-parent-real-store.component';
import { NewSyntaxModule } from '../../new-syntax.module';
import { NewChildComponent } from '../new-child/new-child.component';
import { newSyntaxReducer } from '../../new-syntax.reducer';

@Component({
  selector: 'app-new-child',
  template: '<div class="mock-child">Mocked Child: {{ stateValue }}</div>',
  standalone: false
})
class MockNewChildComponent {
  @Input() stateValue: any;
}

describe('NewParentRealStoreComponent (Real Store Strategy)', () => {
  let fixture: ComponentFixture<NewParentRealStoreComponent>;

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
        provideStore(),
        provideState({ name: 'newFeature', reducer: newSyntaxReducer })
      ]
    })
    .overrideModule(NewSyntaxModule, {
      remove: {
        declarations: [NewChildComponent],
        exports: [NewChildComponent]
      },
      add: {
        declarations: [MockNewChildComponent],
        exports: [MockNewChildComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewParentRealStoreComponent);
    fixture.detectChanges();
  });

  it('should create and read from the real store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Initial New Value');
  });
});
