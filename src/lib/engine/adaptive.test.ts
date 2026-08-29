import { describe, expect, it } from 'vitest';
import {
  applyInactivityDecay,
  challengeVectorDelta,
  cognitiveGain,
  maturityState,
  type CognitiveVector
} from './adaptive';

describe('adaptive engine', () => {
  it('returns zero CognitiveGain for empty history', () => {
    expect(cognitiveGain([])).toBe(0);
  });

  it('uses the last 20 records for CognitiveGain', () => {
    const history = [...Array(5).fill(0), ...Array(20).fill(100)];
    expect(cognitiveGain(history)).toBeCloseTo(26, 10);
  });

  it('handles histories shorter than 20', () => {
    expect(Number.isFinite(cognitiveGain([80, 70, 90]))).toBe(true);
  });

  it('never raises a vector already below the inactivity floor', () => {
    expect(applyInactivityDecay(10, 8)).toBe(10);
  });

  it('applies the inactivity floor to higher vectors', () => {
    expect(applyInactivityDecay(100, 100)).toBeGreaterThanOrEqual(20);
    expect(applyInactivityDecay(100, 1)).toBeLessThan(100);
  });

  it('adds momentum after three consecutive correct answers', () => {
    const current = { clarity: 0 };
    const base = challengeVectorDelta(100, 'medium', current, ['clarity'], 2).clarity!;
    const streak = challengeVectorDelta(100, 'medium', current, ['clarity'], 3).clarity!;
    expect(streak).toBeCloseTo(base * 1.3, 10);
  });

  it('reduces progression impact as a dimension increases', () => {
    const low = challengeVectorDelta(100, 'medium', { clarity: 0 }, ['clarity'], 0).clarity!;
    const high = challengeVectorDelta(100, 'medium', { clarity: 100 }, ['clarity'], 0).clarity!;
    expect(high).toBeCloseTo(low * 0.5, 10);
  });

  it('classifies maturity states at thresholds', () => {
    const vector = (value: number): CognitiveVector => ({
      clarity: value, coherence: value, depth: value, structure: value, secondOrder: value, biasControl: value
    });
    expect(maturityState(vector(24.99))).toBe('Reactive Operator');
    expect(maturityState(vector(25))).toBe('Structured Thinker');
    expect(maturityState(vector(45))).toBe('Constraint Designer');
    expect(maturityState(vector(62))).toBe('Strategic Operator');
    expect(maturityState(vector(78))).toBe('Systems Architect');
  });
});