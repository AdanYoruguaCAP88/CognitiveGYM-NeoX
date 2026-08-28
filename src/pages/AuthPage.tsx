import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle, signUp } from '../lib/auth';
import { useAuth } from '../auth/AuthContext';

type AuthLocationState = { from?: string };

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuth();
  const stateFrom = (location.state as AuthLocationState | null)?.from;
  const queryFrom = new URLSearchParams(location.search).get('next');
  const candidate = stateFrom ?? queryFrom ?? '/';
  const from = candidate.startsWith('/') && !candidate.startsWith('//') ? candidate : '/';
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate(from, { replace: true });
  }, [from, loading, navigate, session]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage('');

    try {
      const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (mode === 'signin') navigate(from, { replace: true });
      else setMessage('Registro realizado. Verificá tu correo si Supabase requiere confirmación.');
    } finally {
      setSubmitting(false);
    }
  }

  async function google() {
    if (submitting) return;
    setSubmitting(true);
    setMessage('');

    try {
      const result = await signInWithGoogle(from);
      if (result.error) setMessage(result.error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <section className="screen auth-screen"><p className="eyebrow">CognitiveGYM-NeoX</p><h1>{mode === 'signin' ? 'Acceso' : 'Crear cuenta'}</h1>
    <form onSubmit={submit} className="auth-form">
      <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Contraseña<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      <button className="button" type="submit" disabled={submitting}>{submitting ? 'Procesando…' : mode === 'signin' ? 'Ingresar' : 'Registrarme'}</button>
    </form>
    <button className="button ghost" type="button" onClick={google} disabled={submitting}>Continuar con Google</button>
    <button className="button ghost" type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} disabled={submitting}>{mode === 'signin' ? 'Crear cuenta' : 'Ya tengo cuenta'}</button>
    {message && <p role="status">{message}</p>}
  </section>;
}