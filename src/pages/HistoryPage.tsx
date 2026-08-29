import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { listDecisionPoints } from '../lib/decisionPoints';
import { currentPlan } from '../lib/plan';

type Row = { id:string; type:string; raw_input:string|null; coherence_score:number|null; was_blocked:boolean; created_at:string };

export default function HistoryPage() {
 const { session }=useAuth(); const [rows,setRows]=useState<Row[]>([]); const [plan,setPlan]=useState<'free'|'trial'|'premium'>('free'); const [error,setError]=useState('');
 useEffect(()=>{ if(!session)return; let active=true; void Promise.all([listDecisionPoints(session.user.id),currentPlan(session.user.id)]).then(([data,p])=>{if(active){setRows(data as Row[]);setPlan(p)}}).catch(e=>active&&setError(e instanceof Error?e.message:'Error cargando historial')); return()=>{active=false};},[session]);
 const visible=plan==='free'?rows.slice(0,5):rows;
 return <section className="screen"><p className="eyebrow">Historial</p><h1>Decisiones registradas</h1><p>Plan actual: {plan}. {plan==='free'?'Se muestran las últimas 5.':'Se muestra el historial completo.'}</p>{error&&<p role="alert">{error}</p>}
 <div className="grid">{visible.map(row=><article className="card" key={row.id}><strong>{row.type}</strong><p>{row.raw_input}</p><p>Score: {row.coherence_score ?? '—'} · {row.was_blocked?'Bloqueado':'Procesado'}</p></article>)}</div></section>;
}