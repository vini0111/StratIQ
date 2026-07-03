import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Brand from '../components/Brand'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // Sem emailRedirectTo, o Supabase usa a "Site URL" configurada no painel
    // (por padrão, http://localhost:3000) — por isso o link chegava errado.
    // Usar window.location.origin torna o redirect correto tanto em produção
    // (Vercel) quanto em desenvolvimento local, desde que ambas as origens
    // estejam na allow list de Redirect URLs do Supabase.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="card">
      <Brand tagline size={36} />
      <p className="muted">Entre com seu e-mail para receber um link de acesso.</p>
      {sent ? (
        <p>Link enviado para {email}. Verifique sua caixa de entrada.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="muted" style={{ color: 'var(--red)' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de acesso'}
          </button>
        </form>
      )}
    </div>
  )
}
