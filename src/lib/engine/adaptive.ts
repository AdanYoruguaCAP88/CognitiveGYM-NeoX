export type Difficulty = 'easy' | 'medium' | 'hard';
export type VectorDimension = 'clarity' | 'coherence' | 'depth' | 'structure' | 'secondOrder' | 'biasControl';
export type CognitiveVector = Record<VectorDimension, number>;

export const SYSTEM_WEIGHTS: Record<VectorDimension, number> = {
  secondOrder: 1.5, biasControl: 1.4, coherence: 1.2, clarity: 1, structure: 1, depth: 0.9
};

const average = (values: number[]) => values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

export function cognitiveGain(history: number[]): number {
  const window = history.slice(-20);
  if (window.length === 0) return 0;

  const decisions = window.filter((value) => value >= 75).length;
  const weightContext = 0.4 + (average(window) / 100) * 0.9;
  const regression = window.filter((value) => value < 50).length / 20;
  const volatilityWindow = window.slice(-10);
  const mean = average(volatilityWindow);
  const variance = average(volatilityWindow.map((value) => (value - mean) ** 2));
  const volatility = Math.sqrt(variance) / 100;

  return decisions * weightContext - regression * volatility;
}

export function applyInactivityDecay(value: number, weeksInactive: number): number {
  const weeks = Math.max(0, weeksInactive);
  const decayed = Math.max(20, value * Math.pow(1 - 0.03, weeks));
  return Math.min(value, decayed);
}

export function challengeVectorDelta(score: number, difficulty: Difficulty, current: Partial<CognitiveVector>, targets: VectorDimension[], consecutiveCorrect: number): Partial<CognitiveVector> {
  const multiplier: Record<Difficulty, number> = { easy: 0.6, medium: 1, hard: 1.5 };
  const momentum = consecutiveCorrect >= 3 ? 1.3 : 1;
  const impact = (score / 100) * 18 * multiplier[difficulty] * momentum;

  return targets.reduce<Partial<CognitiveVector>>((delta, dimension) => {
    delta[dimension] = impact * (1 - ((current[dimension] ?? 0) / 100) * 0.5);
    return delta;
  }, {});
}

export function maturityState(vector: CognitiveVector): 'Reactive Operator' | 'Structured Thinker' | 'Constraint Designer' | 'Strategic Operator' | 'Systems Architect' {
  const weighted = Object.entries(SYSTEM_WEIGHTS).reduce((sum, [key, weight]) => sum + vector[key as VectorDimension] * weight, 0);
  const score = weighted / Object.values(SYSTEM_WEIGHTS).reduce((sum, weight) => sum + weight, 0);

  if (score < 25) return 'Reactive Operator';
  if (score < 45) return 'Structured Thinker';
  if (score < 62) return 'Constraint Designer';
  if (score < 78) return 'Strategic Operator';
  return 'Systems Architect';
}