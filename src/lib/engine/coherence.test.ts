import { describe, expect, it } from 'vitest';
import { complexityFit, detectArchetype, scoreCoherence } from './coherence';

describe('coherence engine', () => {
  it('scores empty input at zero', () => expect(scoreCoherence('')).toMatchObject({ score: 0 }));
  it('handles complexity boundaries', () => {
    expect(complexityFit(7)).toBe(3);
    expect(complexityFit(8)).toBe(8);
    expect(complexityFit(15)).toBe(8);
    expect(complexityFit(16)).toBe(15);
    expect(complexityFit(150)).toBe(15);
    expect(complexityFit(151)).toBe(10);
    expect(complexityFit(300)).toBe(10);
    expect(complexityFit(301)).toBe(7);
  });
  it('uses archetype precedence', () => expect(detectArchetype('crear innovación para optimizar métricas')).toBe('tactical'));
  it('detects explicit bias and penalizes D4', () => {
    const result = scoreCoherence('Analizá esto siempre sin cuestionar');
    expect(result.biases).toContain('confirmation_bias');
    expect(result.biases).toContain('absolute_generalization');
    expect(result.dimensions.d4).toBeLessThan(20);
  });
});