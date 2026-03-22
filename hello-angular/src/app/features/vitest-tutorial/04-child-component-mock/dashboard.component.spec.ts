/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 04 – Child Component Mock (Two Strategies)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   When a parent component uses a child you don't want to test, you have
 *   two main strategies:
 *
 *   STRATEGY A – Inline Stub Component (RECOMMENDED)
 *     Create a minimal fake component with the same selector.
 *     Angular replaces the real child at runtime.
 *     ✅ Precise – only the selected component is faked
 *     ✅ Input passing still works (you can verify @Input values)
 *
 *   STRATEGY B – NO_ERRORS_SCHEMA
 *     Tell Angular to ignore ALL unknown elements/attributes.
 *     ✅ Quick & easy
 *     ⚠️  Too broad – silently swallows template typos
 *
 * PATTERNS COVERED:
 *   - Replacing a child in a standalone component via TestBed.overrideComponent
 *   - NO_ERRORS_SCHEMA as an alternative
 *   - Verifying the parent DOM structure without the real child
 * ═══════════════════════════════════════════════════════════════════════════
 */
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, input } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { BadgeComponent } from './badge.component';

// ── STRATEGY A: Inline Stub ────────────────────────────────────────────────
// A minimal standalone stub that matches the real BadgeComponent's selector and inputs.
// It renders something simple so we can still assert on it.
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="stub-badge">{{ label() }}</span>`,
})
class BadgeStubComponent {
  label  = input<string>('');
  status = input<'active' | 'inactive' | 'pending'>('pending');
}

// ─────────────────────────────────────────────────────────────────────────────
describe('DashboardComponent', () => {

  // ── STRATEGY A: overrideComponent + inline stub ─────────────────────────
  describe('Strategy A – Inline Stub (recommended)', () => {
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DashboardComponent],
      })
        // ✅ PATTERN: overrideComponent replaces a specific import inside a
        // standalone component with our stub.  This is surgical – only BadgeComponent
        // is replaced; everything else in DashboardComponent remains real.
        .overrideComponent(DashboardComponent, {
          remove: { imports: [BadgeComponent] },
          add:    { imports: [BadgeStubComponent] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(DashboardComponent);
      fixture.detectChanges();
    });

    it('should create the dashboard', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render the title', () => {
      const title = fixture.nativeElement.querySelector('[data-testid="dashboard-title"]');
      expect(title.textContent).toContain('User Dashboard');
    });

    it('should render one row per user', () => {
      const rows = fixture.nativeElement.querySelectorAll('[data-testid="user-row"]');
      // Default state has 2 users (Alice & Bob).
      expect(rows.length).toBe(2);
    });

    it('should render user names', () => {
      const names = [...fixture.nativeElement.querySelectorAll('[data-testid="user-name"]')]
        .map((el: Element) => el.textContent?.trim());
      expect(names).toEqual(['Alice', 'Bob']);
    });

    it('should render stub badges (not real BadgeComponent)', () => {
      // The stub renders .stub-badge instead of the real badge markup.
      const stubs = fixture.nativeElement.querySelectorAll('.stub-badge');
      expect(stubs.length).toBe(2);
    });
  });

  // ── STRATEGY B: NO_ERRORS_SCHEMA ────────────────────────────────────────
  describe('Strategy B – NO_ERRORS_SCHEMA (simpler, less precise)', () => {
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DashboardComponent],
        // ⚠️  WARNING: NO_ERRORS_SCHEMA silences ALL unknown element errors.
        // Use it for quick tests, but prefer Strategy A for precision.
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DashboardComponent);
      fixture.detectChanges();
    });

    it('should still render the correct number of rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('[data-testid="user-row"]');
      expect(rows.length).toBe(2);
    });
  });
});
