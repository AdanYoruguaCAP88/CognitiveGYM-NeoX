import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import { signOut } from './lib/auth';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

const protectedPages: Record<string, string> = {
  '/onboarding': 'Onboarding',
  '/prompt-builder': 'Prompt Builder',
  '/gimnasio': 'Gimnasio',
  '/comparar': 'Comparar',
  '/historial': 'Historial',
  '/analytics': 'Analytics',
  '/creador': 'Creador'
};

function Theme() {
  const [dark, setDark] = useState(false);
  useEffect(() => document.documentElement.classList.toggle('dark', dark), [dark]);
  return <button className="button ghost" onClick={() => setDark(!dark)}>{dark ? '☀ Claro' : '◐ Oscuro'}</button>;
}

function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { session } = useAuth();
  return <div className="app-shell"><header>
    <Link className="brand" to="/">CognitiveGYM <span>NeoX</span></Link>
    <nav>{[...Object.entries(protectedPages), ['/dashboard', 'Dashboard']].map(([to, label]) => <Link className={loc.pathname === to ? 'active' : ''} key={to} to={to}>{label}</Link>)}</nav>
    {session ? <button className="button ghost" onClick={() => signOut()}>Salir</button> : <Link className="button ghost" to="/auth">Acceso</Link>}
    <Theme />
  </header><main>{children}</main><footer>Entrená el criterio que genera mejores decisiones.</footer></div>;
}

function Screen({ title }: { title: string }) {
  return <section className="screen"><p className="eyebrow">CognitiveGYM-NeoX</p><h1>{title}</h1><p>Fundación de interfaz lista para la siguiente fase.</p></section>;
}

function Training() { return <Screen title="Entrenamiento" />; }
function NotFound() { return <Screen title="404 — Ruta no encontrada" />; }
function ProtectedScreen({ title }: { title: string }) {
  return <ProtectedRoute><Screen title={title} /></ProtectedRoute>;
}

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Screen title="Gimnasio cognitivo para operadores de IA" />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    {Object.entries(protectedPages).map(([path, title]) => <Route key={path} path={path} element={<ProtectedScreen title={title} />} />)}
    <Route path="/training/:id" element={<ProtectedRoute><Training /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes></Layout>;
}