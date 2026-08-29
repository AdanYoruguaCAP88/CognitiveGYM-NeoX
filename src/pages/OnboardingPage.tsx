import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getCurrentCognitiveVector,
  getOnboardingStatus,
  persistDiagnosis
} from '../lib/onboarding';
import {
  createDiagnosis,
  toDiagnosisPersistenceInput
} from '../lib/engine/diagnosis';
import type { Bias, CoherenceDimensions } from '../lib/engine/coherence';

const STEPS = ['Encuadre', 'Expectativas', 'Regla operativa', 'Filosofía', 'Primer objetivo'] as const;
const BIASES: Bias[] = [
  'Sesgo de confirmación',
  'Generalización absoluta',
  'Suposición no validada',
  'Confusión opinión/hecho',
  'Objetivo ambiguo',
  'Contexto ausente'
];

const INITIAL_DIMENSIONS: CoherenceDimensions = {
  objectiveClarity: 0,
  contextRichness: 0,
  constraintDefinition: 0
};

export default function OnboardingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'loading' | 'pending' | 'complete' | 'error'>('loading');
  const [dimensions, setDimensions] = useState<CoherenceDimensions>(INITIAL_DIMENSIONS);
  const [biases, setBiases] = useState<Bias[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!session?.user.id) return;
    let active = true;
    getOnboardingStatus(session.user.id)
      .then((value) => { if (active) setStatus(value); })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [session?.user.id]);

  if (!session) return <Navigate to="/auth" replace />;
  if (status === 'complete') return <Navigate to="/" replace />;
  if (status === 'loading') return <section className="screen"><p>Verificando onboarding…</p></section>;
  if (status === 'error') return <section className="screen"><h1>No se pudo verificar el onboarding</h1><p>Reintentá cuando la conexión esté disponible.</p></section>;

  const isLastStep = step === STEPS.length - 1;

  function toggleBias(bias: Bias) {
    setBiases((current) => current.includes(bias)
      ? current.filter((item) => item !== bias)
      : [...current, bias]);
  }

  async function completeDiagnosis() {
    if (!session?.user.id || submitting) return;
    if (!text.trim()) {
      setMessage('Ingresá tu primer objetivo antes de continuar.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const vector = await getCurrentCognitiveVector(session.user.id);
      const diagnosis = createDiagnosis(dimensions, biases, text, vector, vector);
      await persistDiagnosis(toDiagnosisPersistenceInput(session.user.id, diagnosis));
      setStatus('complete');
      navigate('/', { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el diagnóstico.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="screen onboarding">
      <p className="eyebrow">CognitiveGYM-NeoX · Onboarding</p>
      <p className="progress">Paso {step + 1} de {STEPS.length}</p>
      <h1>{STEPS[step]}</h1>

      {!isLastStep && (
        <p>Este paso conserva el encuadre definido para el onboarding.</p>
      )}

      {isLastStep && (
        <div className="auth-form">
          <label>
            Primer objetivo
            <textarea value={text} onChange={(event) => setText(event.target.value)} required />
          </label>

          <label>
            Claridad del objetivo (0–25)
            <input type="number" min="0" max="25" value={dimensions.objectiveClarity} onChange={(event) => setDimensions((value) => ({ ...value, objectiveClarity: Number(event.target.value) }))} />
          </label>

          <label>
            Riqueza del contexto (0–20)
            <input type="number" min="0" max="20" value={dimensions.contextRichness} onChange={(event) => setDimensions((value) => ({ ...value, contextRichness: Number(event.target.value) }))} />
          </label>

          <label>
            Definición de restricciones (0–20)
            <input type="number" min="0" max="20" value={dimensions.constraintDefinition} onChange={(event) => setDimensions((value) => ({ ...value, constraintDefinition: Number(event.target.value) }))} />
          </label>

          <fieldset>
            <legend>Sesgos identificados</legend>
            {BIASES.map((bias) => (
              <label key={bias}>
                <input type="checkbox" checked={biases.includes(bias)} onChange={() => toggleBias(bias)} />
                {bias}
              </label>
            ))}
          </fieldset>

          {message && <p role="status">{message}</p>}
        </div>
      )}

      <div className="step-actions">
        <button className="button ghost" type="button" disabled={step === 0 || submitting} onClick={() => setStep((value) => Math.max(0, value - 1))}>Anterior</button>
        {isLastStep
          ? <button className="button primary" type="button" disabled={submitting} onClick={() => { void completeDiagnosis(); }}>{submitting ? 'Guardando…' : 'Finalizar diagnóstico'}</button>
          : <button className="button primary" type="button" disabled={submitting} onClick={() => setStep((value) => value + 1)}>Siguiente</button>}
      </div>
    </section>
  );
}