import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getOnboardingStatus } from '../lib/onboarding';

export function ProtectedRoute({ children, requireDiagnosis = false }: { children: ReactNode; requireDiagnosis?: boolean }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!session) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;

  // Diagnosis lookup is intentionally not enforced here until the exact
  // persistence schema and final diagnosis result are both verified.
  void requireDiagnosis;
  void getOnboardingStatus;

  return <>{children}</>;
}