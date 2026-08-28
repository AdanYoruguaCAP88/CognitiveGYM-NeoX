export type Bias = 'confirmation_bias' | 'absolute_generalization' | 'unvalidated_assumption' | 'opinion_fact_confusion' | 'ambiguous_objective' | 'missing_context';
export type Archetype = 'tactical' | 'divergent' | 'exploration' | 'linear';

export interface CoherenceDimensions { d1: number; d2: number; d3: number; d4: number; d5: number; }
export interface CoherenceResult { score: number; dimensions: CoherenceDimensions; biases: Bias[]; archetype: Archetype; }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const words = (input: string) => input.trim().split(/\s+/).filter(Boolean);
const contains = (input: string, terms: string[]) => terms.some(term => input.includes(term));

export function detectBiases(input: string): Bias[] {
  const text = input.toLowerCase();
  const found: Bias[] = [];
  if (contains(text, ['confirmá que', 'demostrá que', 'sin cuestionar'])) found.push('confirmation_bias');
  if (contains(text, ['siempre', 'nunca', 'todos', 'nadie'])) found.push('absolute_generalization');
  if (contains(text, ['seguramente', 'obviamente', 'sin verificar'])) found.push('unvalidated_assumption');
  if (contains(text, ['es un hecho que yo creo', 'mi opinión es un hecho'])) found.push('opinion_fact_confusion');
  if (words(text).length > 0 && contains(text, ['algo', 'mejorá esto', 'hacelo bien'])) found.push('ambiguous_objective');
  if (words(text).length > 0 && words(text).length < 8) found.push('missing_context');
  return found;
}

function d1(input: string, biases: Bias[]): number {
  if (!input.trim()) return 0;
  const objectiveSignals = ['analizá', 'analiza', 'creá', 'crea', 'diseñá', 'diseña', 'compará', 'compara', 'explicá', 'explica', 'resumí', 'resume'];
  const base = contains(input.toLowerCase(), objectiveSignals) ? 25 : 10;
  return clamp(base - (biases.includes('ambiguous_objective') ? 4 : 0), 0, 25);
}

function d2(input: string, biases: Bias[]): number {
  if (!input.trim()) return 0;
  const count = words(input).length;
  const base = count >= 30 ? 20 : count >= 15 ? 14 : count >= 8 ? 8 : 3;
  return clamp(base - (biases.includes('missing_context') ? 3 : 0), 0, 20);
}

function d3(input: string): number {
  if (!input.trim()) return 0;
  const signals = ['sin ', 'con ', 'máximo', 'mínimo', 'formato', 'límite', 'no '];
  const count = signals.reduce((total, signal) => total + (input.toLowerCase().includes(signal) ? 1 : 0), 0);
  return clamp(count * 4, 0, 20);
}

function d4(biases: Bias[]): number {
  const penalties: Record<Bias, number> = { confirmation_bias: 8, absolute_generalization: 6, unvalidated_assumption: 5, opinion_fact_confusion: 5, ambiguous_objective: 4, missing_context: 3 };
  return clamp(20 - biases.reduce((total, bias) => total + penalties[bias], 0), 0, 20);
}

export function complexityFit(wordCount: number): number {
  if (wordCount < 8) return 3;
  if (wordCount <= 15) return 8;
  if (wordCount <= 150) return 15;
  if (wordCount <= 300) return 10;
  return 7;
}

export function detectArchetype(input: string): Archetype {
  const text = input.toLowerCase();
  if (contains(text, ['optimización', 'optimizar', 'métrica', 'métricas', 'kpi'])) return 'tactical';
  if (contains(text, ['creación', 'crear', 'innovación', 'innovar'])) return 'divergent';
  if (contains(text, ['aprendizaje', 'aprender', 'incertidumbre', 'explorar'])) return 'exploration';
  return 'linear';
}

export function scoreCoherence(input: string): CoherenceResult {
  if (!input.trim()) return { score: 0, dimensions: { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0 }, biases: [], archetype: 'linear' };
  const biases = detectBiases(input);
  const dimensions = { d1: d1(input, biases), d2: d2(input, biases), d3: d3(input), d4: d4(biases), d5: complexityFit(words(input).length) };
  return { score: dimensions.d1 + dimensions.d2 + dimensions.d3 + dimensions.d4 + dimensions.d5, dimensions, biases, archetype: detectArchetype(input) };
}