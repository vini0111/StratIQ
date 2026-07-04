import { useId, useState } from 'react'
import type { WeeklySnapshot } from '../types'

// Gráfico de área suave em SVG — substitui o antigo sparkline de barras
// (pedido do usuário: "não estou gostando dos gráficos... algo visual que
// facilite o entendimento e seja bonito"). Sem biblioteca de gráficos:
// mantém o app leve, e o desenho é simples o bastante para não precisar de
// dependência externa (curva suave via Bézier cúbica entre pontos + área
// preenchida com gradiente + tooltip on hover).

function formatDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

const WIDTH = 300
const HEIGHT = 72
const PAD_Y = 10

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`
  }
  return d
}

export default function HistorySparkline({
  snapshots,
  field,
  label,
}: {
  snapshots: WeeklySnapshot[]
  field: 'furnaceLevel' | 'vipLevel' | 'gems' | 'power' | 'totalTroops'
  label: string
}) {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const values = snapshots.map((s) =>
    field === 'totalTroops'
      ? s.troopsInfantry + s.troopsLancer + s.troopsMarksman
      : (s[field] as number)
  )
  const n = values.length
  const current = values[n - 1]
  const previous = n > 1 ? values[n - 2] : null
  const delta = previous !== null ? current - previous : null
  const deltaColor =
    delta === null ? 'var(--muted)' : delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--muted)'
  const deltaText =
    delta === null ? '' : ` (${delta > 0 ? '+' : ''}${delta.toLocaleString('pt-BR')} desde o check-in anterior)`

  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const min = rawMin === rawMax ? rawMin - 1 : rawMin
  const max = rawMin === rawMax ? rawMax + 1 : rawMax

  const points = values.map((v, i) => ({
    x: n > 1 ? (i / (n - 1)) * WIDTH : WIDTH / 2,
    y: HEIGHT - PAD_Y - ((v - min) / (max - min)) * (HEIGHT - PAD_Y * 2),
  }))

  const linePath = buildSmoothPath(points)
  const areaPath = `${linePath} L ${WIDTH},${HEIGHT} L 0,${HEIGHT} Z`

  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const idx = Math.round(ratio * (n - 1))
    setHoverIndex(Math.min(Math.max(idx, 0), n - 1))
  }

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontSize: 13 }}>
          <strong>{current.toLocaleString('pt-BR')}</strong>
          <span style={{ color: deltaColor }}>{deltaText}</span>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: 64, display: 'block', cursor: 'crosshair' }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
          <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          {hovered && (
            <line
              x1={hovered.x}
              y1={0}
              x2={hovered.x}
              y2={HEIGHT}
              stroke="var(--muted)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          )}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === n - 1 || i === hoverIndex ? 4 : 2.5}
              fill={i === hoverIndex ? 'var(--text)' : 'var(--accent)'}
              stroke="var(--surface)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
        {hovered && hoverIndex !== null && (
          <div
            className="muted"
            style={{
              position: 'absolute',
              top: 0,
              left: `${(hovered.x / WIDTH) * 100}%`,
              transform: `translateX(${hoverIndex === 0 ? '0%' : hoverIndex === n - 1 ? '-100%' : '-50%'})`,
              background: 'var(--surface-2)',
              border: '1px solid #2a3a5c',
              borderRadius: 6,
              padding: '2px 6px',
              fontSize: 11,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {formatDate(snapshots[hoverIndex].snapshotDate)}: {values[hoverIndex].toLocaleString('pt-BR')}
          </div>
        )}
      </div>
      <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span>{formatDate(snapshots[0].snapshotDate)}</span>
        <span>{formatDate(snapshots[n - 1].snapshotDate)}</span>
      </div>
    </div>
  )
}
