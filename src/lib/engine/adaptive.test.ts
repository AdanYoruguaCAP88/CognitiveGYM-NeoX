import { describe, expect, it } from 'vitest';
import {
  applyInactivityDecay,
  challengeVectorDelta,
  cognitiveGain,
  maturityState,
  type CognitiveVector
} from './adaptive';

const vector: CognitiveVector = {
  clarity: 10,
  coherence: 10,
  depth: 10,
  structure: 10,
  secondOrder: 10,
  biasControl: 10
};

describe('adaptive engine', () => {
  it('returns zero for empty history', () => {
    expect(cognitiveGain([])).toBe(0);
  });

  it('uses only the latest 20 records', () => {
    const history = [...Array(20).fill(100), ...Array(20).fill(0)];
    expect(cognitiveGain(history)).toBe(cognitiveGain(Array(20).fill(0)));
  });

  it('implements ΔC as current score minus previous average', () => {
    expect(cognitiveGain([50, 60])).toBeGreaterThan(0);
  });

  it('applies the 20-point inactivity floor', () => {
    expect(applyInactivityDecay(10, 4)).toBe(20);
  });

  it('applies 3+ correct momentum', () => {
    const withoutMomentum = challengeVectorDelta(100, 'medium', vector, ['clarity'], 2).clarity!;
    const withMomentum = challengeVectorDelta(100, 'medium', vector, ['clarity'], 3).clarity!;
    expect(withMomentum).toBeGreaterThan(withoutMomentum);
  });

  it('uses weighted maturity scoring', () => {
    const base: CognitiveVector = {
      clarity: 50,
      coherence: 50,
      depth: 50,
      structure: 50,
      secondOrder: 50,
      biasControl: 50
    };
    expect(maturityState(base)).toBe('Constraint Designer');
  });
});