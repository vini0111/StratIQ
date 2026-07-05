import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-construcoes',
  category: 'construcoes',
  title: 'Construções: Fornalha e produção de recursos',
  summary: 'Marcos de desbloqueio por nível de Fornalha, cap de nível de herói, e as construções de produção.',
  sections: [
    {
      heading: 'Fornalha — marcos de desbloqueio',
      paragraphs: [
        'A Fornalha tem 30 níveis, e cada nível libera prédios/mecânicas em marcos específicos (não a cada nível):',
        'Fornalha 4: Hall dos Heróis, Enfermaria, Cabana do Explorador.',
        'Fornalha 6: Chief\'s House.',
        'Fornalha 7: Acampamento de Infantaria, Barricada.',
        'Fornalha 8: Embaixada, Arena, Acampamento de Atiradores, Enfermaria.',
        'Fornalha 9: Depósito, Centro de Pesquisa, Acampamento de Lanceiros.',
        'Fornalha 10: Centro de Comando.',
        'Fornalha 11: Enlistment Office.',
        'Fornalha 13: Drill Camp.',
        'Fornalha 15: Hero Gear.',
        'Fornalha 18: Beast Cage (Pets).',
        'Fornalha 20: Mastery Forging.',
        'Fornalha 22: Chief Gear.',
        'Fornalha 25: Chief Gear Charms.',
        'Fornalha 30: Fire Crystal Upgrades (FC1+).',
      ],
    },
    {
      heading: 'Cap de nível de herói pela Fornalha',
      paragraphs: [
        'Cada nível de Fornalha também eleva o nível máximo permitido para heróis: Fornalha 17 → nível 43, Fornalha 18 → 46, Fornalha 19 → 49, Fornalha 20 → 54, Fornalha 22 → 64, Fornalha 26 → 80 (máximo do jogo).',
        'Nivelar um herói além do cap da Fornalha atual não tem efeito nenhum — o StratIQ já avisa quando isso acontece com um dos seus heróis favoritos.',
      ],
    },
    {
      heading: 'Construções de produção',
      paragraphs: [
        'Serraria: produz madeira, a primeira construção de produção que abre.',
        'Cabana do Caçador: produz carne, a segunda a abrir.',
        'Mina de Carvão: produz carvão, a terceira a abrir.',
        'Mina de Ferro: produz ferro, a quarta a abrir (Fornalha 5).',
      ],
    },
  ],
  source:
    'Whiteout Survival Data — Furnace (whiteoutdata.com), Whiteout Survival Wiki — Buildings/Newbie Building Guide, Theria Games — Coal Mine/Sawmill Guides (já citado em docs/KNOWLEDGE-001-Game-Mechanics.md, seções Fornalha e construções).',
}

export default article
