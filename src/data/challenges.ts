import type { Difficulty, VectorDimension } from '../lib/engine/adaptive';
export type Challenge={id:string;title:string;prompt:string;difficulty:Difficulty;cognitiveTargets:VectorDimension[];xpReward:number};
const seed: Array<[string,Difficulty,VectorDimension[],number,string]> = [
['Objetivo operativo','easy',['clarity'],40,'Reescribe un objetivo para que sea verificable y accionable.'],
['Contexto mínimo','easy',['clarity','coherence'],45,'Separa los datos relevantes del ruido contextual.'],
['Restricción explícita','easy',['structure'],50,'Define tres restricciones que impidan respuestas ambiguas.'],
['Sesgo de confirmación','medium',['biasControl','secondOrder'],70,'Busca evidencia que contradiga tu hipótesis inicial.'],
['Segunda orden','medium',['secondOrder','depth'],75,'Describe una consecuencia indirecta de tu decisión.'],
['Mapa de alternativas','medium',['depth','structure'],75,'Propón tres rutas y una condición de descarte para cada una.'],
['Métrica útil','easy',['coherence'],55,'Elige una métrica que cambie realmente una decisión.'],
['Contexto contradictorio','medium',['coherence','biasControl'],80,'Resuelve un caso con dos señales que apuntan en direcciones distintas.'],
['Decisión bajo incertidumbre','hard',['secondOrder','biasControl'],110,'Decide qué harías sin completar la información faltante.'],
['Producto con límites','medium',['structure','clarity'],80,'Diseña un producto sujeto a presupuesto, plazo y usuario definidos.'],
['Cadena causal','medium',['depth'],80,'Explica tres niveles de causa sin confundir correlación con causalidad.'],
['Hipótesis rival','hard',['biasControl','secondOrder'],120,'Construye la mejor explicación rival de tu propia propuesta.'],
['Priorización','easy',['structure'],50,'Ordena cinco tareas con un criterio explícito.'],
['Trade-off','medium',['coherence','depth'],85,'Elige entre velocidad y precisión y explica qué sacrificas.'],
['Señales débiles','hard',['depth','secondOrder'],115,'Identifica una señal débil y cómo la validarías.'],
['Prompt adversarial','hard',['biasControl','structure'],120,'Diseña un caso que pueda romper tu propia instrucción.'],
['Narrativa a sistema','medium',['structure','secondOrder'],90,'Convierte una historia en variables, dependencias y límites.'],
['Exploración','medium',['depth','clarity'],80,'Formula una pregunta útil donde la respuesta aún es incierta.'],
['Compresión','easy',['clarity'],55,'Reduce un problema a su objetivo, contexto y restricciones.'],
['Escenario extremo','hard',['secondOrder','depth'],125,'Analiza qué cambia si la condición principal falla por completo.'],
['Decisión reversible','medium',['secondOrder'],85,'Separa decisiones reversibles de irreversibles.'],
['Confianza calibrada','medium',['biasControl'],80,'Declara qué sabes, qué infieres y qué falta comprobar.'],
['Arquitectura de criterio','hard',['clarity','structure','secondOrder'],130,'Diseña una secuencia de decisión que otra persona pueda auditar.'],
['Conflicto de objetivos','hard',['coherence','depth'],125,'Resuelve dos objetivos incompatibles sin ocultar el trade-off.'],
['Síntesis operativa','medium',['clarity','coherence','structure'],100,'Entrega una decisión final con criterio, evidencia y límites.']
];
export const challenges:Challenge[]=seed.map(([title,difficulty,cognitiveTargets,xpReward,prompt],i)=>({id:`c${String(i+1).padStart(2,'0')}`,title,prompt,difficulty,cognitiveTargets,xpReward}));