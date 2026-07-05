import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-tropas-tiers',
  category: 'tropas',
  title: 'Tropas: tiers e progressão (treino vs. promoção)',
  summary: 'Os 12 tiers de tropa (I-XII), quando cada um libera, e por que promover costuma ser melhor que treinar do zero.',
  sections: [
    {
      heading: 'Os tiers',
      paragraphs: [
        'I Rookie, II Trained, III Senior, IV Veteran, V Resistente ✅, VI Heróica ✅, VII Brave, VIII Elite, IX Supreme, X Apex, XI Helios, XII Exalted.',
        'V e VI foram confirmados em português pelo próprio uso do jogador ("Infantaria Resistente", "Infantaria Heróica"). Os demais nomes acima são a tradução do termo em inglês — ainda não confirmados 1:1 contra o cliente do jogo.',
        'XI (Helios) e XII (Exalted) só existem via pesquisa na Academia de Guerra — Exalted exige também Fire Crystal FC10.',
      ],
    },
    {
      heading: 'Treinar do zero vs. promover',
      paragraphs: [
        'Promover um tier já treinado costuma ser muito mais barato em tempo do que treinar o tier novo do zero: ao promover T10 para T11, por exemplo, você paga só a diferença de tempo entre os dois, não o tempo total do T11.',
        'Na prática, a maioria dos jogadores ativos treina/promove principalmente os tiers mais altos que já possui.',
      ],
    },
  ],
  source:
    'BlueStacks — War Academy/T11 Guide, WoS Tools — Troop Training Calculator (já citado em docs/KNOWLEDGE-001-Game-Mechanics.md, seção Tropas).',
}

export default article
