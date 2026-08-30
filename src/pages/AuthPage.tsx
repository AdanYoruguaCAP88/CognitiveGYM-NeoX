import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  requestPasswordRecovery,
  signIn,
  signInWithGoogle,
  signUp,
  updatePassword
} from '../lib/auth';
import { useAuth } from '../auth/AuthContext';

type AuthLocationState = { from?: string };
type Mode = 'signin' | 'signup' | 'recovery-request' | 'recovery-update';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading, configError } = useAuth();
  const stateFrom = (location.state as AuthLocationState | null)?.from;
  const query = new URLSearchParams(location.search);
  const queryFrom = query.get('next');
  const candidate = stateFrom ?? queryFrom ?? '/';
  const from = candidate.startsWith('/') && !candidate.startsWith('//') ? candidate : '/';
  const isRecoveryLink = query.get('recovery') === '1';
  const [mode, setMode] = useState<Mode>(() => isRecoveryLink ? 'recovery-update' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isRecoveryLink) return;
    setMode('recovery-update');
  }, [isRecoveryLink]);

  useEffect(() => {
    if (loading || !session) return;
    if (mode === 'recovery-update') return;
    navigate(from, { replace: true });
  }, [from, loading, mode, navigate, session]);

  function resetForm(nextMode: Mode) {
    setMode(nextMode);
    setPassword('');
    setMessage('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (configError) {
      setMessage(configError);
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      if (mode === 'recovery-request') {
        const result = await requestPasswordRecovery(email);
        if (result.error) {
          setMessage(result.error.message);
          return;
        }
        setMessage('Si existe una cuenta para este correo, recibirás las instrucciones de recuperación.');
        return;
      }

      if (mode === 'recovery-update') {
        const result = await updatePassword(password);
        if (result.error) {
          setMessage(result.error.message);
          return;
        }
        setMessage('Contraseña actualizada. Ya podés ingresar.');
        resetForm('signin');
        navigate('/auth', { replace: true });
        return;
      }

      const result = mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (mode === 'signin') navigate(from, { replace: true });
      else setMessage('Registro realizado. Verificá tu correo si Supabase requiere confirmación.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la operación.');
    } finally {
      setSubmitting(false);
    }
  }

  async function google() {
    if (submitting) return;
    if (configError) {
      setMessage(configError);
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const result = await signInWithGoogle(from);
      if (result.error) setMessage(result.error.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar Google.');
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === 'signup'
    ? 'Crear cuenta'
    : mode === 'recovery-request'
      ? 'Recuperar contraseña'
      : mode === 'recovery-update'
        ? 'Actualizar contraseña'
        : 'Acceso';

  return <section className="screen auth-screen">
    <p className="eyebrow">CognitiveGYM-NeoX</p>
    <h1>{title}</h1>

    {configError && <p role="alert">{configError}</p>}

    <form onSubmit={submit} className="auth-form">
      {mode !== 'recovery-update' && (
        <label>
          Email
          <input type="email" value={email} onChange={event => setEmail(event.target.value)} required />
        </label>
      )}

      {mode !== 'recovery-request' && (
        <label>
          Contraseña
          <input type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength={6} />
        </label>
      )}

      <button className="button" type="submit" disabled={submitting}>
        {submitting
          ? 'Procesando…'
          : mode === 'signin'
            ? 'Ingresar'
            : mode === 'signup'
              ? 'Registrarme'
              : mode === 'recovery-request'
                ? 'Enviar instrucciones'
                : 'Guardar contraseña'}
      </button>
    </form>

    {mode === 'signin' && (
      <>
        <button className="button ghost" type="button" onClick={google} disabled={submitting}>Continuar con Google</button>
        <button className="button ghost" type="button" onClick={() => resetForm('signup')} disabled={submitting}>Crear cuenta</button>
        <button className="button ghost" type="button" onClick={() => resetForm('recovery-request')} disabled={submitting}>¿Olvidaste tu contraseña?</button>
      </>
    )}

    {mode === 'signup' && (
      <button className="button ghost" type="button" onClick={() => resetForm('signin')} disabled={submitting}>Ya tengo cuenta</button>
    )}

    {mode === 'recovery-request' && (
      <button className="button ghost" type="button" onClick={() => resetForm('signin')} disabled={submitting}>Volver al acceso</button>
    )}

    {message && <p role="status">{message}</p>}
  </section>;
}
