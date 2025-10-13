import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import sdeClient from '../../../clients/sde/index.js';
import eventsRepository from '../index.js';

describe('Events Repository', () => {
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

    describe('getEventsByDate', () => {
        it('should return API response from SDE client', async () => {
            const mockData = {
                referencias: {
                    equipes: {
                        '123': { nome_popular: 'Time A', sigla: 'TIA' }
                    },
                    campeonatos: {},
                    esportes: {}
                },
                resultados: {
                    jogos: []
                }
            };

            mockGet.mockResolvedValueOnce(mockData);

            const result = await eventsRepository.getEventsByDate('2025-10-11');

            expect(mockGet).toHaveBeenCalledWith('data/2025-10-11/eventos', '2025-10-11');
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockData);
        });

        it('should pass date parameter correctly', async () => {
            const mockData = {
                referencias: {},
                resultados: { jogos: [] }
            };

            mockGet.mockResolvedValueOnce(mockData);

            await eventsRepository.getEventsByDate('2025-12-25');

            expect(mockGet).toHaveBeenCalledWith('data/2025-12-25/eventos', '2025-12-25');
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

        it('should return complete API response structure', async () => {
            const mockData = {
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

            mockGet.mockResolvedValueOnce(mockData);

            const result = await eventsRepository.getEventsByDate('2025-10-11');

            expect(result).toHaveProperty('referencias');
            expect(result).toHaveProperty('resultados');
            expect(result.referencias).toHaveProperty('equipes');
            expect(result.referencias).toHaveProperty('campeonatos');
            expect(result.resultados).toHaveProperty('jogos');
        });
    });
});
