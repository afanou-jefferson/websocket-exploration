/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 06 – Router Integration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Use provideRouter([]) to register a minimal in-memory router.
 *   Spy on router.navigate() with vi.spyOn() so you can assert navigation
 *   without actually changing a URL.
 *
 * PATTERNS COVERED:
 *   - provideRouter([]) – zero-config router for isolated tests
 *   - vi.spyOn(router, 'navigate').mockResolvedValue(true) – mock navigation
 *   - Testing routerLink presence via DOM attributes
 *   - Testing imperative navigation via button click → router.navigate()
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let fixture: ComponentFixture<NavComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        // ✅ PATTERN: provideRouter([]) gives us a real router with no routes.
        // This is enough to test links & navigation calls.
        // Add routes as needed: provideRouter([{ path: 'home', component: HomeComponent }])
        provideRouter([]),
      ],
    }).compileComponents();

    // Grab the router instance from the DI container.
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  // ── RouterLink presence ────────────────────────────────────────────────────
  it('should render a Home link pointing to /home', () => {
    const homeLink = fixture.nativeElement.querySelector('[data-testid="link-home"]');
    // routerLink sets the href attribute after change-detection.
    expect(homeLink.getAttribute('href')).toBe('/home');
  });

  it('should render an About link pointing to /about', () => {
    const aboutLink = fixture.nativeElement.querySelector('[data-testid="link-about"]');
    expect(aboutLink.getAttribute('href')).toBe('/about');
  });

  // ── Imperative navigation ──────────────────────────────────────────────────
  it('should call router.navigate([\'/dashboard\']) when dashboard button is clicked', async () => {
    // ✅ PATTERN: spy on navigate() so we don't need a real route.
    // mockResolvedValue(true) simulates a successful navigation.
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const btn = fixture.nativeElement.querySelector('[data-testid="btn-dashboard"]');
    btn.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  // ── Initial URL ────────────────────────────────────────────────────────────
  it('should display the current URL', () => {
    // After TestBed setup the router starts at '/'.
    const urlEl = fixture.nativeElement.querySelector('[data-testid="current-url"]');
    expect(urlEl.textContent).toContain('/');
  });
});
