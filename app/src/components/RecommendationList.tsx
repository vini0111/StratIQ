import type { StrategyCard } from '../types'

const PRIORITY_LABEL: Record<StrategyCard['priority'], string> = {
  very_high: '★★★★★',
  high: '★★★★☆',
  medium: '★★★☆☆',
  low: '★★☆☆☆',
}

export default function RecommendationList({ recommendations }: { recommendations: StrategyCard[] }) {
  if (recommendations.length === 0) {
    return <p className="muted">Nenhuma recomendação por enquanto. Continue assim.</p>
  }

  return (
    <div>
      {recommendations.map((rec) => (
        <div className="rec-item" key={rec.id}>
          <div className="priority">
            {PRIORITY_LABEL[rec.priority]} · confiança {Math.round(rec.confidence * 100)}%
          </div>
          <strong>{rec.recommendation}</strong>
          <div className="explanation">{rec.explanation}</div>
        </div>
      ))}
    </div>
  )
}
