import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-tropas-tipos',
  category: 'tropas',
  title: 'Tropas: tipos, contra-ataque e proporções',
  summary: 'Infantaria, Lanceiro e Atirador — o ciclo de contra-ataque e as proporções recomendadas por objetivo.',
  sections: [
    {
      heading: 'Os 3 tipos',
      paragraphs: [
        'Infantaria: alta defesa e vida, especializada em combate corpo a corpo. É quem "aguenta" o dano na frente.',
        'Lanceiro: mid-range, ataque e durabilidade equilibrados.',
        'Atirador (Marksman): principal fonte de dano do jogo, atacando à distância — depende de Infantaria/Lanceiro para não tomar dano direto.',
      ],
    },
    {
      heading: 'Ciclo de contra-ataque',
      paragraphs: [
        'Sistema tipo pedra-papel-tesoura: Infantaria vence Lanceiro → Lanceiro vence Atirador → Atirador vence Infantaria. Cada vantagem representa um bônus de ataque/redução de dano (a faixa citada pelos guias varia de ~10% a ~20% dependendo da fonte).',
        'Na prática, o posicionamento e as skills de herói também pesam bastante — o contra-ataque não é absoluto, é a base da estratégia.',
      ],
    },
    {
      heading: 'Proporções recomendadas',
      paragraphs: [
        'Balanceada/geral: 50% Infantaria / 20% Lanceiro / 30% Atirador.',
        'Foco em dano (ataque): 40/20/40 ou 50/10/40.',
        'Foco em sobrevivência (defesa): 60% Infantaria / 20% / 20%.',
        'Armadilha do Urso (Bear Trap): fortemente concentrada em Atirador — até 80% se disponível, ou 60% como alternativa (10/10/80 ou 20/20/60). O evento recompensa dano total em ~30 minutos, não durabilidade.',
        'Não existe uma proporção "perfeita" fixa — ajuste conforme o evento, a inteligência sobre o inimigo e o desenvolvimento dos seus heróis.',
      ],
    },
  ],
  source:
    'One Chilled Gamer — Troop Guide, WoS Tools Wiki — Troops, A Jack Of — Best Troop Formation & Ratio, topuplive.com — Troop Types & Ratios (já citado em docs/KNOWLEDGE-001-Game-Mechanics.md, seção Tropas).',
}

export default article
