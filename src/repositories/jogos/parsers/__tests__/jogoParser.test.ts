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

    describe('parseSDEJogo - jogo sem escalação', () => {
        it('should parse jogo without escalacao (escalacao_id null) and return empty jogadores arrays', () => {
            const mockSDEResponseSemEscalacao: SDEJogoResponse = {
                referencias: {
                    arbitros: {},
                    atletas: {},
                    campeonatos: {
                        '351': {
                            campeonato_id: 351,
                            nome: 'Amistosos da Seleção Feminina',
                            nome_popular: '',
                            nome_alternativo: '',
                            slug: 'amistosos-selecao-feminina',
                            genero: 'F',
                            esporte_id: 1,
                            categoria_id: 7,
                            modalidade_id: 1,
                            logo: 'https://s.sde.globo.com/media/championships/logo_default.png',
                            logo_svg: 'https://s.sde.globo.com/media/championships/logo_default.svg'
                        }
                    },
                    categorias: {},
                    edicoes: {},
                    equipes: {
                        '3067': {
                            nome: 'Seleção Brasileira de Futebol',
                            nome_popular: 'Brasil',
                            apelido: 'Brasil',
                            equipe_id: 3067,
                            slug: 'brasil-feminino',
                            sigla: 'BRA',
                            genero: 'M',
                            nacionalidade_id: 1,
                            escudos: {
                                '30x30': 'https://s.sde.globo.com/media/organizations/2019/07/16/Brasil-30_uvn9jkx.png',
                                '45x45': 'https://s.sde.globo.com/media/organizations/2019/07/16/Brasil-45_3I1izky.png',
                                '60x60': 'https://s.sde.globo.com/media/organizations/2019/07/16/Brasil-65_JpqzQPE.png',
                                '150x150': 'https://s.sde.globo.com/media/organizations/logo_default.png',
                                svg: 'https://s.sde.globo.com/media/organizations/2019/07/16/Brasil_rgYHF6Z.svg',
                                escudo_alternativo: 'https://s.sde.globo.com/media/teams/logo_default.png',
                                escudo_alternativo_svg: 'https://s.sde.globo.com/media/teams/logo_default.svg'
                            },
                            cores: {
                                primaria: '#f3c500',
                                secundaria: '#005cb0',
                                terciaria: '#f2f2f2'
                            },
                            uniformes: []
                        },
                        '4412': {
                            nome: 'Seleção Italiana de Futebol',
                            nome_popular: 'Itália',
                            apelido: 'Itália',
                            equipe_id: 4412,
                            slug: 'italia-feminino',
                            sigla: 'ITA',
                            genero: 'F',
                            nacionalidade_id: 6,
                            escudos: {
                                '30x30': 'https://s.sde.globo.com/media/organizations/2019/09/02/Italia-30.png',
                                '45x45': 'https://s.sde.globo.com/media/organizations/2019/09/02/Italia-45.png',
                                '60x60': 'https://s.sde.globo.com/media/organizations/2019/09/02/Italia-65.png',
                                '150x150': 'https://s.sde.globo.com/media/organizations/logo_default.png',
                                svg: 'https://s.sde.globo.com/media/organizations/2019/09/02/Italia.svg',
                                escudo_alternativo: 'https://s.sde.globo.com/media/teams/logo_default.png',
                                escudo_alternativo_svg: 'https://s.sde.globo.com/media/teams/logo_default.svg'
                            },
                            cores: {
                                primaria: '#2c4ea9',
                                secundaria: '#ffffff',
                                terciaria: '#000000'
                            },
                            uniformes: []
                        }
                    },
                    escalacao: {},
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
                    jogo_id: 343531,
                    equipe_mandante_id: 4412,
                    placar_oficial_mandante: null,
                    placar_penaltis_mandante: null,
                    escalacao_mandante_id: null,
                    equipe_visitante_id: 3067,
                    placar_oficial_visitante: null,
                    placar_penaltis_visitante: null,
                    escalacao_visitante_id: null,
                    primeiro_atleta_id: null,
                    segundo_atleta_id: null,
                    data_realizacao: '2025-10-28',
                    hora_realizacao: '14:15:00',
                    hora_fim: null,
                    fuso_horario: 'America/Sao_Paulo',
                    data_realizacao_timezone: '2025-10-28T14:15:00-03:00',
                    sede_id: 1832,
                    fase_id: 20482,
                    wo: false,
                    cancelado: false,
                    decisivo: false,
                    rodada: null,
                    suspenso: false,
                    vencedor_jogo: null,
                    transmissoes: null,
                    detalhamento_placar: [],
                    disputa_medalha: false,
                    resultado: '',
                    status: 'Não disponivel'
                }
            };

            const result = parseSDEJogo(mockSDEResponseSemEscalacao);

            // Verify basic info
            expect(result.id).toBe('343531');
            expect(result.nome).toBe('Itália x Brasil');
            expect(result.esporte.nome).toBe('Futebol');
            expect(result.competicao.nome).toBe('Amistosos da Seleção Feminina');
            expect(result.rodada).toBeNull();
            expect(result.times).toHaveLength(2);

            // Verify times have empty jogadores arrays (no escalação)
            expect(result.times[0].nome).toBe('Itália');
            expect(result.times[0].sigla).toBe('ITA');
            expect(result.times[0].jogadores).toEqual([]);
            expect(result.times[0].cores).toEqual({
                primaria: '#2c4ea9',
                secundaria: '#ffffff',
                terciaria: '#000000'
            });

            expect(result.times[1].nome).toBe('Brasil');
            expect(result.times[1].sigla).toBe('BRA');
            expect(result.times[1].jogadores).toEqual([]);
            expect(result.times[1].cores).toEqual({
                primaria: '#f3c500',
                secundaria: '#005cb0',
                terciaria: '#f2f2f2'
            });
        });
    });

    describe('parseSDEJogo - atleta com fotos null', () => {
        it('should handle atleta with null fotos gracefully', () => {
            const mockSDEResponseFotosNull: SDEJogoResponse = {
                referencias: {
                    arbitros: {},
                    atletas: {
                        '123': {
                            atleta_id: 123,
                            posicao: {
                                macro: 'GOL',
                                sigla: 'GOL',
                                descricao: 'Goleiro',
                                macro_posicao: 'Gol'
                            },
                            nome: 'Jogador Sem Foto',
                            nome_popular: 'Sem Foto',
                            slug: 'sem-foto',
                            sexo: 'M',
                            fotos: null,
                            nacionalidade_id: 1,
                            fotos_contextuais: null
                        }
                    },
                    campeonatos: {
                        '26': {
                            campeonato_id: 26,
                            nome: 'Campeonato Teste',
                            nome_popular: '',
                            nome_alternativo: '',
                            slug: 'campeonato-teste',
                            genero: 'M',
                            esporte_id: 1,
                            categoria_id: 4,
                            modalidade_id: 1,
                            logo: 'https://s.sde.globo.com/media/championships/logo_default.png',
                            logo_svg: 'https://s.sde.globo.com/media/championships/logo_default.svg'
                        }
                    },
                    categorias: {},
                    edicoes: {},
                    equipes: {
                        '100': {
                            nome: 'Time A',
                            nome_popular: 'Time A',
                            apelido: 'Time A',
                            equipe_id: 100,
                            slug: 'time-a',
                            sigla: 'TMA',
                            genero: 'M',
                            nacionalidade_id: 1,
                            escudos: {
                                '30x30': 'https://example.com/30.png',
                                '45x45': 'https://example.com/45.png',
                                '60x60': 'https://example.com/60.png',
                                '150x150': 'https://example.com/150.png',
                                svg: 'https://example.com/svg.svg',
                                escudo_alternativo: 'https://example.com/alt.png',
                                escudo_alternativo_svg: 'https://example.com/alt.svg'
                            },
                            cores: {
                                primaria: '#000000',
                                secundaria: '#ffffff',
                                terciaria: '#cccccc'
                            },
                            uniformes: []
                        },
                        '200': {
                            nome: 'Time B',
                            nome_popular: 'Time B',
                            apelido: 'Time B',
                            equipe_id: 200,
                            slug: 'time-b',
                            sigla: 'TMB',
                            genero: 'M',
                            nacionalidade_id: 1,
                            escudos: {
                                '30x30': 'https://example.com/30.png',
                                '45x45': 'https://example.com/45.png',
                                '60x60': 'https://example.com/60.png',
                                '150x150': 'https://example.com/150.png',
                                svg: 'https://example.com/svg.svg',
                                escudo_alternativo: 'https://example.com/alt.png',
                                escudo_alternativo_svg: 'https://example.com/alt.svg'
                            },
                            cores: {
                                primaria: '#ff0000',
                                secundaria: '#0000ff',
                                terciaria: '#00ff00'
                            },
                            uniformes: []
                        }
                    },
                    escalacao: {
                        '1000': {
                            titulares: [
                                {
                                    camisa: '1',
                                    escalacaoequipe_id: 1000,
                                    atleta_id: 123,
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
                            tecnico_id: 999,
                            esquema_tatico: '4-4-2'
                        },
                        '2000': {
                            titulares: [],
                            reservas: [],
                            tecnico_id: 888,
                            esquema_tatico: '4-3-3'
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
                    jogo_id: 999999,
                    equipe_mandante_id: 100,
                    placar_oficial_mandante: null,
                    placar_penaltis_mandante: null,
                    escalacao_mandante_id: 1000,
                    equipe_visitante_id: 200,
                    placar_oficial_visitante: null,
                    placar_penaltis_visitante: null,
                    escalacao_visitante_id: 2000,
                    primeiro_atleta_id: null,
                    segundo_atleta_id: null,
                    data_realizacao: '2025-10-31',
                    hora_realizacao: '20:00:00',
                    hora_fim: null,
                    fuso_horario: 'America/Sao_Paulo',
                    data_realizacao_timezone: '2025-10-31T20:00:00-03:00',
                    sede_id: 100,
                    fase_id: 100,
                    wo: false,
                    cancelado: false,
                    decisivo: false,
                    rodada: 10,
                    suspenso: false,
                    vencedor_jogo: null,
                    transmissoes: null,
                    detalhamento_placar: [],
                    disputa_medalha: false,
                    resultado: '',
                    status: 'Não disponivel'
                }
            };

            const result = parseSDEJogo(mockSDEResponseFotosNull);

            // Verify basic info
            expect(result.id).toBe('999999');
            expect(result.nome).toBe('Time A x Time B');
            expect(result.rodada).toBe('10');

            // Verify mandante has 1 player with null fotos
            expect(result.times[0].nome).toBe('Time A');
            expect(result.times[0].jogadores).toHaveLength(1);
            expect(result.times[0].jogadores[0].nome_popular).toBe('Sem Foto');
            expect(result.times[0].jogadores[0].foto_319x388).toBe(''); // Should fallback to empty string
            expect(result.times[0].jogadores[0].fotos_contextuais).toEqual([]); // Should be empty array

            // Verify visitante has empty jogadores (no titulares)
            expect(result.times[1].nome).toBe('Time B');
            expect(result.times[1].jogadores).toEqual([]);
        });
    });
});
