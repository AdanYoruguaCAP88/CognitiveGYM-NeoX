import {
  coherenceScore,
  type Archetype,
  type Bias,
  type CoherenceDimensions,
  type CoherenceResult
} from './coherence';
import type { CognitiveVector } from './adaptive';

export type DiagnosisResult = {
  coherence: CoherenceResult;
  archetype: Archetype;
  biases: Bias[];
  vectorBefore: CognitiveVector;
  vectorAfter: CognitiveVector;
};

export function createDiagnosis(
  dimensions: CoherenceDimensions,
  biases: Bias[],
  text: string,
  vectorBefore: CognitiveVector,
  vectorAfter: CognitiveVector
): DiagnosisResult {
  const coherence = coherenceScore(dimensions, biases, text);

  return {
    coherence,
    archetype: coherence.archetype,
    biases: coherence.biases,
    vectorBefore,
    vectorAfter
  };
}