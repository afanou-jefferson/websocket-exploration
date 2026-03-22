/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 02 – Standalone Component (Basic + Signal Inputs)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   With standalone components you import the component class directly into
 *   TestBed.configureTestingModule({ imports: [MyComponent] }).
 *   You no longer need a NgModule wrapper.
 *
 * ANGULAR APIS COVERED:
 *   - TestBed.configureTestingModule with standalone imports
 *   - ComponentFixture<T>
 *   - fixture.componentRef.setInput()  ← the correct way to set signal inputs
 *   - fixture.detectChanges()
 *   - nativeElement querying with data-testid attributes
 *
 * BEST PRACTICES SHOWN:
 *   - Use data-testid attributes for DOM queries (not CSS classes or tag names)
 *   - Call detectChanges() AFTER any state mutation
 *   - Use fixture.componentRef.setInput() for signal-based inputs (not fixture.componentInstance.xxx =)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';

describe('GreetingComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ PATTERN: import the standalone component directly – no module needed.
      imports: [GreetingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;

    // detectChanges() triggers the initial change-detection cycle.
    // Always call it before you inspect the DOM.
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default greeting when no input is provided', () => {
    // 'World' is the default value declared in the component.
    const title = fixture.nativeElement.querySelector('[data-testid="greeting-title"]');
    expect(title.textContent).toContain('Hello, World!');
  });

  it('should update the greeting when the name input changes', () => {
    // ✅ PATTERN: use fixture.componentRef.setInput() for signal-based inputs.
    // Do NOT try:  component.name = signal('Alice')  — that won't work!
    fixture.componentRef.setInput('name', 'Alice');

    // After changing an input we must call detectChanges() to re-render.
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('[data-testid="greeting-title"]');
    expect(title.textContent).toContain('Hello, Alice!');
  });

  it('should render the static subtitle', () => {
    const sub = fixture.nativeElement.querySelector('[data-testid="greeting-sub"]');
    expect(sub.textContent).toContain('Welcome to the Vitest + Angular tutorial!');
  });

  // ── Testing computed() directly via the component instance ────────────────
  it('should expose the computed fullGreeting value', () => {
    fixture.componentRef.setInput('name', 'Bob');
    fixture.detectChanges();

    // computed() values are functions – call them to get the current value.
    expect(component.fullGreeting()).toBe('Hello, Bob! 👋');
  });
});
