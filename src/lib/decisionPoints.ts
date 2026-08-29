import { supabase } from './supabase';

export type DecisionPointType = 'prompt' | 'challenge' | 'diagnosis';
export type PromptDecisionInput = {
  userId: string; template: 'contenido'|'estrategia'|'producto'|'linkedin';
  rawInput: string; generatedOutput: string | null; coherenceScore: number; wasBlocked: boolean;
  biases: string[];
};

export async function savePromptDecision(input: PromptDecisionInput) {
  const { error } = await supabase.from('decision_points').insert({
    user_id: input.userId, type: 'prompt', template: input.template, raw_input: input.rawInput,
    generated_output: input.generatedOutput, coherence_score: Math.round(input.coherenceScore),
    was_blocked: input.wasBlocked, biases: input.biases
  });
  if (error) throw error;
}

export async function listDecisionPoints(userId: string) {
  const { data, error } = await supabase.from('decision_points').select('*').eq('user_id', userId).order('created_at',{ascending:false});
  if (error) throw error;
  return data ?? [];
}

export async function currentPlan(userId: string): Promise<'free'|'trial'|'premium'> {
  const { data, error } = await supabase.from('subscriptions').select('plan').eq('user_id', userId).eq('status','active').order('created_at',{ascending:false}).limit(1).maybeSingle();
  if (error) throw error;
  return (data?.plan ?? 'free') as 'free'|'trial'|'premium';
}