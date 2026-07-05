import { useMemo, useState } from 'react'
import type { WikiArticle, WikiCategory } from '../types'
import { wikiArticles, WIKI_CATEGORY_LABELS } from '../data/wiki'
import Brand from '../components/Brand'

// Conteúdo educativo (guia para iniciantes + wiki de heróis/tropas/
// construções/eventos/pets), pedido explícito do usuário para agregar valor
// a jogadores iniciantes — inspirado no que ferramentas como WoS Tools já
// oferecem. Puramente informativo: não usa o Strategy Engine, é uma seção
// separada do app. Busca e navegação são só client-side (conteúdo estático
// bundlado, sem backend).

function matchesQuery(article: WikiArticle, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  if (article.title.toLowerCase().includes(q)) return true
  if (article.summary.toLowerCase().includes(q)) return true
  return article.sections.some(
    (s) =>
      (s.heading?.toLowerCase().includes(q) ?? false) ||
      s.paragraphs.some((p) => p.toLowerCase().includes(q))
  )
}

const ALL_CATEGORIES: (WikiCategory | 'all')[] = [
  'all',
  'guia',
  'herois',
  'tropas',
  'construcoes',
  'eventos',
  'pets',
]

export default function Wiki({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<WikiCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return wikiArticles.filter(
      (a) => (category === 'all' || a.category === category) && matchesQuery(a, query)
    )
  }, [query, category])

  const selected = wikiArticles.find((a) => a.id === selectedId) ?? null

  return (
    <div>
      <Brand size={24} />
      <p className="muted" style={{ marginTop: 6, marginBottom: 20 }}>
        Guia e Wiki ·{' '}
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            padding: 0,
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          voltar ao dashboard
        </button>
      </p>

      {selected ? (
        <div className="card">
          <button
            type="button"
            className="secondary"
            style={{ marginBottom: 12 }}
            onClick={() => setSelectedId(null)}
          >
            ← Voltar à lista
          </button>
          <h2 style={{ marginTop: 0, marginBottom: 4 }}>{selected.title}</h2>
          <p className="muted" style={{ marginBottom: 20 }}>
            {selected.summary}
          </p>
          {selected.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              {section.heading && <h3 style={{ fontSize: 15, marginBottom: 8 }}>{section.heading}</h3>}
              {section.paragraphs.map((p, j) => (
                <p key={j} style={{ marginTop: 0, marginBottom: 8, lineHeight: 1.5 }}>
                  {p}
                </p>
              ))}
            </div>
          ))}
          {selected.source && (
            <p className="muted" style={{ fontSize: 11, marginTop: 20, borderTop: '1px solid #2a3a5c', paddingTop: 12 }}>
              Fonte: {selected.source}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="card">
            <label>Buscar</label>
            <input
              type="text"
              placeholder="ex.: aceleradores, Bear Trap, Zinman..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={category === cat ? '' : 'secondary'}
                  style={{ padding: '4px 10px', fontSize: 12 }}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'all' ? 'Todos' : WIKI_CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="card">
              <p className="muted">Nada encontrado. Tente outra busca ou categoria.</p>
            </div>
          )}

          {filtered.map((article) => (
            <div
              key={article.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedId(article.id)}
            >
              <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {WIKI_CATEGORY_LABELS[article.category]}
              </div>
              <strong>{article.title}</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                {article.summary}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
