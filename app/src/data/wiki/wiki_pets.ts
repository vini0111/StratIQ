import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-pets',
  category: 'pets',
  title: 'Pets: raridade, habilidades e evolução',
  summary: 'Como os pets funcionam — raridade, tipos de habilidade, evolução e prioridade F2P. Domínio pesquisado pela primeira vez nesta rodada.',
  sections: [
    {
      heading: 'Raridade',
      paragraphs: [
        'Pets se dividem em Comum (N) e Lendário (SSR), com jogadores iniciantes/F2P também tendo acesso a pets Raro (R) e Épico (SR).',
        'Desbloqueados a partir da Fornalha 18 (construção Beast Cage).',
      ],
    },
    {
      heading: 'Habilidades: desenvolvimento vs. combate',
      paragraphs: [
        'Cada pet tem uma habilidade própria, usável uma vez por dia, dividida em duas categorias:',
        'Desenvolvimento/Crescimento: ex. Hiena-das-cavernas (+15% velocidade de construção por 5 min), Lobo Ártico (restaura 60 de stamina do Chefe), Boi Almiscarado (coleta instantânea de uma célula de recurso).',
        'Combate: ex. Tigre-dente-de-sabre ("Ataque Supremo", +10% letalidade das tropas por 2h), Leão-das-cavernas ("Hino Feroz", +10% ataque de todas as tropas por 2h).',
      ],
    },
    {
      heading: 'Evolução',
      paragraphs: [
        'A cada 10 níveis o pet bate um teto de crescimento. Para quebrar esse teto, usa-se Marcas de Avanço. O 1º avanço (nível 10) libera a Habilidade Ativa do pet — o marco mais importante; avanços seguintes aumentam a força da habilidade e o novo teto de nível.',
        'Refinamento usa Marcas Selvagens para ajustar os status do pet — mais ataque, mais defesa ou mais economia, conforme a necessidade.',
      ],
    },
    {
      heading: 'Prioridade para F2P',
      paragraphs: [
        'Foque primeiro em Hiena-das-cavernas e Boi Almiscarado — eles aceleram o crescimento da cidade mais rápido no início. Guarde Marcas de Avanço e Marcas Selvagens para quando desbloquear o Leopardo-das-neves ou o Leão-das-cavernas.',
      ],
    },
  ],
  source:
    'u7buy.com — Pet Guide 2026, Whiteout Survival Wiki — Pets, BlueStacks — Pets Tier List, LDCloud — Pet Guide, ldshop.gg — Pet Guide (pesquisado em 2026-07-05, domínio novo — nomes de pets em PT traduzidos do inglês, não confirmados contra o cliente do jogo).',
}

export default article
