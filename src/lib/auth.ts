import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle(nextPath = '/') {
  const target = new URL('/auth', window.location.origin);
  target.searchParams.set(
    'next',
    nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/'
  );

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: target.toString()
    }
  });
}

export async function requestPasswordRecovery(email: string) {
  const redirectTo = new URL('/auth', window.location.origin);
  redirectTo.searchParams.set('recovery', '1');

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString()
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
