import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class StartupErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CognitiveGYM-NeoX startup error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="startup-error" role="alert">
          <section>
            <h1>CognitiveGYM-NeoX</h1>
            <h2>No se pudo iniciar la aplicación</h2>
            <p>La interfaz se detuvo durante la inicialización.</p>
            <pre>{this.state.error.message}</pre>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
