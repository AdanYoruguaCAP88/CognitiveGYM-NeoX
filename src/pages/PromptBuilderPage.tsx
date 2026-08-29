import { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { coherenceScore, type CoherenceDimensions } from '../lib/engine/coherence';
import { savePromptDecision } from '../lib/decisionPoints';

const templates = {
  contenido: 'Contenido', estrategia: 'Estrategia', producto: 'Producto', linkedin: 'LinkedIn'
} as const;
type Template = keyof typeof templates;

function detectBiases(text: string) {
  const value = text.toLocaleLowerCase();
  const biases: Array<Parameters<typeof coherenceScore>[1][number]> = [];
  if (value.includes('confirm')) biases.push('Sesgo de confirmación');
  if (/\b(siempre|nunca|todos|nadie)\b/.test(value)) biases.push('Generalización absoluta');
  if (value.includes('seguro que') || value.includes('sin duda')) biases.push('Suposición no validada');
  if (value.includes('mi opinión es') || value.includes('creo que es un hecho')) biases.push('Confusión opinión/hecho');
  if (!value.trim()) biases.push('Objetivo ambiguo','Contexto ausente');
  return biases;
}

export default function PromptBuilderPage() {
  const { session } = useAuth();
  const [template,setTemplate] = useState<Template>('contenido');
  const [text,setText] = useState('');
  const [dimensions,setDimensions] = useState<CoherenceDimensions>({objectiveClarity:0,contextRichness:0,constraintDefinition:0});
  const [saved,setSaved] = useState('');
  const [saving,setSaving] = useState(false);
  const biases = useMemo(()=>detectBiases(text),[text]);
  const result = useMemo(()=>coherenceScore(dimensions,biases,text),[dimensions,biases,text]);
  const blocked = result.score < 40;
  const warning = result.score >=40 && result.score <60;
  const output = blocked ? null : `[${templates[template]}] ${text.trim()}`;

  const submit = async () => {
    if (!session || !text.trim() || saving) return;
    setSaving(true); setSaved('');
    try { await savePromptDecision({userId:session.user.id,template,rawInput:text,generatedOutput:output,coherenceScore:result.score,wasBlocked:blocked,biases:result.biases}); setSaved(blocked ? 'Intento bloqueado y guardado para auditoría.' : 'Intento guardado.'); }
    catch (error) { setSaved(error instanceof Error ? error.message : 'No se pudo guardar el intento.'); }
    finally { setSaving(false); }
  };

  return <section className="screen">
    <p className="eyebrow">Ticket 5</p><h1>Constructor de prompts</h1>
    <label>Template<select value={template} onChange={e=>setTemplate(e.target.value as Template)}>{Object.entries(templates).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
    <label>Objetivo / input<textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Describe lo que quieres construir..." /></label>
    <div className="grid">{([
      ['objectiveClarity','Claridad del objetivo',25],['contextRichness','Riqueza de contexto',20],['constraintDefinition','Restricciones',20]
    ] as const).map(([key,label,max])=><label key={key}>{label}: {dimensions[key]}<input type="range" min="0" max={max} value={dimensions[key]} onChange={e=>setDimensions({...dimensions,[key]:Number(e.target.value)})}/></label>)}</div>
    <article className="card"><strong>Coherence Score: {result.score}/100</strong><p>D1 {result.d1} · D2 {result.d2} · D3 {result.d3} · D4 {result.d4} · D5 {result.d5}</p>
      {blocked && <p role="alert">Silencio Estratégico: generación bloqueada. Gaps: objetivo, contexto o restricciones insuficientes.</p>}
      {warning && <p role="status">Advertencia visible: el prompt puede generarse, pero requiere mayor coherencia.</p>}
      {!blocked && !warning && <p>Coherencia limpia.</p>}
    </article>
    {!blocked && output && <pre>{output}</pre>}
    <button className="button" onClick={()=>void submit()} disabled={!text.trim() || saving}>{saving ? 'Guardando…' : 'Guardar intento'}</button>
    {saved && <p>{saved}</p>}
  </section>;
}