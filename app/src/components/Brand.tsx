// Ícone real da marca (public/logo-icon.png), fornecido pelo usuário em 2026-07-03.
// Servido como asset estático pelo Vite a partir de app/public/.

export default function Brand({
  tagline,
  size = 28,
}: {
  tagline?: boolean
  size?: number
}) {
  return (
    <div>
      <div className="brand">
        <img src="/logo-icon.png" width={size} height={size} alt="StratIQ" style={{ borderRadius: size * 0.22 }} />
        <span className="brand-wordmark">
          Strat<span className="accent">IQ</span>
        </span>
      </div>
      {tagline && <p className="brand-tagline">Inteligência. Estratégia. Vantagem.</p>}
    </div>
  )
}
