import { describe, expect, it } from 'vitest';
import { createDiagnosis, toDiagnosisPersistenceInput } from './diagnosis';
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
    expect(result.vectorBefore?.clarity).toBe(30);
    expect(result.vectorAfter?.clarity).toBe(40);
  });

  it('creates the canonical persistence payload from a diagnosis', () => {
    const diagnosis = createDiagnosis(
      { objectiveClarity: 10, contextRichness: 10, constraintDefinition: 10 },
      [],
      'creación e innovación',
      vector(20),
      vector(30)
    );
    const payload = toDiagnosisPersistenceInput('user-1', diagnosis);
    expect(payload.userId).toBe('user-1');
    expect(payload.archetype).toBe('divergente');
    expect(payload.coherenceScore).toBe(diagnosis.coherence.score);
  });
});