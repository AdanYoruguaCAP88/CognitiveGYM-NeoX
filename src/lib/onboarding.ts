import { supabase } from './supabase';
import type { Archetype } from './engine/coherence';
import type { CognitiveVector } from './engine/adaptive';

export type OnboardingStatus = 'pending' | 'complete';

const ARCHETYPE_STORAGE: Record<Archetype, DiagnosisPersistenceInput['archetype']> = {
  Táctico: 'tactico',
  Divergente: 'divergente',
  Exploración: 'exploracion',
  Lineal: 'lineal'
};

export function toPersistenceArchetype(archetype: Archetype): DiagnosisPersistenceInput['archetype'] {
  return ARCHETYPE_STORAGE[archetype];
}

export async function getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  const { data, error } = await supabase
    .from('decision_points')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'diagnosis')
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? 'complete' : 'pending';
}

export async function getCurrentCognitiveVector(userId: string): Promise<CognitiveVector | null> {
  const { data, error } = await supabase
    .from('cognitive_vectors')
    .select('clarity, coherence, depth, structure, second_order, bias_control')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    clarity: Number(data.clarity),
    coherence: Number(data.coherence),
    depth: Number(data.depth),
    structure: Number(data.structure),
    secondOrder: Number(data.second_order),
    biasControl: Number(data.bias_control)
  };
}

export type DiagnosisPersistenceInput = {
  userId: string;
  coherenceScore: number;
  archetype: 'lineal' | 'divergente' | 'tactico' | 'exploracion';
  biases: string[];
  vectorBefore: Record<string, number> | null;
  vectorAfter: Record<string, number> | null;
};

export async function persistDiagnosis(input: DiagnosisPersistenceInput) {
  const { data: existing, error: lookupError } = await supabase
    .from('decision_points')
    .select('id')
    .eq('user_id', input.userId)
    .eq('type', 'diagnosis')
    .limit(1);

  if (lookupError) throw lookupError;
  if (existing && existing.length > 0) return existing[0];

  const { data, error } = await supabase
    .from('decision_points')
    .insert({
      user_id: input.userId,
      type: 'diagnosis',
      coherence_score: input.coherenceScore,
      archetype: input.archetype,
      biases: input.biases,
      vector_before: input.vectorBefore,
      vector_after: input.vectorAfter
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}