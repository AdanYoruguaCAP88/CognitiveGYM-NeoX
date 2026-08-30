import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function isValidSupabaseUrl(value: string | undefined) {
  if (!value || value.includes('your_supabase_project_url')) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

function isValidAnonKey(value: string | undefined) {
  return Boolean(value && !value.includes('your_supabase_publishable_key'));
}

export const supabaseConfigError =
  !isValidSupabaseUrl(url) || !isValidAnonKey(anonKey)
    ? 'La configuración de Supabase no está disponible en esta implementación. Verificá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel y redeployá.'
    : null;

// The client remains typed and import-safe. Authentication calls are blocked by the
// configuration guards when the production environment is incomplete.
export const supabase = createClient(
  url || 'https://configuration-missing.invalid',
  anonKey || 'configuration-missing'
);
