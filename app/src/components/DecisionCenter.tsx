import type { SemaphoreState, StrategyCard } from '../types'
import SemaphoreBar from './SemaphoreBar'
import RecommendationList from './RecommendationList'

export default function DecisionCenter({
  semaphore,
  recommendations,
}: {
  semaphore: SemaphoreState
  recommendations: StrategyCard[]
}) {
  return (
    <div className="card">
      <h3>Decision Center</h3>
      <SemaphoreBar state={semaphore} />
      <div style={{ marginTop: 16 }}>
        <RecommendationList recommendations={recommendations} />
      </div>
    </div>
  )
}
