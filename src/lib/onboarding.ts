import { supabase } from './supabase';

export type OnboardingStatus = 'loading' | 'pending' | 'complete';

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

export async function persistDiagnosis(input: {
  userId: string;
  coherenceScore: number;
  archetype: 'lineal' | 'divergente' | 'tactico' | 'exploracion';
  biases: string[];
  vectorBefore: Record<string, number>;
  vectorAfter: Record<string, number>;
}) {
  const { error } = await supabase.from('decision_points').insert({
    user_id: input.userId,
    type: 'diagnosis',
    coherence_score: input.coherenceScore,
    archetype: input.archetype,
    biases: input.biases,
    vector_before: input.vectorBefore,
    vector_after: input.vectorAfter
  });

  if (error) throw error;
}