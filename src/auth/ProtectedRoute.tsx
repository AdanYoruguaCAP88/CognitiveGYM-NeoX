import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Verificando sesión…</p>;
  if (!session) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;

  return <>{children}</>;
}