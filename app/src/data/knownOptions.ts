// Listas de conveniência para padronizar preenchimento (dropdown/sugestão),
// não é o Knowledge Base completo do jogo (isso continua deferido — ver
// docs/BACKLOG-v1.md item 2). Eventos são uma lista fechada (checkboxes) porque
// as Strategy Cards dependem de nomes consistentes em "currentEvents".
// Construção/pesquisa/heróis são sugestões (datalist) — lista parcial, não a
// árvore/roster inteiro do jogo; os campos continuam aceitando texto livre.
//
// Nomes em português, alinhados ao que o jogo mostra (conferido contra o uso
// real do jogador — ex.: "Mobilização da Aliança", "Rally do Herói", "Batalha
// da Forja" — "Crazy Joe" permanece em inglês porque é assim que aparece no
// cliente do jogo). "Hall of Chiefs" era listado como evento separado até a
// décima quinta rodada de feedback — confirmado pelo jogador que é o mesmo
// evento de "Rally do Herói" (nome interno/inglês do mesmo evento exibido em
// PT), removido daqui para não duplicar.
// "Frostfire" e "Confronto do Cânion" não foram confirmados contra o cliente
// real do jogo (sem uso observado do jogador) — ajustar se o nome oficial
// for diferente. Multi-idioma (PT/EN/ES) fica registrado como item futuro —
// ver BACKLOG-v1.
//
// KNOWN_BUILDINGS inclui as construções de produção de recursos (Serraria,
// Mina de Ferro, Mina de Carvão, Cabana do Caçador) e early-game (Cabana do
// Explorador, Abrigo), completadas em 2026-07-03 a partir de
// whiteoutsurvival.wiki — nomes em PT não confirmados 1:1 contra o cliente
// do jogo (traduzidos do inglês), ajustar se divergirem do texto real.

export const KNOWN_EVENTS = [
  'Roda da Sorte',
  'SvS',
  'Mobilização da Aliança',
  'Rally do Herói',
  'Armadilha do Urso',
  'Batalha da Forja',
  'Frostfire',
  'Confronto do Cânion',
  'Crazy Joe',
] as const

export const KNOWN_BUILDINGS = [
  'Fornalha',
  'Centro de Comando',
  'Enfermaria',
  'Embaixada',
  'Academia de Guerra',
  'Acampamento de Infantaria',
  'Acampamento de Lanceiros',
  'Acampamento de Atiradores',
  'Depósito',
  'Muralha',
  'Abrigo',
  'Cabana do Explorador',
  'Cabana do Caçador',
  'Serraria',
  'Mina de Ferro',
  'Mina de Carvão',
  'Casa de Cozinha',
  'Hall dos Heróis',
]

// Tiers de tropa (I-XII). Cada tier tem um nome próprio no jogo, não é só
// um número — ex.: o jogador confirmou "V Resistente" e "VI Heróica" no
// cliente em PT. Os demais nomes abaixo são o termo em inglês (fonte:
// whiteoutdata.com/wostools.net), ainda não confirmados contra o cliente em
// PT — ajustar se divergirem do texto real. XI (Helios) e XII (Exalted) só
// existem via pesquisa na Academia de Guerra. Ver KNOWLEDGE-001 (seção
// Tropas / Battle Domain).
export const KNOWN_TROOP_TIERS = [
  'I - Rookie',
  'II - Trained',
  'III - Senior',
  'IV - Veteran',
  'V - Resistente',
  'VI - Heróica',
  'VII - Brave',
  'VIII - Elite',
  'IX - Supreme',
  'X - Apex',
  'XI - Helios',
  'XII - Exalted',
]

// Posição do tier na lista acima = força relativa (I é o mais fraco, XII o
// mais forte). Usado para ordenar as linhas de tropa no formulário por força
// decrescente, em vez de ordem de inserção — pedido do usuário (décima
// sexta rodada): tropas mais fortes recém-adicionadas devem aparecer
// primeiro, não no fim da lista. Tier não reconhecido (ainda sendo digitado,
// ou texto livre fora da lista) retorna -1 e fica no final, até resolver
// para um tier válido.
export function troopTierRank(tier: string): number {
  return KNOWN_TROOP_TIERS.indexOf(tier)
}

export const KNOWN_TROOP_TYPES: { value: 'infantry' | 'lancer' | 'marksman'; label: string }[] = [
  { value: 'infantry', label: 'Infantaria' },
  { value: 'lancer', label: 'Lanceiro' },
  { value: 'marksman', label: 'Atirador' },
]

export const KNOWN_RESEARCH = [
  'Aprimoramento de Ferramentas',
  'Velocidade de Coleta',
  'Defesa da Infantaria',
  'Vida da Infantaria',
  'Ataque de Lanceiros',
  'Ataque de Atiradores',
  'Tamanho da Marcha',
  'Velocidade de Construção',
  'Velocidade de Pesquisa',
  'Capacidade de Treinamento',
]

// Roster real disponível no Estado 4465 (informado pelo jogador em
// 2026-07-03) — substitui a lista anterior (caminho F2P late-game), que
// incluía heróis de gerações que esse estado ainda não tem. Ver detalhes de
// classe/raridade/geração em docs/KNOWLEDGE-001-Game-Mechanics.md.
// Lista ainda parcial: reflete o que está disponível hoje, não o roster
// completo do jogo — outros estados/gerações terão heróis diferentes.
export const KNOWN_HEROES = [
  'Molly',
  'Bahiti',
  'Sergey',
  'Gina',
  'Cloris',
  'Jessie',
  'Charlie',
  'Natalia',
  'Jasser',
  'Lumak Bokan',
  'Patrick',
  'Eugenio',
  'Seo-yoon',
  'Smith',
  'Ling Xue',
  'Jerónimo',
  'Zinman',
]
