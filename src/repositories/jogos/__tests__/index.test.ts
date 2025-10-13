import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import sdeClient from '../../../clients/sde/index.js';
import jogosRepository from '../index.js';

describe('Jogos Repository', () => {
    let mockGet: jest.SpiedFunction<typeof sdeClient.get>;

    beforeEach(() => {
        // Cria spy do método get
        mockGet = jest.spyOn(sdeClient, 'get');
        // Silencia console.error e console.log durante os testes
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Limpa e restaura os mocks
        jest.restoreAllMocks();
    });

    describe('getJogo', () => {
        it('should return parsed jogo from SDE client', async () => {
            const mockData = {
                referencias: {
                    atletas: {
                        '1': {
                            nome: 'Leonardo Matias Baiersdorf Linck',
                            nome_popular: 'Léo Linck',
                            slug: 'leolinck',
                            sexo: 'M',
                            fotos: {
                                '319x388': 'https://s.glbimg.com/es/sde/f/2024/09/27/e3a18e58f2c5_319x388.png'
                            },
                            fotos_contextuais: {}
                        }
                    },
                    equipes: {
                        '1': {
                            nome_popular: 'Botafogo',
                            sigla: 'BOT',
                            escudos: {
                                '60x60': 'https://...',
                                svg: 'https://...'
                            }
                        },
                        '2': {
                            nome_popular: 'Flamengo',
                            sigla: 'FLA',
                            escudos: {
                                '60x60': 'https://...',
                                svg: 'https://...'
                            }
                        }
                    },
                    campeonatos: {
                        '1': { nome: 'Campeonato Brasileiro' }
                    },
                    esportes: {
                        '1': { nome: 'Futebol', slug: 'futebol' }
                    },
                    escalacao: {
                        '1': {
                            titulares: [
                                {
                                    atleta_id: 1,
                                    numero: 1,
                                    posicao: { macro_posicao: 'Goleiro' },
                                    ordem: 1,
                                    substituido: null
                                }
                            ],
                            reservas: []
                        },
                        '2': {
                            titulares: [],
                            reservas: []
                        }
                    }
                },
                resultados: {
                    jogo_id: 334218,
                    equipe_mandante_id: 1,
                    equipe_visitante_id: 2,
                    placar_oficial_mandante: null,
                    placar_oficial_visitante: null,
                    placar_penaltis_mandante: null,
                    placar_penaltis_visitante: null,
                    escalacao_mandante_id: 1,
                    escalacao_visitante_id: 2,
                    primeiro_atleta_id: null,
                    segundo_atleta_id: null,
                    data_realizacao: '2025-10-12',
                    hora_realizacao: '20:00:00',
                    hora_fim: null,
                    fuso_horario: 'America/Sao_Paulo',
                    data_realizacao_timezone: '2025-10-12T20:00:00-03:00',
                    sede_id: 1,
                    fase_id: 1,
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
                    status: 'Não disponivel',
                    campeonato_id: 1,
                    esporte_id: 1
                }
            };

            mockGet.mockResolvedValueOnce(mockData);

            const result = await jogosRepository.getJogo('334218');

            expect(mockGet).toHaveBeenCalledWith('jogos/334218', 'jogo_334218');
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(result).toHaveProperty('id', '334218');
            expect(result).toHaveProperty('nome');
            expect(result).toHaveProperty('esporte');
            expect(result).toHaveProperty('competicao');
            expect(result).toHaveProperty('times');
            expect(result.times).toHaveLength(2);
        });

        it('should pass jogoId parameter correctly', async () => {
            const mockData = {
                referencias: {
                    atletas: {},
                    equipes: {
                        '1': { nome_popular: 'Time A', sigla: 'TIA', escudos: {} },
                        '2': { nome_popular: 'Time B', sigla: 'TIB', escudos: {} }
                    },
                    campeonatos: { '1': { nome: 'Campeonato' } },
                    esportes: { '1': { nome: 'Futebol', slug: 'futebol' } },
                    escalacao: {
                        '1': { titulares: [], reservas: [] },
                        '2': { titulares: [], reservas: [] }
                    }
                },
                resultados: {
                    jogo_id: 999999,
                    equipe_mandante_id: 1,
                    equipe_visitante_id: 2,
                    escalacao_mandante_id: 1,
                    escalacao_visitante_id: 2,
                    campeonato_id: 1,
                    esporte_id: 1,
                    placar_oficial_mandante: null,
                    placar_oficial_visitante: null,
                    data_realizacao: '2025-10-12',
                    hora_realizacao: '20:00:00',
                    status: 'Não disponivel'
                }
            };

            mockGet.mockResolvedValueOnce(mockData);

            await jogosRepository.getJogo('999999');

            expect(mockGet).toHaveBeenCalledWith('jogos/999999', 'jogo_999999');
        });

        it('should throw error when SDE client fails', async () => {
            const errorMessage = 'Network error';
            mockGet.mockRejectedValueOnce(new Error(errorMessage));

            await expect(
                jogosRepository.getJogo('334218')
            ).rejects.toThrow('Failed to fetch jogo from repository');
        });

        it('should wrap error with repository context', async () => {
            mockGet.mockRejectedValueOnce(new Error('API Error'));

            await expect(
                jogosRepository.getJogo('334218')
            ).rejects.toThrow('Failed to fetch jogo from repository: API Error');
        });

        it('should handle non-Error exceptions', async () => {
            mockGet.mockRejectedValueOnce('String error');

            await expect(
                jogosRepository.getJogo('334218')
            ).rejects.toThrow('Failed to fetch jogo from repository: Unknown error');
        });
    });

    describe('clearCache', () => {
        it('should call sdeClient clearCache', () => {
            const clearCacheSpy = jest.spyOn(sdeClient, 'clearCache');

            jogosRepository.clearCache();

            expect(clearCacheSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCacheStats', () => {
        it('should return cache statistics from sdeClient', () => {
            const mockStats = {
                size: 5,
                capacity: 20,
                usage: '25.0%'
            };

            jest.spyOn(sdeClient, 'getCacheStats').mockReturnValue(mockStats);

            const stats = jogosRepository.getCacheStats();

            expect(stats).toEqual(mockStats);
        });
    });
});
