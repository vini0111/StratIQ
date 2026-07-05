import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-herois-sistema',
  category: 'herois',
  title: 'Heróis: sistema de gerações e caminho F2P',
  summary: 'Como funcionam as gerações de heróis e a rota de prioridade mais citada pelos guias para jogadores F2P.',
  sections: [
    {
      heading: 'Sistema de gerações',
      paragraphs: [
        'Heróis de gerações mais novas costumam ser mais fortes, mas um herói top-tier permanece viável por 3-4 gerações antes de ficar obsoleto — não é preciso correr atrás de toda geração nova. Novas gerações saem a cada ~5-6 Lucky Wheels (~80 dias).',
        'A geração recomendada para o seu estado costuma estar ligada à idade do servidor (dias desde a criação do estado) — o StratIQ já calcula isso automaticamente a partir da data de criação informada no seu perfil.',
      ],
    },
    {
      heading: 'Caminho de prioridade F2P',
      paragraphs: [
        'Caminho mais citado pelos guias atuais: Mia → Hector → Bradley → Gatot → Blanchette → Eleonora, com Flint (Gen 2) como o primeiro "pico de poder" relevante, obtido via Lucky Wheel.',
        'Flint (Gen 2): primeiro pico de poder F2P relevante, via Lucky Wheel.',
        'Blanchette (Gen 10): considerado o melhor herói de dano do jogo — marksman com stats altos, via Lucky Wheel, provavelmente o melhor S+ acessível a F2P.',
        'Eleonora (Gen 11): staple de late-game, kit de utilidade forte em rallies de PvP, Arena e Expedição, também via Lucky Wheel.',
        'Para jogadores pagantes, os guias citam Vulcanus (Gen 13) e Estrella (Gen 15) como alvos.',
      ],
    },
    {
      heading: 'Foco, não dispersão',
      paragraphs: [
        'Não distribua recursos entre muitos heróis fracos. Investir fundo em poucos heróis prioritários rende muito mais poder do que nivelar vários heróis medianos ao mesmo tempo.',
        'Fique atento ao cap de nível de herói pelo nível da sua Fornalha (ver artigo de Construções) — nivelar um herói além do cap atual não tem efeito.',
      ],
    },
  ],
  source:
    'gamsgo.com — Hero Tier List 2026, AllClash — Best Heroes Tier List 2026 (já citado em docs/KNOWLEDGE-001-Game-Mechanics.md, seção Heróis).',
}

export default article
