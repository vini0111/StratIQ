import { Component, type ErrorInfo, type ReactNode } from 'react'

// Sem isso, um erro de render em qualquer componente filho derruba a
// aplicação inteira em silêncio (tela em branco, sem nenhuma mensagem) — foi
// um dos suspeitos ao investigar "não vi nenhuma atualização no dashboard".
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro não tratado na UI:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="card">
          <h3>Algo quebrou na tela</h3>
          <p className="muted">
            Um erro impediu a página de renderizar. Abra o console do navegador (F12) para ver
            os detalhes técnicos, ou tente recarregar.
          </p>
          <p style={{ color: 'var(--red)', fontSize: 13 }}>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Recarregar</button>
        </div>
      )
    }
    return this.props.children
  }
}
