import { useMemo, useState } from 'react';
import { cognitiveGain, maturityState, type CognitiveVector } from '../lib/engine/adaptive';

const initial: CognitiveVector = { clarity: 42, coherence: 48, depth: 44, structure: 51, secondOrder: 38, biasControl: 46 };

export default function DashboardPage() {
  const [history] = useState([44, 51, 49, 56, 61]);
  const vector = initial;
  const gain = useMemo(() => cognitiveGain(history), [history]);
  const state = maturityState(vector);

  return <section className="screen">
    <p className="eyebrow">CognitiveGYM-NeoX</p>
    <h1>Dashboard</h1>
    <p>Estado cognitivo actual basado en el vector y el historial disponible.</p>
    <div className="metrics-grid">
      <article><strong>{state}</strong><span>Estado de madurez</span></article>
      <article><strong>{gain.toFixed(2)}</strong><span>Ganancia cognitiva</span></article>
      {Object.entries(vector).map(([key, value]) => <article key={key}><strong>{value}</strong><span>{key}</span></article>)}
    </div>
  </section>;
}