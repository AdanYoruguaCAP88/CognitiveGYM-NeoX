import {
  coherenceScore,
  type Archetype,
  type Bias,
  type CoherenceDimensions,
  type CoherenceResult
} from './coherence';
import type { CognitiveVector } from './adaptive';
import { toPersistenceArchetype, type DiagnosisPersistenceInput } from '../onboarding';

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

export function toDiagnosisPersistenceInput(userId: string, diagnosis: DiagnosisResult): DiagnosisPersistenceInput {
  return {
    userId,
    coherenceScore: diagnosis.coherence.score,
    archetype: toPersistenceArchetype(diagnosis.archetype),
    biases: diagnosis.biases,
    vectorBefore: diagnosis.vectorBefore,
    vectorAfter: diagnosis.vectorAfter
  };
}