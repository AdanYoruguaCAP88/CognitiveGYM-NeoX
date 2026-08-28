import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle, signUp } from '../lib/auth';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (mode === 'signin') navigate('/');
    else setMessage('Registro realizado. Verificá tu correo si Supabase requiere confirmación.');
  }

  async function google() {
    setMessage('');
    const result = await signInWithGoogle();
    if (result.error) setMessage(result.error.message);
  }

  return <section className="screen auth-screen"><p className="eyebrow">CognitiveGYM-NeoX</p><h1>{mode === 'signin' ? 'Acceso' : 'Crear cuenta'}</h1>
    <form onSubmit={submit} className="auth-form">
      <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Contraseña<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      <button className="button" type="submit">{mode === 'signin' ? 'Ingresar' : 'Registrarme'}</button>
    </form>
    <button className="button ghost" type="button" onClick={google}>Continuar con Google</button>
    <button className="button ghost" type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Crear cuenta' : 'Ya tengo cuenta'}</button>
    {message && <p role="status">{message}</p>}
  </section>;
}