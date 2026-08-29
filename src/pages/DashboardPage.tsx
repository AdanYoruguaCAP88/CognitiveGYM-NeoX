import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { session } = useAuth();

  return <section className="screen">
    <p className="eyebrow">CognitiveGYM-NeoX</p>
    <h1>Dashboard</h1>
    <p>Sesión activa: {session?.user.email}</p>
    <p>Los datos cognitivos se conectarán únicamente cuando exista una fuente de datos especificada para esta pantalla.</p>
  </section>;
}