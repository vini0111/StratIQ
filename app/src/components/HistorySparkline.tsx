import type { WeeklySnapshot } from '../types'

function formatDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

export default function HistorySparkline({
  snapshots,
  field,
  label,
}: {
  snapshots: WeeklySnapshot[]
  field: 'furnaceLevel' | 'vipLevel' | 'gems' | 'power'
  label: string
}) {
  const values = snapshots.map((s) => s[field] as number)
  const max = Math.max(...values, 1)
  const current = values[values.length - 1]
  const previous = values.length > 1 ? values[values.length - 2] : null
  const delta = previous !== null ? current - previous : null
  const deltaColor = delta === null ? 'var(--muted)' : delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--muted)'
  const deltaText =
    delta === null
      ? ''
      : ` (${delta > 0 ? '+' : ''}${delta.toLocaleString('pt-BR')} desde o check-in anterior)`

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontSize: 13 }}>
          <strong>{current.toLocaleString('pt-BR')}</strong>
          <span style={{ color: deltaColor }}>{deltaText}</span>
        </span>
      </div>
      <div className="sparkline">
        {values.map((v, i) => (
          <div
            key={i}
            className="bar"
            style={{ height: `${Math.max((v / max) * 100, 4)}%` }}
            title={`${formatDate(snapshots[i].snapshotDate)}: ${v.toLocaleString('pt-BR')}`}
          />
        ))}
      </div>
      <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span>{formatDate(snapshots[0].snapshotDate)}</span>
        <span>{formatDate(snapshots[snapshots.length - 1].snapshotDate)}</span>
      </div>
    </div>
  )
}
