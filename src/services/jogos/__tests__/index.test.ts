import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import jogosRepository from '../../../repositories/jogos/index.js';
import jogosService from '../index.js';

describe('Jogos Service', () => {
    let mockGetJogo: jest.SpiedFunction<typeof jogosRepository.getJogo>;

    beforeEach(() => {
        // Cria spy do método getJogo
        mockGetJogo = jest.spyOn(jogosRepository, 'getJogo');
        // Silencia console.error e console.log durante os testes
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Limpa e restaura os mocks
        jest.restoreAllMocks();
    });

    describe('getJogo', () => {
        it('should return jogo successfully', async () => {
            const mockJogo = {
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
                        escudo60x60: 'https://...',
                        escudoSvg: 'https://...',
                        jogadores: []
                    },
                    {
                        nome: 'Flamengo',
                        sigla: 'FLA',
                        escudo60x60: 'https://...',
                        escudoSvg: 'https://...',
                        jogadores: []
                    }
                ]
            };

            mockGetJogo.mockResolvedValueOnce(mockJogo);

            const result = await jogosService.getJogo('334218');

            expect(mockGetJogo).toHaveBeenCalledWith('334218');
            expect(mockGetJogo).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockJogo);
        });

        it('should pass jogoId parameter correctly', async () => {
            const mockJogo = {
                id: '999999',
                nome: 'Time A x Time B',
                esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
                competicao: { nome: 'Campeonato' },
                times: []
            };

            mockGetJogo.mockResolvedValueOnce(mockJogo);

            await jogosService.getJogo('999999');

            expect(mockGetJogo).toHaveBeenCalledWith('999999');
        });

        it('should throw error if jogoId is empty', async () => {
            await expect(
                jogosService.getJogo('')
            ).rejects.toThrow('Jogo ID is required');

            expect(mockGetJogo).not.toHaveBeenCalled();
        });

        it('should throw error if jogoId is whitespace', async () => {
            await expect(
                jogosService.getJogo('   ')
            ).rejects.toThrow('Jogo ID is required');

            expect(mockGetJogo).not.toHaveBeenCalled();
        });

        it('should throw error when repository fails', async () => {
            const errorMessage = 'Repository error';
            mockGetJogo.mockRejectedValueOnce(new Error(errorMessage));

            await expect(
                jogosService.getJogo('334218')
            ).rejects.toThrow('Failed to get jogo from service');
        });

        it('should wrap error with service context', async () => {
            mockGetJogo.mockRejectedValueOnce(new Error('Repo Error'));

            await expect(
                jogosService.getJogo('334218')
            ).rejects.toThrow('Failed to get jogo from service: Repo Error');
        });

        it('should handle non-Error exceptions', async () => {
            mockGetJogo.mockRejectedValueOnce('String error');

            await expect(
                jogosService.getJogo('334218')
            ).rejects.toThrow('Failed to get jogo from service: Unknown error');
        });
    });

    describe('clearCache', () => {
        it('should call repository clearCache', () => {
            const clearCacheSpy = jest.spyOn(jogosRepository, 'clearCache');

            jogosService.clearCache();

            expect(clearCacheSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCacheStats', () => {
        it('should return cache statistics from repository', () => {
            const mockStats = {
                size: 3,
                capacity: 20,
                usage: '15.0%'
            };

            jest.spyOn(jogosRepository, 'getCacheStats').mockReturnValue(mockStats);

            const stats = jogosService.getCacheStats();

            expect(stats).toEqual(mockStats);
        });
    });
});
