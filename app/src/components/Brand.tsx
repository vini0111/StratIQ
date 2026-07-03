// Aproximação do ícone de bússola/estrela do moodboard enviado (não é o
// arquivo de logo original — se houver um SVG/PNG exportado do ícone, ele
// deve substituir este componente para fidelidade exata).
function CompassIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <polygon
        points="50,2 60,42 98,50 60,58 50,98 40,58 2,50 40,42"
        fill="var(--text)"
        opacity="0.9"
      />
      <polygon points="50,15 56,46 87,50 56,54 50,85 44,54 13,50 44,46" fill="var(--accent)" />
    </svg>
  )
}

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
        <CompassIcon size={size} />
        <span className="brand-wordmark">
          Strat<span className="accent">IQ</span>
        </span>
      </div>
      {tagline && <p className="brand-tagline">Inteligência. Estratégia. Vantagem.</p>}
    </div>
  )
}
