import type { SemaphoreState } from '../types'

const LABELS: Record<keyof SemaphoreState, string> = {
  growth: 'Crescimento',
  economy: 'Economia',
  battle: 'Batalha',
}

export default function SemaphoreBar({ state }: { state: SemaphoreState }) {
  return (
    <div className="semaphore-row">
      {(Object.keys(state) as (keyof SemaphoreState)[]).map((key) => (
        <div className="semaphore-item" key={key}>
          <span className={`dot ${state[key]}`} />
          {LABELS[key]}
        </div>
      ))}
    </div>
  )
}
