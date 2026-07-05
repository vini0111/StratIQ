import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-herois-roster',
  category: 'herois',
  title: 'Roster de heróis do Estado 4465',
  summary: 'Heróis confirmados disponíveis neste estado (Fornalha 17), com classe, raridade e papel.',
  sections: [
    {
      paragraphs: [
        'Confiança alta = múltiplas fontes convergentes; média = uma fonte razoável; baixa/não confirmado = nome ambíguo ou sem fonte clara — tratar como hipótese, não fato.',
      ],
    },
    {
      heading: 'Combate',
      paragraphs: [
        'Molly — Lancer, SSR, confiança alta.',
        'Sergey — Infantry, SR, confiança alta.',
        'Natalia — Infantry, SSR, confiança alta.',
        'Jerónimo — Infantry, SSR, confiança média.',
        'Jessie — Lancer, Epic/SR, confiança alta.',
        'Bahiti — Marksman, grátis na Fornalha 4, confiança alta.',
        'Gina — Marksman, confiança média.',
        'Cloris — Marksman, Rare, confiança média.',
        'Jasser — Marksman, confiança média.',
        'Seo-yoon — Marksman, SR, confiança média.',
        'Patrick — Infantry, provável Epic/SSR (A-tier), confiança média.',
        'Ling Xue — dano em área, Epic, confiança baixa.',
      ],
    },
    {
      heading: 'Utilidade e economia',
      paragraphs: [
        'Zinman — Marksman, tier SSS de utilidade/economia (reduz tempo de construção/pesquisa — não é herói de dano, vale tratá-lo separado dos heróis de combate ao priorizar investimento), confiança média.',
        'Charlie — provavelmente Economia/Coleta, Rare, confiança baixa.',
        'Eugenio — provavelmente Economia/Coleta, Rare (hipótese: variante PT-BR de "Eugene"), confiança baixa, não confirmado.',
      ],
    },
    {
      heading: 'Não confirmados',
      paragraphs: [
        'Smith — Rare, papel não confirmado, tier baixo, confiança baixa.',
        'Lumak Bokan — não confirmado (possível variante de "Walis Bokan", Lancer/Epic, mas nomes não batem com certeza).',
      ],
    },
  ],
  source:
    'Busca dirigida por nome (BlueStacks, Theria Games, Whiteout Survival Wiki, Medium/Medieval Fun, One Chilled Gamer, gamestouse.com), 2026-07-03 — não é fonte única consolidada. Charlie, Eugenio, Smith e Lumak Bokan merecem confirmação in-game antes de qualquer decisão baseada neles. Já citado em docs/KNOWLEDGE-001-Game-Mechanics.md.',
}

export default article
