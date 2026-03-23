/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 26 – @defer Block Testing
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Angular 17+ @defer blocks have four states: placeholder, loading,
 *   complete (content rendered), and error. In tests, you control which
 *   state to render using the DeferBlockFixture API:
 *
 *     const deferFixtures = await fixture.getDeferBlocks();
 *     await deferFixtures[0].render(DeferBlockState.Complete);
 *
 *   This is the only way to test each state in isolation — you can't rely
 *   on real triggers (viewport, interaction, etc.) in unit tests.
 *
 * DEFER TESTING APIS COVERED:
 *   - fixture.getDeferBlocks()          ← get all @defer blocks in the template
 *   - deferBlockFixture.render(state)   ← transition to a specific state
 *   - DeferBlockState.Placeholder / Loading / Complete / Error
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeferBlockState }           from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { LazyProfileComponent } from './lazy-profile.component';

describe('LazyProfileComponent (@defer blocks)', () => {
  let fixture: ComponentFixture<LazyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LazyProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LazyProfileComponent);
    fixture.detectChanges();
  });

  it('should show the placeholder initially', () => {
    // ✅ Before any defer state is triggered, the placeholder renders
    const placeholder = fixture.nativeElement.querySelector('[data-testid="placeholder"]');
    expect(placeholder?.textContent).toContain('Loading profile');
  });

  it('should render loading state', async () => {
    const deferBlocks = await fixture.getDeferBlocks();
    await deferBlocks[0].render(DeferBlockState.Loading);

    const spinner = fixture.nativeElement.querySelector('[data-testid="loading-spinner"]');
    expect(spinner?.textContent).toContain('Please wait');
  });

  it('should render the full profile in complete state', async () => {
    const deferBlocks = await fixture.getDeferBlocks();
    // ✅ DeferBlockState.Complete renders the main @defer content
    await deferBlocks[0].render(DeferBlockState.Complete);

    const name = fixture.nativeElement.querySelector('[data-testid="profile-name"]');
    const bio  = fixture.nativeElement.querySelector('[data-testid="profile-bio"]');

    expect(name?.textContent).toContain('Alice Johnson');
    expect(bio?.textContent).toContain('Senior Angular Developer');
  });

  it('should render the error state', async () => {
    const deferBlocks = await fixture.getDeferBlocks();
    await deferBlocks[0].render(DeferBlockState.Error);

    const error = fixture.nativeElement.querySelector('[data-testid="error-msg"]');
    expect(error?.textContent).toContain('Failed to load profile');
  });
});
