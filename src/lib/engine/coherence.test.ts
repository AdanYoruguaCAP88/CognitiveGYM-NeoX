import { describe, expect, it } from 'vitest';
import {
  biasClean,
  coherenceScore,
  complexityFit,
  detectArchetype,
  type Bias
} from './coherence';

describe('coherence engine', () => {
  it('applies exact complexity bands', () => {
    expect(complexityFit(7)).toBe(3);
    expect(complexityFit(8)).toBe(8);
    expect(complexityFit(15)).toBe(8);
    expect(complexityFit(16)).toBe(15);
    expect(complexityFit(150)).toBe(15);
    expect(complexityFit(151)).toBe(10);
    expect(complexityFit(300)).toBe(10);
    expect(complexityFit(301)).toBe(7);
  });

  it('starts D4 at 20 and never goes below zero', () => {
    const biases: Bias[] = [
      'Sesgo de confirmación',
      'Generalización absoluta',
      'Suposición no validada',
      'Confusión opinión/hecho',
      'Objetivo ambiguo',
      'Contexto ausente'
    ];
    expect(biasClean([])).toBe(20);
    expect(biasClean(biases)).toBe(0);
  });

  it('sums D1 through D5 and clamps dimension inputs', () => {
    const result = coherenceScore(
      { objectiveClarity: 30, contextRichness: 25, constraintDefinition: 25, complexityFit: 0 },
      [],
      16,
      ''
    );
    expect(result.d1).toBe(25);
    expect(result.d2).toBe(20);
    expect(result.d3).toBe(20);
    expect(result.d4).toBe(20);
    expect(result.d5).toBe(15);
    expect(result.score).toBe(100);
  });

  it('evaluates archetypes in the documented priority order', () => {
    expect(detectArchetype('optimización con métricas, creación e innovación')).toBe('Táctico');
    expect(detectArchetype('creación e innovación')).toBe('Divergente');
    expect(detectArchetype('aprendizaje e incertidumbre')).toBe('Exploración');
    expect(detectArchetype('texto neutro')).toBe('Lineal');
  });
});