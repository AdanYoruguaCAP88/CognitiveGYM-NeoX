import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://ihmmstiqjyhpocktsuse.supabase.co';
const fallbackAnonKey = 'sb_publishable_uNulIBBHmQsN_D_H-8-ZRw_pT1RhH7e';

const url = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackAnonKey;

export const supabase = createClient(url, anonKey);
