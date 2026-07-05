import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'guia-alianca',
  category: 'guia',
  title: 'Guia de Alianças',
  summary: 'Cargos (R1-R5), como contribuir com tecnologia, loja de aliança e como escolher uma boa aliança.',
  sections: [
    {
      heading: 'Cargos (R1 a R5)',
      paragraphs: [
        'R1 (padrão ao entrar): acesso ao chat da aliança, ver perfis de membros, contribuir com tecnologia e sair da aliança.',
        'R2: mesmas permissões do R1, mais a capacidade de mandar mensagens para toda a aliança.',
        'R3: pode promover/rebaixar membros R1 e R2.',
        'R4: pode promover/rebaixar até R3, expulsar membros, iniciar pesquisas de tecnologia da aliança, mexer em configurações (idioma, mural, construções da aliança, preferências de recrutamento, convites).',
        'R5 (líder): controle total — inclui tudo do R4, mais construir/realocar a Sede da Aliança, transferir liderança, dissolver ou renomear a aliança, trocar tag/bandeira.',
      ],
    },
    {
      heading: 'Tecnologia e doações',
      paragraphs: [
        'Só R4 e R5 podem iniciar uma pesquisa de tecnologia da aliança, mas qualquer membro pode contribuir com recursos (carvão, madeira, carne, ferro) para acelerá-la. Tecnologias com o ícone verde de "recomendado" dão até +20% de recompensa extra na contribuição.',
        'Dá para contribuir até 25 vezes seguidas; depois disso, uma nova tentativa libera a cada 10 minutos.',
      ],
    },
    {
      heading: 'Loja de Aliança',
      paragraphs: [
        'Tokens de aliança (ganhos contribuindo com tecnologia) são trocados na Loja de Aliança por itens com desconto: teletransportes de território, aceleradores, fragmentos de herói, cartões de renomear, escudos de cidade, entre outros.',
      ],
    },
    {
      heading: 'Pedido de ajuda',
      paragraphs: [
        'Use o botão de Ajuda para pedir que outros membros acelerem sua construção/pesquisa em andamento — cada ajuda reduz um tempo fixo da fila, e esse valor aumenta conforme a aliança evolui sua tecnologia. Especialmente valioso no início, quando os tempos de fila ainda são longos.',
      ],
    },
    {
      heading: 'Como escolher uma aliança',
      paragraphs: [
        'Prioridade não é o nível/poder da aliança e sim atividade real: chat movimentado, doações frequentes, eventos coordenados. Uma aliança de nível médio mas ativa entrega muito mais valor no dia a dia do que uma aliança "grande no papel" mas com pouca atividade.',
      ],
    },
  ],
  source:
    'lootbar.com — Alliance Guide, ldshop.gg — Alliance Domination Guide, onechilledgamer.com — Alliance Guide, ldcloud.net — Alliance Guide (pesquisado em 2026-07-05).',
}

export default article
