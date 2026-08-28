import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getOnboardingStatus } from '../lib/onboarding';

const STEPS = ['Encuadre', 'Expectativas', 'Regla operativa', 'Filosofía', 'Primer objetivo'] as const;

export default function OnboardingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'loading' | 'pending' | 'complete' | 'error'>('loading');

  useEffect(() => {
    if (!session?.user.id) return;
    getOnboardingStatus(session.user.id)
      .then(setStatus)
      .catch(() => setStatus('error'));
  }, [session?.user.id]);

  if (!session) return <Navigate to="/auth" replace />;
  if (status === 'complete') return <Navigate to="/" replace />;
  if (status === 'loading') return <section className="screen"><p>Verificando onboarding…</p></section>;
  if (status === 'error') return <section className="screen"><h1>No se pudo verificar el onboarding</h1><p>Reintentá cuando la conexión esté disponible.</p></section>;

  const isLastStep = step === STEPS.length - 1;

  function next() {
    if (isLastStep) {
      // A completion transition is intentionally not performed here.
      // The specification requires a real diagnosis result before persistence.
      return;
    }
    setStep((value) => value + 1);
  }

  return (
    <section className="screen onboarding">
      <p className="eyebrow">CognitiveGYM-NeoX · Onboarding</p>
      <p className="progress">Paso {step + 1} de {STEPS.length}</p>
      <h1>{STEPS[step]}</h1>
      <p>Contenido de este paso pendiente de la especificación exacta.</p>
      <div className="step-actions">
        <button className="button ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Anterior</button>
        <button className="button primary" onClick={next} disabled={isLastStep}>{isLastStep ? 'Diagnóstico pendiente' : 'Siguiente'}</button>
      </div>
      <button className="button ghost" type="button" onClick={() => navigate('/')} hidden={status !== 'complete'}>Ir al inicio</button>
    </section>
  );
}