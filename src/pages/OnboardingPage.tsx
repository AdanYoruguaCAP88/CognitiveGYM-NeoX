import { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const TOTAL_STEPS = 5;

const questions = [
  {
    id: 'objective',
    title: 'Objetivo',
    prompt: '¿Qué querés entrenar o mejorar?',
    options: ['Claridad de objetivos', 'Coherencia del razonamiento', 'Decisiones bajo restricciones', 'Exploración y aprendizaje']
  },
  {
    id: 'context',
    title: 'Contexto',
    prompt: '¿En qué contexto querés aplicar el entrenamiento?',
    options: ['Trabajo operativo', 'Uso de IA', 'Decisiones personales', 'Sistemas complejos']
  },
  {
    id: 'constraints',
    title: 'Restricciones',
    prompt: '¿Qué condición querés tener presente?',
    options: ['Tiempo limitado', 'Información incompleta', 'Múltiples alternativas', 'Ninguna específica']
  },
  {
    id: 'experience',
    title: 'Experiencia',
    prompt: '¿Cómo describís tu punto de partida?',
    options: ['Inicial', 'Intermedio', 'Avanzado', 'Quiero explorarlo']
  },
  {
    id: 'review',
    title: 'Revisión',
    prompt: 'Revisá tus respuestas antes de finalizar.',
    options: []
  }
] as const;

type Answers = Record<string, string>;

export default function OnboardingPage() {
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const current = questions[step];
  const complete = useMemo(
    () => questions.slice(0, TOTAL_STEPS - 1).every((question) => Boolean(answers[question.id])),
    [answers]
  );

  const choose = (value: string) => setAnswers((previous) => ({ ...previous, [current.id]: value }));

  return (
    <section className="screen onboarding">
      <p className="eyebrow">CognitiveGYM-NeoX · Onboarding</p>
      <p className="progress">Paso {step + 1} de {TOTAL_STEPS}</p>
      <h1>{current.title}</h1>

      {step < TOTAL_STEPS - 1 ? (
        <>
          <p>{current.prompt}</p>
          <div className="option-grid">
            {current.options.map((option) => (
              <button
                className={answers[current.id] === option ? 'option selected' : 'option'}
                key={option}
                onClick={() => choose(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>{current.prompt}</p>
          <dl className="review-list">
            {questions.slice(0, TOTAL_STEPS - 1).map((question) => (
              <div key={question.id}>
                <dt>{question.title}</dt>
                <dd>{answers[question.id] ?? 'Sin respuesta'}</dd>
              </div>
            ))}
          </dl>
          <p className="muted">Usuario: {session?.user.email}</p>
        </>
      )}

      <div className="step-actions">
        <button className="button ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Anterior</button>
        {step < TOTAL_STEPS - 1 ? (
          <button className="button primary" disabled={!answers[current.id]} onClick={() => setStep((value) => Math.min(TOTAL_STEPS - 1, value + 1))}>Siguiente</button>
        ) : (
          <button className="button primary" disabled={!complete}>Finalizar diagnóstico</button>
        )}
      </div>
    </section>
  );
}