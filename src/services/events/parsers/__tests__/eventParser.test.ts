import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import eventParser from '../eventParser.js';

describe('Event Parser', () => {
    beforeEach(() => {
        eventParser.clearReferences();
        // Silencia console.log durante os testes
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restaura os mocks
        jest.restoreAllMocks();
    });

    describe('parseApiResponse', () => {
        it('should parse API response with complete data', () => {
            const apiResponse = {
                referencias: {
                    equipes: {
                        '1': {
                            nome_popular: 'Flamengo',
                            nome: 'Clube de Regatas do Flamengo',
                            sigla: 'FLA',
                            escudos: {
                                '60x60': 'https://example.com/flamengo-60.png',
                                'svg': 'https://example.com/flamengo.svg'
                            }
                        },
                        '2': {
                            nome_popular: 'Fluminense',
                            nome: 'Fluminense Football Club',
                            sigla: 'FLU',
                            escudos: {
                                '60x60': 'https://example.com/fluminense-60.png',
                                'svg': 'https://example.com/fluminense.svg'
                            }
                        }
                    },
                    campeonatos: {
                        '26': {
                            campeonato_id: 26,
                            nome: 'Campeonato Brasileiro',
                            nome_popular: 'Brasileirão'
                        }
                    },
                    esportes: {
                        '1': {
                            esporte_id: 1,
                            nome: 'Futebol',
                            slug: 'futebol'
                        }
                    },
                    edicoes: {
                        '6749': {
                            edicao_id: 6749,
                            nome: 'Campeonato Brasileiro 2025',
                            campeonato_id: 26,
                            esporte_id: 1
                        }
                    },
                    fases: {
                        '20358': {
                            fase_id: 20358,
                            nome: 'Fase única',
                            edicao_id: 6749
                        }
                    }
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 334198,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: 2,
                            placar_oficial_visitante: 1,
                            data_realizacao: '2025-10-11',
                            hora_realizacao: '21:30:00',
                            fase_id: 20358,
                            rodada: 26,
                            transmissoes: {
                                sem_transmissao: false,
                                plataformas: [
                                    {
                                        transmissao_id: 5,
                                        nome: 'Premiere',
                                        logo_oficial: 'https://example.com/premiere.png',
                                        logo_destaque: '',
                                        url: '',
                                        descricao: 'Assine o Premiere',
                                        call_to_action: 'Assine'
                                    }
                                ]
                            }
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '334198',
                nome: 'Flamengo 2 x 1 Fluminense',
                esporte: {
                    id: '1',
                    slug: 'futebol',
                    nome: 'Futebol'
                },
                competicao: {
                    nome: 'Brasileirão'
                },
                dataHora: '2025-10-11T21:30:00'
            });

            expect(result[0].times).toHaveLength(2);
            expect(result[0].times[0]).toMatchObject({
                nome: 'Flamengo',
                sigla: 'FLA',
                escudo60x60: 'https://example.com/flamengo-60.png',
                escudoSvg: 'https://example.com/flamengo.svg'
            });
        });

        it('should handle games without score', () => {
            const apiResponse = {
                referencias: {
                    equipes: {
                        '1': { nome_popular: 'Time A', sigla: 'TIA', escudos: {} },
                        '2': { nome_popular: 'Time B', sigla: 'TIB', escudos: {} }
                    },
                    campeonatos: { '1': { nome: 'Campeonato X' } },
                    esportes: { '1': { esporte_id: 1, nome: 'Futebol', slug: 'futebol' } },
                    edicoes: { '1': { edicao_id: 1, campeonato_id: 1, esporte_id: 1 } },
                    fases: { '1': { fase_id: 1, edicao_id: 1 } }
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-10-12',
                            hora_realizacao: '16:00:00',
                            fase_id: 1,
                            rodada: 1
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result[0].nome).toBe('Time A x Time B');
        });

        it('should parse transmissoes correctly', () => {
            const apiResponse = {
                referencias: {
                    equipes: {
                        '1': { nome_popular: 'Time A', sigla: 'TIA', escudos: {} },
                        '2': { nome_popular: 'Time B', sigla: 'TIB', escudos: {} }
                    },
                    campeonatos: {},
                    esportes: { '1': { esporte_id: 1, nome: 'Futebol', slug: 'futebol' } },
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-10-12',
                            hora_realizacao: '16:00:00',
                            fase_id: 1,
                            rodada: 1,
                            transmissoes: {
                                sem_transmissao: false,
                                plataformas: [
                                    {
                                        transmissao_id: 1,
                                        nome: 'Globo',
                                        logo_oficial: 'https://example.com/globo.png',
                                        logo_destaque: '',
                                        url: '',
                                        descricao: 'Na TV Globo',
                                        call_to_action: 'Assista'
                                    },
                                    {
                                        transmissao_id: 2,
                                        nome: 'SporTV',
                                        logo_oficial: 'https://example.com/sportv.png',
                                        logo_destaque: '',
                                        url: '',
                                        descricao: 'No SporTV',
                                        call_to_action: 'Assista'
                                    }
                                ]
                            }
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result[0].transmissoes).toBeDefined();
            expect(result[0].transmissoes?.semTransmissao).toBe(false);
            expect(result[0].transmissoes?.plataformas).toHaveLength(2);
            expect(result[0].transmissoes?.plataformas[0]).toMatchObject({
                nome: 'Globo',
                logoOficial: 'https://example.com/globo.png',
                descricao: 'Na TV Globo'
            });
        });

        it('should handle games without transmissions', () => {
            const apiResponse = {
                referencias: {
                    equipes: {
                        '1': { nome_popular: 'Time A', sigla: 'TIA', escudos: {} },
                        '2': { nome_popular: 'Time B', sigla: 'TIB', escudos: {} }
                    },
                    campeonatos: {},
                    esportes: { '1': { esporte_id: 1, nome: 'Futebol', slug: 'futebol' } },
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-10-12',
                            hora_realizacao: '16:00:00',
                            fase_id: 1,
                            rodada: 1
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result[0].transmissoes).toBeUndefined();
        });

        it('should handle empty jogos array', () => {
            const apiResponse = {
                referencias: {
                    equipes: {},
                    campeonatos: {},
                    esportes: {},
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: []
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result).toHaveLength(0);
        });

        it('should handle missing team data gracefully', () => {
            const apiResponse = {
                referencias: {
                    equipes: {},
                    campeonatos: {},
                    esportes: {},
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 999,
                            equipe_visitante_id: 888,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-10-12',
                            hora_realizacao: '16:00:00',
                            fase_id: 1,
                            rodada: 1
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result[0].times[0].nome).toBe('Time Desconhecido');
            expect(result[0].times[0].escudo60x60).toBe('');
            expect(result[0].times[0].escudoSvg).toBe('');
        });

        it('should handle missing championship data', () => {
            const apiResponse = {
                referencias: {
                    equipes: {
                        '1': { nome_popular: 'Time A', sigla: 'TIA', escudos: {} },
                        '2': { nome_popular: 'Time B', sigla: 'TIB', escudos: {} }
                    },
                    campeonatos: {},
                    esportes: {},
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-10-12',
                            hora_realizacao: '16:00:00',
                            fase_id: 999,
                            rodada: 1
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result[0].competicao.nome).toBe('');
            expect(result[0].esporte.nome).toBe('Futebol');
        });

        it('should format datetime correctly', () => {
            const apiResponse = {
                referencias: {
                    equipes: {
                        '1': { nome_popular: 'Time A', sigla: 'TIA', escudos: {} },
                        '2': { nome_popular: 'Time B', sigla: 'TIB', escudos: {} }
                    },
                    campeonatos: {},
                    esportes: {},
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-12-25',
                            hora_realizacao: '15:30:45',
                            fase_id: 1,
                            rodada: 1
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(apiResponse);

            expect(result[0].dataHora).toBe('2025-12-25T15:30:45');
        });
    });

    describe('clearReferences', () => {
        it('should clear all references', () => {
            const apiResponse = {
                referencias: {
                    equipes: { '1': { nome: 'Time A' } },
                    campeonatos: { '1': { nome: 'Camp A' } },
                    esportes: { '1': { nome: 'Esporte A' } },
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: []
                }
            };

            eventParser.parseApiResponse(apiResponse);
            eventParser.clearReferences();

            // Parse again with empty references - should not use previous data
            const emptyResponse = {
                referencias: {
                    equipes: {},
                    campeonatos: {},
                    esportes: {},
                    edicoes: {},
                    fases: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2,
                            placar_oficial_mandante: null,
                            placar_oficial_visitante: null,
                            data_realizacao: '2025-10-12',
                            hora_realizacao: '16:00:00',
                            fase_id: 1,
                            rodada: 1
                        }
                    ]
                }
            };

            const result = eventParser.parseApiResponse(emptyResponse);
            expect(result[0].times[0].nome).toBe('Time Desconhecido');
        });
    });
});
