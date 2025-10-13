import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import sdeClient from '../../../clients/sde/index.js';
import eventParser from '../parsers/eventParser.js';
import eventsRepository from '../index.js';

describe('Events Repository', () => {
    let mockGet: jest.SpiedFunction<typeof sdeClient.get>;
    let mockParseApiResponse: jest.SpiedFunction<typeof eventParser.parseApiResponse>;

    beforeEach(() => {
        // Cria spy do método get
        mockGet = jest.spyOn(sdeClient, 'get');
        mockParseApiResponse = jest.spyOn(eventParser, 'parseApiResponse');
        // Silencia console.error, console.log e console.warn durante os testes
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        // Limpa e restaura os mocks
        jest.restoreAllMocks();
    });

    describe('getEventsByDate', () => {
        it('should return parsed events from API response', async () => {
            const mockApiData = {
                referencias: {
                    equipes: {
                        '1': { nome_popular: 'Flamengo', sigla: 'FLA', escudos: {} }
                    },
                    campeonatos: {},
                    esportes: {}
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 123,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2
                        }
                    ]
                }
            };

            const mockParsedEvents = [
                {
                    id: '123',
                    nome: 'Flamengo x Fluminense',
                    esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
                    competicao: { nome: 'Brasileirão' },
                    times: [],
                    dataHora: '2025-10-11T21:30:00'
                }
            ];

            mockGet.mockResolvedValueOnce(mockApiData);
            mockParseApiResponse.mockReturnValueOnce(mockParsedEvents);

            const result = await eventsRepository.getEventsByDate('2025-10-11');

            expect(mockGet).toHaveBeenCalledWith('data/2025-10-11/eventos', '2025-10-11');
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockParseApiResponse).toHaveBeenCalledWith(mockApiData);
            expect(result).toEqual(mockParsedEvents);
            expect(result).toHaveLength(1);
        });

        it('should pass date parameter correctly', async () => {
            const mockApiData = {
                referencias: { equipes: {}, campeonatos: {}, esportes: {} },
                resultados: { jogos: [] }
            };

            mockGet.mockResolvedValueOnce(mockApiData);
            mockParseApiResponse.mockReturnValueOnce([]);

            await eventsRepository.getEventsByDate('2025-12-25');

            expect(mockGet).toHaveBeenCalledWith('data/2025-12-25/eventos', '2025-12-25');
            expect(mockParseApiResponse).toHaveBeenCalledWith(mockApiData);
        });

        it('should return empty array if API response is missing referencias', async () => {
            const mockApiData = {
                resultados: { jogos: [] }
            };

            mockGet.mockResolvedValueOnce(mockApiData);

            const result = await eventsRepository.getEventsByDate('2025-10-11');

            expect(result).toEqual([]);
            expect(mockParseApiResponse).not.toHaveBeenCalled();
        });

        it('should return empty array if API response is missing resultados', async () => {
            const mockApiData = {
                referencias: { equipes: {}, campeonatos: {}, esportes: {} }
            };

            mockGet.mockResolvedValueOnce(mockApiData);

            const result = await eventsRepository.getEventsByDate('2025-10-11');

            expect(result).toEqual([]);
            expect(mockParseApiResponse).not.toHaveBeenCalled();
        });

        it('should throw error when SDE client fails', async () => {
            const errorMessage = 'Network error';
            mockGet.mockRejectedValueOnce(new Error(errorMessage));

            await expect(
                eventsRepository.getEventsByDate('2025-10-11')
            ).rejects.toThrow('Failed to fetch events from repository');
        });

        it('should wrap error with repository context', async () => {
            mockGet.mockRejectedValueOnce(new Error('API Error'));

            await expect(
                eventsRepository.getEventsByDate('2025-10-11')
            ).rejects.toThrow('Failed to fetch events from repository: API Error');
        });

        it('should handle non-Error exceptions', async () => {
            mockGet.mockRejectedValueOnce('String error');

            await expect(
                eventsRepository.getEventsByDate('2025-10-11')
            ).rejects.toThrow('Failed to fetch events from repository: Unknown error');
        });

        it('should parse events with complete data structure', async () => {
            const mockApiData = {
                referencias: {
                    equipes: { '1': { nome: 'Time A' }, '2': { nome: 'Time B' } },
                    campeonatos: { '10': { nome: 'Campeonato X' } },
                    esportes: { '1': { nome: 'Futebol' } },
                    edicoes: { '100': { nome: 'Edição 2025' } },
                    fases: { '1000': { nome: 'Fase de Grupos' } }
                },
                resultados: {
                    jogos: [
                        {
                            jogo_id: 12345,
                            equipe_mandante_id: 1,
                            equipe_visitante_id: 2
                        }
                    ]
                }
            };

            const mockParsedEvents = [
                {
                    id: '12345',
                    nome: 'Time A x Time B',
                    esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
                    competicao: { nome: 'Campeonato X' },
                    times: [],
                    dataHora: '2025-10-11T21:30:00'
                }
            ];

            mockGet.mockResolvedValueOnce(mockApiData);
            mockParseApiResponse.mockReturnValueOnce(mockParsedEvents);

            const result = await eventsRepository.getEventsByDate('2025-10-11');

            expect(mockParseApiResponse).toHaveBeenCalledWith(mockApiData);
            expect(result).toEqual(mockParsedEvents);
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('nome');
            expect(result[0]).toHaveProperty('esporte');
            expect(result[0]).toHaveProperty('competicao');
        });
    });
});
