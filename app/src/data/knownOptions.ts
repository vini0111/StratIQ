// Listas de conveniência para padronizar preenchimento (dropdown/sugestão),
// não é o Knowledge Base completo do jogo (isso continua deferido — ver
// docs/BACKLOG-v1.md item 2). Eventos são uma lista fechada (dropdown) porque
// as Strategy Cards dependem de nomes consistentes em "currentEvent".
// Construção/pesquisa são sugestões (datalist) — lista parcial, não a árvore
// inteira do jogo; o campo continua aceitando texto livre.

export const KNOWN_EVENTS = [
  'Lucky Wheel',
  'SvS (State of Power)',
  'Alliance Mobilization',
  'Bear Trap',
  'Canyon Clash',
  'Frostfire',
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
  'Tool Enhancement',
  'Gathering Speed',
  'Infantry Defense',
  'Infantry Health',
  'Lancer Attack',
  'Marksman Attack',
  'March Size',
  'Construction Speed',
  'Research Speed',
  'Training Capacity',
]
