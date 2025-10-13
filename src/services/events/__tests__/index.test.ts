import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import eventsRepository from '../../../repositories/events/index.js';
import eventsService from '../index.js';

describe('Events Service', () => {
    let mockGetEventsByDate: jest.SpiedFunction<typeof eventsRepository.getEventsByDate>;

    beforeEach(() => {
        jest.clearAllMocks();
        // Cria spy do método
        mockGetEventsByDate = jest.spyOn(eventsRepository, 'getEventsByDate');
        // Silencia console durante os testes
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getEventsByDate', () => {
        it('should return events from repository', async () => {
            const mockEvents = [
                {
                    id: '123',
                    nome: 'Flamengo x Fluminense',
                    esporte: {
                        id: '1',
                        slug: 'futebol',
                        nome: 'Futebol'
                    },
                    competicao: {
                        nome: 'Brasileirão'
                    },
                    times: [
                        {
                            nome: 'Flamengo',
                            sigla: 'FLA',
                            escudo60x60: 'https://example.com/fla.png',
                            escudoSvg: 'https://example.com/fla.svg'
                        },
                        {
                            nome: 'Fluminense',
                            sigla: 'FLU',
                            escudo60x60: 'https://example.com/flu.png',
                            escudoSvg: 'https://example.com/flu.svg'
                        }
                    ],
                    dataHora: '2025-10-11T21:30:00'
                }
            ];

            mockGetEventsByDate.mockResolvedValueOnce(mockEvents);

            const result = await eventsService.getEventsByDate('2025-10-11');

            expect(mockGetEventsByDate).toHaveBeenCalledWith('2025-10-11');
            expect(result).toEqual(mockEvents);
            expect(result).toHaveLength(1);
        });

        it('should pass correct date to repository', async () => {
            mockGetEventsByDate.mockResolvedValueOnce([]);

            await eventsService.getEventsByDate('2025-12-25');

            expect(mockGetEventsByDate).toHaveBeenCalledWith('2025-12-25');
        });

        it('should return empty array from repository', async () => {
            mockGetEventsByDate.mockResolvedValueOnce([]);

            const result = await eventsService.getEventsByDate('2025-10-11');

            expect(result).toEqual([]);
        });

        it('should throw error when repository fails', async () => {
            const errorMessage = 'Repository error';
            mockGetEventsByDate.mockRejectedValueOnce(new Error(errorMessage));

            await expect(
                eventsService.getEventsByDate('2025-10-11')
            ).rejects.toThrow(errorMessage);
        });

        it('should handle multiple events from repository', async () => {
            const mockEvents = [
                {
                    id: '1',
                    nome: 'Jogo 1',
                    esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
                    competicao: { nome: 'Camp 1' },
                    times: [],
                    dataHora: '2025-10-11T15:00:00'
                },
                {
                    id: '2',
                    nome: 'Jogo 2',
                    esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
                    competicao: { nome: 'Camp 2' },
                    times: [],
                    dataHora: '2025-10-11T17:00:00'
                },
                {
                    id: '3',
                    nome: 'Jogo 3',
                    esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
                    competicao: { nome: 'Camp 3' },
                    times: [],
                    dataHora: '2025-10-11T19:00:00'
                }
            ];

            mockGetEventsByDate.mockResolvedValueOnce(mockEvents);

            const result = await eventsService.getEventsByDate('2025-10-11');

            expect(result).toHaveLength(3);
            expect(result[0].id).toBe('1');
            expect(result[1].id).toBe('2');
            expect(result[2].id).toBe('3');
        });
    });
});
