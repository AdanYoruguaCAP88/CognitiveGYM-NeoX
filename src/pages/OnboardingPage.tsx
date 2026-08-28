import { useState } from 'react';

const STEPS = ['Encuadre', 'Expectativas', 'Regla operativa', 'Filosofía', 'Primer objetivo'] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  return (
    <section className="screen onboarding">
      <p className="eyebrow">CognitiveGYM-NeoX · Onboarding</p>
      <p className="progress">Paso {step + 1} de {STEPS.length}</p>
      <h1>{STEPS[step]}</h1>
      <p>Contenido de este paso pendiente de la especificación exacta.</p>

      <div className="step-actions">
        <button className="button ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Anterior</button>
        <button
          className="button primary"
          onClick={() => setStep((value) => Math.min(STEPS.length - 1, value + 1))}
          disabled={step === STEPS.length - 1}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}