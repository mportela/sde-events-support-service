import { describe, expect, it } from '@jest/globals';
import type { SDEJogoResponse } from '../../../../types/jogo.types.js';
import { createMockJogo, parseSDEJogo } from '../jogoParser.js';

describe('jogoParser', () => {
    describe('parseSDEJogo', () => {
        it('should parse SDE jogo response correctly', () => {
            const mockSDEResponse: SDEJogoResponse = {
                referencias: {
                    arbitros: {},
                    atletas: {
                        '87863': {
                            atleta_id: 87863,
                            posicao: {
                                macro: 'MEI',
                                sigla: 'MEC',
                                descricao: 'Meio-campo',
                                macro_posicao: null
                            },
                            nome: 'Giorgian Daniel de Arrascaeta Benedetti',
                            nome_popular: 'Arrascaeta',
                            slug: 'arrascaeta',
                            sexo: 'M',
                            fotos: {
                                '319x388': 'https://s.sde.globo.com/media/person_role/2022/04/25/cc92618f5866aefc097fc6f6ad12eef6_original.png',
                                '300x300': 'https://s.sde.globo.com/media/person_role/2024/03/20/photo_300x300_o07zM3w.png'
                            },
                            nacionalidade_id: 198,
                            fotos_contextuais: {
                                '262': {
                                    equipe: 262,
                                    spotlight: {
                                        altura: 500,
                                        data_criacao: '2025-09-20 15:01:05',
                                        largura: 479,
                                        tipo: 'spotlight',
                                        url: 'https://s.sde.globo.com/media/person_contract/2025/09/20/photo_spotlight.png'
                                    }
                                }
                            }
                        },
                        '99552': {
                            atleta_id: 99552,
                            posicao: {
                                macro: 'GOL',
                                sigla: 'GOL',
                                descricao: 'Goleiro',
                                macro_posicao: 'Gol'
                            },
                            nome: 'Agustín Daniel Rossi',
                            nome_popular: 'Rossi',
                            slug: 'agustin-rossi',
                            sexo: 'M',
                            fotos: {
                                '300x300': 'https://s.sde.globo.com/media/person_role/2025/04/07/photo_300x300_0enYAuj.png'
                            },
                            nacionalidade_id: 14,
                            fotos_contextuais: {
                                '262': null
                            }
                        },
                        '107183': {
                            atleta_id: 107183,
                            posicao: {
                                macro: 'GOL',
                                sigla: 'GOL',
                                descricao: 'Goleiro',
                                macro_posicao: 'Gol'
                            },
                            nome: 'Leonardo Matias Baiersdorf Linck',
                            nome_popular: 'Léo Linck',
                            slug: 'leolinck',
                            sexo: 'M',
                            fotos: {
                                '300x300': 'https://s.sde.globo.com/media/person_role/2025/04/04/photo_300x300_FKStERZ.png'
                            },
                            nacionalidade_id: 1,
                            fotos_contextuais: {
                                '263': null
                            }
                        }
                    },
                    campeonatos: {
                        '26': {
                            campeonato_id: 26,
                            nome: 'Campeonato Brasileiro',
                            nome_popular: '',
                            nome_alternativo: 'Brasileiro - Série A',
                            slug: 'campeonato-brasileiro',
                            genero: 'M',
                            esporte_id: 1,
                            categoria_id: 4,
                            modalidade_id: 1,
                            logo: 'https://s.sde.globo.com/media/championships/brasileirao-serie-a.png',
                            logo_svg: 'https://s.sde.globo.com/media/championships/brasileirao-serie-a.svg'
                        }
                    },
                    categorias: {},
                    edicoes: {},
                    equipes: {
                        '262': {
                            nome: 'Clube de Regatas do Flamengo',
                            nome_popular: 'Flamengo',
                            apelido: 'Mengão',
                            equipe_id: 262,
                            slug: 'flamengo',
                            sigla: 'FLA',
                            genero: 'M',
                            nacionalidade_id: 1,
                            escudos: {
                                '30x30': 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-30.png',
                                '45x45': 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-45.png',
                                '60x60': 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-65.png',
                                '150x150': 'https://s.sde.globo.com/media/organizations/2024/09/30/flamengo.png',
                                svg: 'https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg',
                                escudo_alternativo: 'https://s.sde.globo.com/media/teams/logo_default.png',
                                escudo_alternativo_svg: 'https://s.sde.globo.com/media/teams/logo_default.svg'
                            },
                            cores: {
                                primaria: '#a80000',
                                secundaria: '#000000',
                                terciaria: '#000000'
                            },
                            uniformes: []
                        },
                        '263': {
                            nome: 'Botafogo de Futebol e Regatas',
                            nome_popular: 'Botafogo',
                            apelido: 'Glorioso',
                            equipe_id: 263,
                            slug: 'botafogo',
                            sigla: 'BOT',
                            genero: 'M',
                            nacionalidade_id: 1,
                            escudos: {
                                '30x30': 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-30.png',
                                '45x45': 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-45.png',
                                '60x60': 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-65.png',
                                '150x150': 'https://s.sde.globo.com/media/organizations/2024/09/30/Botafogo.png',
                                svg: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg',
                                escudo_alternativo: 'https://s.sde.globo.com/media/teams/logo_default.png',
                                escudo_alternativo_svg: 'https://s.sde.globo.com/media/teams/logo_default.svg'
                            },
                            cores: {
                                primaria: '#000000',
                                secundaria: '#ffffff',
                                terciaria: '#cccccc'
                            },
                            uniformes: []
                        }
                    },
                    escalacao: {
                        '504330': {
                            titulares: [
                                {
                                    camisa: '24',
                                    escalacaoequipe_id: 504330,
                                    atleta_id: 107183,
                                    posicao_campo: {
                                        macro: 'GOL',
                                        sigla: 'GOL',
                                        descricao: 'Goleiro',
                                        macro_posicao: 'Gol'
                                    },
                                    ordem: 0,
                                    substituido: null
                                }
                            ],
                            reservas: [],
                            tecnico_id: 145269,
                            esquema_tatico: '4-2-3-1'
                        },
                        '504331': {
                            titulares: [
                                {
                                    camisa: '1',
                                    escalacaoequipe_id: 504331,
                                    atleta_id: 99552,
                                    posicao_campo: {
                                        macro: 'GOL',
                                        sigla: 'GOL',
                                        descricao: 'Goleiro',
                                        macro_posicao: 'Gol'
                                    },
                                    ordem: 0,
                                    substituido: null
                                },
                                {
                                    camisa: '10',
                                    escalacaoequipe_id: 504331,
                                    atleta_id: 87863,
                                    posicao_campo: {
                                        macro: 'MEI',
                                        sigla: 'MEC',
                                        descricao: 'Meio-campo',
                                        macro_posicao: null
                                    },
                                    ordem: 7,
                                    substituido: null
                                }
                            ],
                            reservas: [],
                            tecnico_id: 139076,
                            esquema_tatico: '4-4-2'
                        }
                    },
                    esportes: {
                        '1': {
                            esporte_id: 1,
                            nome: 'Futebol',
                            slug: 'futebol',
                            codigo_odf: 'FBL',
                            logo: 'https://s.sde.globo.com/media/sports/logo_default.png',
                            logo_svg: 'https://s.sde.globo.com/media/sports/futebol.svg'
                        }
                    },
                    fases: {},
                    modalidades: {},
                    nacionalidades: {},
                    sedes: {},
                    super_edicoes: {},
                    super_eventos: {}
                },
                resultados: {
                    jogo_id: 334218,
                    equipe_mandante_id: 263,
                    placar_oficial_mandante: null,
                    placar_penaltis_mandante: null,
                    escalacao_mandante_id: 504330,
                    equipe_visitante_id: 262,
                    placar_oficial_visitante: null,
                    placar_penaltis_visitante: null,
                    escalacao_visitante_id: 504331,
                    primeiro_atleta_id: null,
                    segundo_atleta_id: null,
                    data_realizacao: '2025-10-15',
                    hora_realizacao: '19:30:00',
                    hora_fim: null,
                    fuso_horario: 'America/Sao_Paulo',
                    data_realizacao_timezone: '2025-10-15T19:30:00-03:00',
                    sede_id: 412,
                    fase_id: 20358,
                    wo: false,
                    cancelado: false,
                    decisivo: false,
                    rodada: 28,
                    suspenso: false,
                    vencedor_jogo: null,
                    transmissoes: null,
                    detalhamento_placar: [],
                    disputa_medalha: false,
                    resultado: '',
                    status: 'Não disponivel'
                }
            };

            const result = parseSDEJogo(mockSDEResponse);

            expect(result.id).toBe('334218');
            expect(result.nome).toBe('Botafogo x Flamengo');
            expect(result.esporte.nome).toBe('Futebol');
            expect(result.competicao.nome).toBe('Campeonato Brasileiro');
            expect(result.times).toHaveLength(2);

            // Verify Botafogo team
            expect(result.times[0].nome).toBe('Botafogo');
            expect(result.times[0].sigla).toBe('BOT');
            expect(result.times[0].jogadores).toHaveLength(1);
            expect(result.times[0].jogadores[0].nome_popular).toBe('Léo Linck');

            // Verify Flamengo team
            expect(result.times[1].nome).toBe('Flamengo');
            expect(result.times[1].sigla).toBe('FLA');
            expect(result.times[1].jogadores).toHaveLength(2);
            expect(result.times[1].jogadores[1].nome_popular).toBe('Arrascaeta');
            expect(result.times[1].jogadores[1].foto_319x388).toContain('cc92618f5866aefc097fc6f6ad12eef6_original.png');
            expect(result.times[1].jogadores[1].fotos_contextuais).toHaveLength(1);
        });
    });

    describe('createMockJogo', () => {
        it('should create valid mock jogo', () => {
            const mockJogo = createMockJogo();

            expect(mockJogo.id).toBe('334218');
            expect(mockJogo.nome).toBe('Botafogo x Flamengo');
            expect(mockJogo.times).toHaveLength(2);
            expect(mockJogo.times[0].jogadores.length).toBeGreaterThan(0);
            expect(mockJogo.times[1].jogadores.length).toBeGreaterThan(0);
        });
    });
});
