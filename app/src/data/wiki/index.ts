import type { WikiArticle } from '../../types'

// Conteúdo de Guia/Wiki — cada artigo é um arquivo próprio (mesmo padrão dos
// Strategy Cards). Puramente educativo: NÃO alimenta o Strategy Engine nem o
// motor de recomendações — é leitura para o jogador, especialmente iniciantes.

import guiaIniciante from './guia_iniciante'
import guiaSvs from './guia_svs'
import guiaAlianca from './guia_alianca'
import wikiHeroisSistema from './wiki_herois_sistema'
import wikiHeroisRoster from './wiki_herois_roster'
import wikiTropasTipos from './wiki_tropas_tipos'
import wikiTropasTiers from './wiki_tropas_tiers'
import wikiConstrucoes from './wiki_construcoes'
import wikiEventos from './wiki_eventos'
import wikiPets from './wiki_pets'

export const wikiArticles: WikiArticle[] = [
  guiaIniciante,
  guiaSvs,
  guiaAlianca,
  wikiHeroisSistema,
  wikiHeroisRoster,
  wikiTropasTipos,
  wikiTropasTiers,
  wikiConstrucoes,
  wikiEventos,
  wikiPets,
]

export const WIKI_CATEGORY_LABELS: Record<WikiArticle['category'], string> = {
  guia: 'Guias',
  herois: 'Heróis',
  tropas: 'Tropas',
  construcoes: 'Construções',
  eventos: 'Eventos',
  pets: 'Pets',
}
