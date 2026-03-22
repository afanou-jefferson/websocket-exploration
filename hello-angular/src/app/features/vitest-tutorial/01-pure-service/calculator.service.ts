/**
 * EXAMPLE 01 – Pure Service
 *
 * This service has NO Angular dependency injection.  It is a plain TypeScript
 * class.  This is the simplest thing you can test: no TestBed, no Angular at
 * all.  Pure Vitest.
 */
export class CalculatorService {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }

  /**
   * Formats a number as a currency string.
   * This method delegates to an injected formatter function so we can
   * demonstrate vi.fn() substitution in the spec.
   */
  format(value: number, formatter: (v: number) => string = (v) => `$${v.toFixed(2)}`): string {
    return formatter(value);
  }
}
