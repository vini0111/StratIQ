import type { WeeklySnapshot } from '../types'
import { computeFurnacePaceDaysPerLevel, computeNextFurnaceMilestones } from '../lib/roadmap'

// Vigésima quinta rodada — ver docs/BACKLOG-v1.md. Widget informativo (não
// entra no semáforo nem no motor de decisão): mostra os próximos
// desbloqueios de conteúdo por nível de Fornalha, com estimativa de prazo
// baseada no ritmo real da conta, não uma projeção do motor.
export default function UpcomingMilestones({
  furnaceLevel,
  snapshots,
}: {
  furnaceLevel: number
  snapshots: WeeklySnapshot[]
}) {
  const pace = computeFurnacePaceDaysPerLevel(snapshots)
  const milestones = computeNextFurnaceMilestones(furnaceLevel, pace)

  if (milestones.length === 0) return null

  return (
    <div className="card">
      <h3>Próximos marcos</h3>
      <p className="muted" style={{ marginTop: -4, marginBottom: 12, fontSize: 12 }}>
        {pace !== null
          ? `Baseado no seu ritmo observado (~${pace.toFixed(1)} dia(s) por nível de Fornalha) — é uma estimativa, não uma previsão oficial, e tende a ficar mais lenta conforme o nível sobe.`
          : 'Ainda sem histórico suficiente para estimar prazo — mostrando só a ordem dos próximos desbloqueios.'}
      </p>
      {milestones.map((m) => (
        <div className="rec-item" key={m.level}>
          <div className="priority">
            Fornalha {m.level} · faltam {m.levelsAway} nível(is)
            {m.estimatedDaysAway !== null && ` · ~${m.estimatedDaysAway} dia(s)`}
          </div>
          <strong>{m.description}</strong>
        </div>
      ))}
    </div>
  )
}
