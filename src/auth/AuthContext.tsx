import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigError } from '../lib/supabase';

type AuthContextValue = { session: Session | null; loading: boolean; configError: string | null };
const AuthContext = createContext<AuthContextValue>({ session: null, loading: true, configError: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!supabaseConfigError);

  useEffect(() => {
    if (supabaseConfigError) {
      setLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession()
      .then(({ data }) => {
        if (active) {
          setSession(data.session);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ session, loading, configError: supabaseConfigError }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
