import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'guia-iniciante',
  category: 'guia',
  title: 'Guia para iniciantes',
  summary: 'O que priorizar nos primeiros dias e nas primeiras semanas de estado.',
  sections: [
    {
      heading: 'Dias 1-3: infraestrutura de sobrevivência',
      paragraphs: [
        'Os primeiros dias são sobre não deixar a produção travar. Mantenha a Fornalha sempre alimentada — ela é o "coração" da cidade: se ela para, a produção e o exército inteiro ficam parados.',
        'Suba os Abrigos cedo: mais população = mais recursos coletados por hora. Moral e Enfermaria (cura) também importam desde o início — sem eles, a população desaba com o tempo.',
        'Serraria e Mina de Ferro são a espinha dorsal do início de jogo — mantenha as duas produzindo no máximo da capacidade.',
      ],
    },
    {
      heading: 'Fim da primeira semana',
      paragraphs: [
        'Depois da primeira semana o foco muda de "sobreviver" para "revidar". O Centro de Comando é a construção-mãe: cada nível dele libera novos prédios, limites mais altos e mais poder de rally.',
        'Ordem geral de prioridade: Fornalha primeiro, depois Pesquisa, depois desenvolvimento de heróis. A Fornalha determina o ritmo de progresso de tudo mais e libera boa parte dos sistemas do jogo (ver artigo de Construções).',
      ],
    },
    {
      heading: 'Aceleradores e recursos',
      paragraphs: [
        'Não segure aceleradores no início — gaste sem dó em construção e pesquisa. Aceleradores maiores e melhores aparecem depois; economizar demais no começo só atrasa seu crescimento.',
        'Guarde excedente de recursos como itens no inventário em vez de deixá-los "soltos" no Depósito — recursos parados no armazém são alvo fácil de ataque. Ative o escudo (ou esconda as tropas) sempre que for ficar off-line por muito tempo.',
      ],
    },
    {
      heading: 'Heróis: foco, não dispersão',
      paragraphs: [
        'Não distribua recursos entre muitos heróis fracos. Escolha de 1 a 3 heróis prioritários (combate, cura, coleta) e invista neles primeiro — o retorno de poucos heróis fortes é muito maior do que muitos heróis medianos.',
      ],
    },
    {
      heading: 'Aliança desde o início',
      paragraphs: [
        'Entrar numa aliança cedo dá proteção, ajuda para acelerar filas, recompensas compartilhadas e acesso a eventos de aliança — uma das maiores fontes de recompensas premium para jogadores F2P.',
        'Prioridade não é o nível da aliança, é a atividade: chat ativo, doações frequentes, eventos coordenados. Uma aliança média mas ativa vale mais que uma aliança "grande" mas morta. Ver o artigo "Guia de Alianças" para detalhes de como contribuir e quais cargos existem.',
      ],
    },
  ],
  source:
    'lootbar.gg — Beginner Guide / Resource Priorities, ldshop.gg — Beginner Guide & Best Starting Strategy, mistplay.com — How to Play Whiteout Survival (pesquisado em 2026-07-05).',
}

export default article
