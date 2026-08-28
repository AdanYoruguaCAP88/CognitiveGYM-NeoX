export type Bias =
  | 'Sesgo de confirmación'
  | 'Generalización absoluta'
  | 'Suposición no validada'
  | 'Confusión opinión/hecho'
  | 'Objetivo ambiguo'
  | 'Contexto ausente';

export type Archetype = 'Táctico' | 'Divergente' | 'Exploración' | 'Lineal';

export type CoherenceDimensions = {
  objectiveClarity: number;
  contextRichness: number;
  constraintDefinition: number;
};

export type CoherenceResult = {
  score: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  d5: number;
  biases: Bias[];
  archetype: Archetype;
};

const BIAS_PENALTIES: Record<Bias, number> = {
  'Sesgo de confirmación': 8,
  'Generalización absoluta': 6,
  'Suposición no validada': 5,
  'Confusión opinión/hecho': 5,
  'Objetivo ambiguo': 4,
  'Contexto ausente': 3
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function countWords(text: string): number {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

export function complexityFit(wordCount: number): number {
  if (wordCount < 8) return 3;
  if (wordCount <= 15) return 8;
  if (wordCount <= 150) return 15;
  if (wordCount <= 300) return 10;
  return 7;
}

export function biasClean(biases: Bias[]): number {
  const penalty = biases.reduce((sum, bias) => sum + BIAS_PENALTIES[bias], 0);
  return clamp(20 - penalty, 0, 20);
}

export function detectArchetype(text: string): Archetype {
  const value = text.toLocaleLowerCase();
  const includesAny = (...keywords: string[]) => keywords.some((keyword) => value.includes(keyword));

  if (includesAny('optimización', 'optimizar') && includesAny('métrica', 'métricas')) return 'Táctico';
  if (includesAny('creación', 'crear') && includesAny('innovación', 'innovar')) return 'Divergente';
  if (includesAny('aprendizaje', 'aprender') && includesAny('incertidumbre', 'incierto')) return 'Exploración';
  return 'Lineal';
}

export function coherenceScore(
  dimensions: CoherenceDimensions,
  biases: Bias[],
  text: string
): CoherenceResult {
  const d1 = clamp(dimensions.objectiveClarity, 0, 25);
  const d2 = clamp(dimensions.contextRichness, 0, 20);
  const d3 = clamp(dimensions.constraintDefinition, 0, 20);
  const d4 = biasClean(biases);
  const d5 = complexityFit(countWords(text));

  return {
    score: d1 + d2 + d3 + d4 + d5,
    d1,
    d2,
    d3,
    d4,
    d5,
    biases,
    archetype: detectArchetype(text)
  };
}