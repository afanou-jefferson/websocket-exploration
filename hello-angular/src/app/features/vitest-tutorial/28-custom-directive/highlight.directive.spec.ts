/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 28 – Custom Attribute Directive
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   Directives can't be tested in isolation — they need a host element.
 *   The pattern is to create a minimal HOST component inline in the test
 *   file.  This host component applies the directive and exposes native
 *   elements for querying.
 *
 *   Trigger DOM events using fixture.debugElement.triggerEventHandler()
 *   or by dispatching native events. After each event, call detectChanges().
 *
 * PATTERNS COVERED:
 *   - Inline host component for directive testing
 *   - triggerEventHandler() for mouse events
 *   - Reading computed styles after directive sets them
 *   - Testing with a custom input value (@Input)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { Component }                   from '@angular/core';
import { ComponentFixture, TestBed }   from '@angular/core/testing';
import { By }                          from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

import { HighlightDirective } from './highlight.directive';

// ✅ PATTERN: Create a minimal host component inline — just for the test
@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: `
    <p appHighlight="cornflowerblue" data-testid="target">Hover me</p>
    <p appHighlight data-testid="default-color">Default color</p>
  `,
})
class HostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should have no background color initially', () => {
    const el = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLElement;
    expect(el.style.backgroundColor).toBe('');
  });

  it('should set background color on mouseenter', () => {
    const de = fixture.debugElement.query(By.css('[data-testid="target"]'));
    // ✅ triggerEventHandler fires the @HostListener without real mouse
    de.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    expect((de.nativeElement as HTMLElement).style.backgroundColor).toBe('cornflowerblue');
  });

  it('should remove background color on mouseleave', () => {
    const de = fixture.debugElement.query(By.css('[data-testid="target"]'));
    de.triggerEventHandler('mouseenter', null);
    de.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();

    expect((de.nativeElement as HTMLElement).style.backgroundColor).toBe('');
  });

  it('should set an outline on click', () => {
    const de = fixture.debugElement.query(By.css('[data-testid="target"]'));
    de.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect((de.nativeElement as HTMLElement).style.outline).toContain('cornflowerblue');
  });

  it('should use yellow as the default highlight color', () => {
    const de = fixture.debugElement.query(By.css('[data-testid="default-color"]'));
    de.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    expect((de.nativeElement as HTMLElement).style.backgroundColor).toBe('yellow');
  });
});
