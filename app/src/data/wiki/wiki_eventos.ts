import type { WikiArticle } from '../../types'

const article: WikiArticle = {
  id: 'wiki-eventos',
  category: 'eventos',
  title: 'Eventos recorrentes',
  summary: 'Cadência e regras-chave dos principais eventos do jogo.',
  sections: [
    {
      heading: 'Roda da Sorte (Lucky Wheel)',
      paragraphs: [
        'A cada 2 semanas, dura 3 dias. Giro avulso custa 1.500 gemas, ou 13.500 por 10 giros. Marcos de recompensa em 5, 15, 35, 70 e 120 giros — maximizar (120 giros) custa 159.000 gemas.',
        'Jogadores F2P costumam parar em 4 estrelas do herói: a 5ª estrela rende pouco a mais e as gemas restantes valem mais guardadas.',
      ],
    },
    {
      heading: 'SvS (State vs State)',
      paragraphs: ['Ver artigo dedicado "Guia de SvS" na seção Guia — cadência, fases e a regra de aceleradores.'],
    },
    {
      heading: 'Mobilização da Aliança',
      paragraphs: [
        'Evento mensal de 6 dias (segunda a sábado). Regra nº1: não usar aceleradores grandes nem upgrades de equipamento aqui — eles devem ser guardados para a SvS.',
      ],
    },
    {
      heading: 'Armadilha do Urso (Bear Trap)',
      paragraphs: [
        'Evento de aliança, ~30 minutos de dano ao urso. Composição balanceada de tropas perde dano — o evento recompensa DPS, não durabilidade (ver "Tropas: tipos, contra-ataque e proporções").',
        'Quem lidera o rally contribui com as Expedition Skills de até 3 heróis (9 skills se todos forem Mythic); quem só entra no rally contribui com só a 1ª skill do 1º herói da marcha.',
      ],
    },
    {
      heading: 'Confronto do Cânion (Canyon Clash)',
      paragraphs: [
        'Evento mensal de aliança — só as 20 alianças mais fortes (por poder) do servidor participam. A batalha dura 1h, mas a preparação leva a semana toda.',
      ],
    },
    {
      heading: 'Frostfire',
      paragraphs: ['Um dos poucos eventos solo do jogo. A cada 2 semanas, ~30 minutos numa zona de combate dedicada.'],
    },
    {
      heading: 'Cerco de Inverno (novo, em observação)',
      paragraphs: [
        'Anunciado no changelog do jogo em 2026-07-05: evento de aliança de disputa de fortalezas (esquadrões de guarnição defendem, outros atacam fortalezas inimigas). Cadência e recompensas ainda não documentadas — sem guia de comunidade disponível no momento.',
      ],
    },
  ],
  source: 'Ver fontes individuais em docs/KNOWLEDGE-001-Game-Mechanics.md (seção Eventos).',
}

export default article
