import type { WeeklySnapshot } from '../types'

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}`
}

export default function HistoryTable({
  snapshots,
  onDelete,
}: {
  snapshots: WeeklySnapshot[]
  onDelete?: (id: string) => void
}) {
  const rows = [...snapshots].reverse()

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
            <th style={{ padding: '4px 8px' }}>Data</th>
            <th style={{ padding: '4px 8px' }}>Fornalha</th>
            <th style={{ padding: '4px 8px' }}>VIP</th>
            <th style={{ padding: '4px 8px' }}>Gemas</th>
            <th style={{ padding: '4px 8px' }}>Poder</th>
            <th style={{ padding: '4px 8px' }}>Evento</th>
            {onDelete && <th style={{ padding: '4px 8px' }} />}
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.id ?? i} style={{ borderTop: '1px solid #2a3a5c' }}>
              <td style={{ padding: '4px 8px' }}>{formatDate(s.snapshotDate)}</td>
              <td style={{ padding: '4px 8px' }}>{s.furnaceLevel}</td>
              <td style={{ padding: '4px 8px' }}>{s.vipLevel}</td>
              <td style={{ padding: '4px 8px' }}>{s.gems.toLocaleString('pt-BR')}</td>
              <td style={{ padding: '4px 8px' }}>{s.power.toLocaleString('pt-BR')}</td>
              <td style={{ padding: '4px 8px' }}>{s.currentEvents?.length ? s.currentEvents.join(', ') : '—'}</td>
              {onDelete && (
                <td style={{ padding: '4px 8px' }}>
                  {s.id && (
                    <button
                      type="button"
                      className="secondary"
                      style={{ padding: '2px 8px', fontSize: 12, borderColor: 'var(--red)', color: 'var(--red)' }}
                      onClick={() => {
                        if (window.confirm(`Excluir o check-in de ${formatDate(s.snapshotDate)}? Essa ação não pode ser desfeita.`)) {
                          onDelete(s.id!)
                        }
                      }}
                    >
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
