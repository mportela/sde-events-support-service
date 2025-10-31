import type {
    Jogo,
    JogoPlayer,
    JogoTeam,
    SDEAtleta,
    SDEEquipe,
    SDEEscalacao,
    SDEJogoResponse
} from '../../../types/jogo.types.js';

/**
 * Parses SDE API jogo response to internal Jogo format
 */
export function parseSDEJogo(sdeResponse: SDEJogoResponse): Jogo {
    const { referencias, resultados } = sdeResponse;

    // Get campeonato info
    const campeonato = referencias.campeonatos[Object.keys(referencias.campeonatos)[0]];

    // Get esporte info
    const esporte = referencias.esportes[Object.keys(referencias.esportes)[0]];

    // Get equipes
    const equipeMandante = referencias.equipes[resultados.equipe_mandante_id];
    const equipeVisitante = referencias.equipes[resultados.equipe_visitante_id];

    // Get escalações (podem ser null quando o jogo ainda não tem escalação definida)
    const escalacaoMandante = resultados.escalacao_mandante_id
        ? referencias.escalacao[resultados.escalacao_mandante_id]
        : null;
    const escalacaoVisitante = resultados.escalacao_visitante_id
        ? referencias.escalacao[resultados.escalacao_visitante_id]
        : null;

    // Parse times with jogadores
    const times: JogoTeam[] = [
        parseTeamWithPlayers(
            equipeMandante,
            escalacaoMandante,
            referencias.atletas,
            resultados.equipe_mandante_id
        ),
        parseTeamWithPlayers(
            equipeVisitante,
            escalacaoVisitante,
            referencias.atletas,
            resultados.equipe_visitante_id
        )
    ];

    // Build game name
    const nome = `${equipeMandante.nome_popular} x ${equipeVisitante.nome_popular}`;

    return {
        id: String(resultados.jogo_id),
        nome,
        esporte: {
            id: String(esporte.esporte_id),
            slug: esporte.slug,
            nome: esporte.nome
        },
        competicao: {
            nome: campeonato.nome
        },
        times,
        rodada: resultados.rodada ? String(resultados.rodada) : null
    };
}

/**
 * Parse team with players from escalação
 * If escalação is null (jogo sem escalação), returns team with empty jogadores array
 */
function parseTeamWithPlayers(
    equipe: SDEEquipe,
    escalacao: SDEEscalacao | null,
    atletas: Record<string, SDEAtleta>,
    equipeId: number
): JogoTeam {
    // Get all players from escalação (titulares)
    // If escalação is null, return empty array
    // Filter out players that don't exist in atletas dictionary
    const jogadores: JogoPlayer[] = escalacao?.titulares
        .map(titular => {
            const atleta = atletas[titular.atleta_id];
            if (!atleta) {
                return null;
            }
            return parsePlayer(atleta, equipeId);
        })
        .filter((jogador): jogador is JogoPlayer => jogador !== null) ?? [];

    return {
        nome: equipe.nome_popular,
        sigla: equipe.sigla,
        escudo60x60: equipe.escudos['60x60'],
        escudoSvg: equipe.escudos.svg,
        cores: equipe.cores || null,
        jogadores
    };
}

/**
 * Parse player from atleta
 */
function parsePlayer(atleta: SDEAtleta, equipeId: number): JogoPlayer {
    // Get foto 319x388 or fallback to other sizes
    // Handle case where atleta.fotos is null
    const foto_319x388 = atleta.fotos?.['319x388'] ||
        atleta.fotos?.['300x300'] ||
        atleta.fotos?.['220x220'] ||
        atleta.fotos?.['140x140'] ||
        '';

    // Extract fotos_contextuais URLs for this equipe
    const fotosContextuaisUrls: string[] = [];
    const fotosContextuais = atleta.fotos_contextuais?.[String(equipeId)];

    if (fotosContextuais?.spotlight) {
        fotosContextuaisUrls.push(fotosContextuais.spotlight.url);
    }

    return {
        nome: atleta.nome,
        nome_popular: atleta.nome_popular,
        slug: atleta.slug,
        sexo: atleta.sexo,
        foto_319x388,
        fotos_contextuais: fotosContextuaisUrls
    };
}

/**
 * Creates a mock jogo for testing
 */
export function createMockJogo(): Jogo {
    return {
        id: '334218',
        nome: 'Botafogo x Flamengo',
        esporte: {
            id: '1',
            slug: 'futebol',
            nome: 'Futebol'
        },
        competicao: {
            nome: 'Campeonato Brasileiro'
        },
        times: [
            {
                nome: 'Botafogo',
                sigla: 'BOT',
                escudo60x60: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-65.png',
                escudoSvg: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg',
                cores: {
                    primaria: '#000000',
                    secundaria: '#ffffff',
                    terciaria: '#cccccc'
                },
                jogadores: [
                    {
                        nome: 'Leonardo Matias Baiersdorf Linck',
                        nome_popular: 'Léo Linck',
                        slug: 'leolinck',
                        sexo: 'M',
                        foto_319x388: 'https://s.sde.globo.com/media/person_role/2025/04/04/photo_300x300_FKStERZ.png',
                        fotos_contextuais: []
                    },
                    {
                        nome: 'Allan Marques Loureiro',
                        nome_popular: 'Allan',
                        slug: 'allan2',
                        sexo: 'M',
                        foto_319x388: 'https://s.sde.globo.com/media/person_role/2025/04/04/photo_300x300_7xrPgTB.png',
                        fotos_contextuais: ['https://s.sde.globo.com/media/person_contract/2024/12/09/photo_spotlight_5VBVZJh.png']
                    }
                ]
            },
            {
                nome: 'Flamengo',
                sigla: 'FLA',
                escudo60x60: 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-65.png',
                escudoSvg: 'https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg',
                cores: {
                    primaria: '#a80000',
                    secundaria: '#000000',
                    terciaria: '#000000'
                },
                jogadores: [
                    {
                        nome: 'Agustín Daniel Rossi',
                        nome_popular: 'Rossi',
                        slug: 'agustin-rossi',
                        sexo: 'M',
                        foto_319x388: 'https://s.sde.globo.com/media/person_role/2025/04/07/photo_300x300_0enYAuj.png',
                        fotos_contextuais: []
                    },
                    {
                        nome: 'Giorgian Daniel de Arrascaeta Benedetti',
                        nome_popular: 'Arrascaeta',
                        slug: 'arrascaeta',
                        sexo: 'M',
                        foto_319x388: 'https://s.sde.globo.com/media/person_role/2022/04/25/cc92618f5866aefc097fc6f6ad12eef6_original.png',
                        fotos_contextuais: [
                            'https://s.sde.globo.com/media/person_contract/2025/09/20/photo_spotlight.png'
                        ]
                    }
                ]
            }
        ],
        rodada: '28'
    };
}
