/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXAMPLE 01 – Pure Service Unit Test
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEY INSIGHT:
 *   A service with no Angular DI should be tested WITHOUT TestBed.
 *   Instantiate it directly.  This is the fastest, most reliable kind of test.
 *
 * VITEST APIS COVERED:
 *   - describe / it / expect
 *   - vi.fn()            ← creates a mock function
 *   - vi.spyOn()         ← wraps an existing method with a spy
 *   - toHaveBeenCalled / toHaveBeenCalledWith
 *   - toThrow
 *   - beforeEach
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  // ── Setup ──────────────────────────────────────────────────────────────────
  let svc: CalculatorService;

  beforeEach(() => {
    // No TestBed needed – just `new`.
    svc = new CalculatorService();
  });

  // ── Basic arithmetic ───────────────────────────────────────────────────────
  describe('add()', () => {
    it('should return the sum of two positive numbers', () => {
      expect(svc.add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(svc.add(-4, 10)).toBe(6);
    });
  });

  describe('subtract()', () => {
    it('should return the difference', () => {
      expect(svc.subtract(10, 4)).toBe(6);
    });
  });

  describe('multiply()', () => {
    it('should return the product', () => {
      expect(svc.multiply(3, 7)).toBe(21);
    });
  });

  describe('divide()', () => {
    it('should return the quotient', () => {
      expect(svc.divide(10, 2)).toBe(5);
    });

    it('should throw when dividing by zero', () => {
      // ✅ PATTERN: use a lambda when testing for throws
      expect(() => svc.divide(10, 0)).toThrow('Division by zero');
    });
  });

  // ── vi.fn() – mock function ────────────────────────────────────────────────
  describe('format() – demonstrating vi.fn()', () => {
    it('should use the default formatter', () => {
      expect(svc.format(9.5)).toBe('$9.50');
    });

    it('should call the injected formatter with the correct value', () => {
      // vi.fn() creates a mock function that records every call.
      const mockFormatter = vi.fn((v: number) => `€${v}`);

      const result = svc.format(42, mockFormatter);

      // ✅ was the mock called?
      expect(mockFormatter).toHaveBeenCalledOnce();
      // ✅ was it called with the right argument?
      expect(mockFormatter).toHaveBeenCalledWith(42);
      // ✅ did it return the mock's return value?
      expect(result).toBe('€42');
    });
  });

  // ── vi.spyOn() – spy on existing method ───────────────────────────────────
  describe('demonstrating vi.spyOn()', () => {
    it('should allow spying on multiply without changing its behaviour', () => {
      // We spy on `multiply` but let the real implementation run.
      const spy = vi.spyOn(svc, 'multiply');

      const result = svc.multiply(4, 5);

      expect(spy).toHaveBeenCalledWith(4, 5);
      expect(result).toBe(20); // real result preserved
    });

    it('should allow replacing multiply with a fake implementation', () => {
      // mockReturnValue changes what the spy returns.
      vi.spyOn(svc, 'multiply').mockReturnValue(999);

      expect(svc.multiply(4, 5)).toBe(999); // fake result
    });
  });
});
