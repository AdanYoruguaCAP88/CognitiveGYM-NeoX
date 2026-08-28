export type Difficulty = 'easy' | 'medium' | 'hard';
export type VectorDimension = 'clarity' | 'coherence' | 'depth' | 'structure' | 'secondOrder' | 'biasControl';
export type CognitiveVector = Record<VectorDimension, number>;

export const SYSTEM_WEIGHTS: Record<VectorDimension, number> = { secondOrder: 1.5, biasControl: 1.4, coherence: 1.2, clarity: 1, structure: 1, depth: 0.9 };

export function cognitiveGain(history: number[]): number {
  const window = history.slice(-20);
  if (!window.length) return 0;
  const average = window.reduce((sum, value) => sum + value, 0) / window.length;
  const dc = window.filter(value => value >= 75).length;
  const wctx = 0.4 + (average / 100) * 0.9;
  const r = window.filter(value => value < 50).length / 20;
  const last10 = window.slice(-10);
  const mean10 = last10.reduce((sum, value) => sum + value, 0) / last10.length;
  const variance = last10.reduce((sum, value) => sum + (value - mean10) ** 2, 0) / last10.length;
  const v = Math.sqrt(variance) / 100;
  return dc * wctx - r * v;
}

export function applyInactivityDecay(value: number, weeksInactive: number): number {
  const decayed = Math.max(20, value * Math.pow(1 - 0.03, Math.max(0, weeksInactive)));
  return Math.min(value, decayed);
}

export function challengeVectorDelta(score: number, difficulty: Difficulty, current: Partial<CognitiveVector>, targets: VectorDimension[], consecutiveCorrect: number): Partial<CognitiveVector> {
  const difficultyMultiplier: Record<Difficulty, number> = { easy: 0.6, medium: 1, hard: 1.5 };
  const momentum = consecutiveCorrect >= 3 ? 1.3 : 1;
  const baseImpact = (score / 100) * 18 * difficultyMultiplier[difficulty] * momentum;
  return targets.reduce<Partial<CognitiveVector>>((delta, dimension) => {
    const currentValue = current[dimension] ?? 0;
    delta[dimension] = baseImpact * (1 - (currentValue / 100) * 0.5);
    return delta;
  }, {});
}

export function maturityState(vector: CognitiveVector): 'Reactive Operator' | 'Structured Thinker' | 'Constraint Designer' | 'Strategic Operator' | 'Systems Architect' {
  const values = Object.values(vector);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (average < 25) return 'Reactive Operator';
  if (average < 45) return 'Structured Thinker';
  if (average < 62) return 'Constraint Designer';
  if (average < 78) return 'Strategic Operator';
  return 'Systems Architect';
}