import { supabase } from './supabase';
export type Plan = 'free'|'trial'|'premium';
export async function currentPlan(userId:string):Promise<Plan>{const {data,error}=await supabase.from('subscriptions').select('plan').eq('user_id',userId).eq('status','active').order('created_at',{ascending:false}).limit(1).maybeSingle();if(error)throw error;return (data?.plan??'free') as Plan;}