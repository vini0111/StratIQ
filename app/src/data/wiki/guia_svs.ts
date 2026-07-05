import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'guia-svs',
  category: 'guia',
  title: 'Guia de SvS (State vs State)',
  summary: 'O que é, como funciona o ciclo de fases e a regra de ouro sobre aceleradores.',
  sections: [
    {
      heading: 'O que é',
      paragraphs: [
        'SvS (State vs State, também chamado de "Estado de Poder") coloca todo o seu estado contra outro estado inteiro, competindo por pontos ao longo de um ciclo de cerca de 10 dias. Roda aproximadamente 1x por mês.',
      ],
    },
    {
      heading: 'As 4 fases do ciclo',
      paragraphs: [
        'Matchmaking (2 dias): o jogo pareia seu estado contra um adversário de força parecida. Nada específico a fazer ainda, além de continuar jogando normal.',
        'Preparação (5 dias): cada dia tem um tema diferente — Construção, Pesquisa, Feras, Treino e Power Boost. Pontuar bem no tema do dia rende mais do que gastar recursos em qualquer outro dia da fase.',
        'Batalha (12h): o confronto direto entre os dois estados. É aqui que os aceleradores guardados fazem diferença.',
        'Triagem / Revive (~50h): fase final de recuperação de tropas feridas/perdidas.',
      ],
    },
    {
      heading: 'A regra de ouro',
      paragraphs: [
        'Não gaste aceleradores grandes fora da SvS. Guarde-os para os dias temáticos da fase de Preparação e para a fase de Batalha — é aí que eles valem mais pontos. Isso vale também para upgrades de equipamento: prioridade é para a SvS, não para eventos menores como a Mobilização da Aliança.',
      ],
    },
  ],
  source:
    'WosTools — SvS Prep Phase Guide 2026, Whiteout Survival Handbook — SvS Guide 2026 (já citado em docs/KNOWLEDGE-001-Game-Mechanics.md, seção Eventos).',
}

export default article
