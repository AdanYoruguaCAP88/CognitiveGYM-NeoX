import { describe, expect, it } from 'vitest';
import {
  biasClean,
  coherenceScore,
  complexityFit,
  countWords,
  detectArchetype,
  type Bias
} from './coherence';

describe('coherence engine', () => {
  it('counts normalized words from prompt text', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('  uno   dos tres  ')).toBe(3);
  });

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

  it('derives D5 from the supplied prompt text', () => {
    const result = coherenceScore(
      { objectiveClarity: 25, contextRichness: 20, constraintDefinition: 20 },
      [],
      'uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis'
    );
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