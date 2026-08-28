import { describe, expect, it } from 'vitest';
import { createDiagnosis } from './diagnosis';
import type { CognitiveVector } from './adaptive';

const vector = (value: number): CognitiveVector => ({
  clarity: value,
  coherence: value,
  depth: value,
  structure: value,
  secondOrder: value,
  biasControl: value
});

describe('diagnosis integration', () => {
  it('keeps coherence output and persistence vector data type-compatible', () => {
    const result = createDiagnosis(
      { objectiveClarity: 20, contextRichness: 15, constraintDefinition: 10 },
      [],
      'optimización con métricas para mejorar el sistema',
      vector(30),
      vector(40)
    );

    expect(result.coherence.score).toBeGreaterThanOrEqual(0);
    expect(result.coherence.score).toBeLessThanOrEqual(100);
    expect(result.archetype).toBe('Táctico');
    expect(result.vectorBefore.clarity).toBe(30);
    expect(result.vectorAfter.clarity).toBe(40);
  });
});