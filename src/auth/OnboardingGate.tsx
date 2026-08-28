import { Navigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getOnboardingStatus } from '../lib/onboarding';

export function OnboardingGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'pending' | 'complete' | 'error'>('loading');

  useEffect(() => {
    if (!session?.user.id) {
      setStatus('loading');
      return;
    }

    let active = true;
    getOnboardingStatus(session.user.id)
      .then((value) => active && setStatus(value))
      .catch(() => active && setStatus('error'));

    return () => { active = false; };
  }, [session?.user.id]);

  if (loading || status === 'loading') return <p>Verificando acceso…</p>;
  if (!session) return <Navigate to="/auth" replace />;
  if (status === 'pending') return <Navigate to="/onboarding" replace />;
  if (status === 'error') return <section className="screen"><h1>No se pudo verificar el onboarding</h1><p>Reintentá cuando la conexión esté disponible.</p></section>;

  return <>{children}</>;
}