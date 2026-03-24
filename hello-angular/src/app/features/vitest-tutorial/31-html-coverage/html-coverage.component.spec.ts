import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HtmlCoverageComponent } from './html-coverage.component';
import { By } from '@angular/platform-browser';

describe('HtmlCoverageComponent', () => {
  let component: HtmlCoverageComponent;
  let fixture: ComponentFixture<HtmlCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlCoverageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should render the visible text branch by default', () => {
    const textEl = fixture.debugElement.query(By.css('[data-testid="visible-text"]'));
    expect(textEl.nativeElement.textContent).toContain('visible');
  });

  // 🔴 WE DELIBERATELY DO NOT TEST THE `@else` BRANCH 
  // We want to see if Vitest's coverage report points out that the HTML line 7 
  // (<p data-testid="hidden-text">...) is missing coverage!
});
