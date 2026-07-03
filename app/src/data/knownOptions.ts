// Listas de conveniência para padronizar preenchimento (dropdown/sugestão),
// não é o Knowledge Base completo do jogo (isso continua deferido — ver
// docs/BACKLOG-v1.md item 2). Eventos são uma lista fechada (checkboxes) porque
// as Strategy Cards dependem de nomes consistentes em "currentEvents".
// Construção/pesquisa/heróis são sugestões (datalist) — lista parcial, não a
// árvore/roster inteiro do jogo; os campos continuam aceitando texto livre.
//
// Nomes em português, alinhados ao que o jogo mostra (conferido contra o uso
// real do jogador — ex.: "Mobilização da Aliança", "Rally do Herói", "Batalha
// da Forja" — alguns nomes próprios como "Hall of Chiefs" e "Crazy Joe"
// permanecem em inglês porque é assim que aparecem no cliente do jogo).
// "Frostfire" e "Confronto do Cânion" não foram confirmados contra o cliente
// real do jogo (sem uso observado do jogador) — ajustar se o nome oficial
// for diferente. Multi-idioma (PT/EN/ES) fica registrado como item futuro —
// ver BACKLOG-v1.

export const KNOWN_EVENTS = [
  'Roda da Sorte',
  'SvS',
  'Mobilização da Aliança',
  'Rally do Herói',
  'Armadilha do Urso',
  'Batalha da Forja',
  'Frostfire',
  'Confronto do Cânion',
  'Hall of Chiefs',
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

// Caminho de prioridade F2P (KNOWLEDGE-001) + heróis de referência para
// jogadores pagantes — lista curta e propositalmente incompleta.
export const KNOWN_HEROES = [
  'Mia',
  'Hector',
  'Bradley',
  'Gatot',
  'Blanchette',
  'Eleonora',
  'Flint',
  'Vulcanus',
  'Estrella',
]
