import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError =
  !url || !anonKey
    ? 'Falta la configuración de Supabase. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en las variables de entorno de Vercel.'
    : null;

export const supabase = createClient(
  url || 'https://configuration-missing.invalid',
  anonKey || 'configuration-missing'
);
