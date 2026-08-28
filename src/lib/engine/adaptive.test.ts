import { describe, expect, it } from 'vitest';
import { applyInactivityDecay, challengeVectorDelta, cognitiveGain, maturityState, type CognitiveVector } from './adaptive';

const vector: CognitiveVector = { clarity: 10, coherence: 10, depth: 10, structure: 10, secondOrder: 10, biasControl: 10 };

describe('adaptive engine', () => {
  it('handles fewer than 20 records', () => expect(Number.isFinite(cognitiveGain([80, 90, 40]))).toBe(true));
  it('uses only the last 20 records', () => {
    const history = [...Array(20).fill(100), ...Array(20).fill(0)];
    expect(cognitiveGain(history)).toBe(cognitiveGain(Array(20).fill(0)));
  });
  it('never raises a vector already below 20 during inactivity', () => expect(applyInactivityDecay(10, 4)).toBe(10));
  it('applies 3+ correct momentum', () => {
    const withoutMomentum = challengeVectorDelta(100, 'medium', vector, ['clarity'], 2).clarity!;
    const withMomentum = challengeVectorDelta(100, 'medium', vector, ['clarity'], 3).clarity!;
    expect(withMomentum).toBeGreaterThan(withoutMomentum);
  });
  it('maps maturity boundaries', () => {
    expect(maturityState({ clarity: 20, coherence: 20, depth: 20, structure: 20, secondOrder: 20, biasControl: 20 })).toBe('Reactive Operator');
    expect(maturityState({ clarity: 78, coherence: 78, depth: 78, structure: 78, secondOrder: 78, biasControl: 78 })).toBe('Systems Architect');
  });
});