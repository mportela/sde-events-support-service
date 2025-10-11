import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import sdeClient from '../index.js';

// Mock global fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('SDE Client', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
        (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
        // Limpa o cache antes de cada teste
        sdeClient.clearCache();
        // Silencia console.error e console.log durante os testes
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        process.env = originalEnv;
        // Restaura os mocks
        jest.restoreAllMocks();
    });

    describe('getEvents', () => {
        it('should fetch events from SDE API successfully', async () => {
            const mockData = {
                referencias: {
                    equipes: {},
                    campeonatos: {},
                    esportes: {}
                },
                resultados: {
                    jogos: []
                }
            };

            process.env.SDE_API_TOKEN = 'test-token';
            process.env.SDE_API_URL = 'https://api.test.com';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            const result = await sdeClient.getEvents('2025-10-11');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/data/2025-10-11/eventos',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'token': 'test-token',
                        'Content-Type': 'application/json'
                    })
                })
            );

            expect(result).toEqual(mockData);
        });

        it('should use default API URL if not configured', async () => {
            const mockData = {
                referencias: {},
                resultados: { jogos: [] }
            };

            process.env.SDE_API_TOKEN = 'test-token';
            delete process.env.SDE_API_URL;

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            await sdeClient.getEvents('2025-10-11');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.sde.globoi.com/data/2025-10-11/eventos',
                expect.any(Object)
            );
        });

        it('should throw error if token is not configured', async () => {
            delete process.env.SDE_API_TOKEN;

            await expect(sdeClient.getEvents('2025-10-11')).rejects.toThrow(
                'SDE_API_TOKEN is not configured'
            );

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should throw error if API returns non-ok status', async () => {
            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            } as Response);

            await expect(sdeClient.getEvents('2025-10-11')).rejects.toThrow(
                'Failed to fetch events from SDE API'
            );
        });

        it('should handle network errors', async () => {
            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
                new Error('Network error')
            );

            await expect(sdeClient.getEvents('2025-10-11')).rejects.toThrow(
                'Failed to fetch events from SDE API: Network error'
            );
        });

        it('should handle JSON parse errors', async () => {
            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => {
                    throw new Error('Invalid JSON');
                }
            } as unknown as Response);

            await expect(sdeClient.getEvents('2025-10-11')).rejects.toThrow(
                'Failed to fetch events from SDE API'
            );
        });

        it('should format date correctly in URL', async () => {
            const mockData = { referencias: {}, resultados: { jogos: [] } };
            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            await sdeClient.getEvents('2025-12-31');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/data/2025-12-31/eventos'),
                expect.any(Object)
            );
        });
    });

    describe('Cache LRU', () => {
        beforeEach(() => {
            process.env.SDE_API_TOKEN = 'test-token';
        });

        it('should return cached response on second call', async () => {
            const mockData = {
                referencias: { equipes: {}, campeonatos: {}, esportes: {} },
                resultados: { jogos: [] }
            };

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            // Primeira chamada - deve fazer request
            const result1 = await sdeClient.getEvents('2025-10-11');
            expect(result1).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Segunda chamada - deve retornar do cache
            const result2 = await sdeClient.getEvents('2025-10-11');
            expect(result2).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledTimes(1); // Não fez nova chamada
        });

        it('should cache different dates separately', async () => {
            const mockData1 = { referencias: {}, resultados: { jogos: [{ id: 1 }] } };
            const mockData2 = { referencias: {}, resultados: { jogos: [{ id: 2 }] } };

            (global.fetch as jest.MockedFunction<typeof fetch>)
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData1
                } as Response)
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData2
                } as Response);

            const result1 = await sdeClient.getEvents('2025-10-11');
            const result2 = await sdeClient.getEvents('2025-10-12');

            expect(result1).toEqual(mockData1);
            expect(result2).toEqual(mockData2);
            expect(global.fetch).toHaveBeenCalledTimes(2);

            // Verifica se cada data está cacheada corretamente
            const cached1 = await sdeClient.getEvents('2025-10-11');
            const cached2 = await sdeClient.getEvents('2025-10-12');

            expect(cached1).toEqual(mockData1);
            expect(cached2).toEqual(mockData2);
            expect(global.fetch).toHaveBeenCalledTimes(2); // Nenhuma nova chamada
        });

        it('should evict oldest entry when cache is full (20 entries)', async () => {
            const mockData = { referencias: {}, resultados: { jogos: [] } };

            // Preenche o cache com 20 datas (limite)
            for (let i = 1; i <= 20; i++) {
                (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({ ...mockData, date: `2025-10-${String(i).padStart(2, '0')}` })
                } as Response);

                await sdeClient.getEvents(`2025-10-${String(i).padStart(2, '0')}`);
            }

            expect(global.fetch).toHaveBeenCalledTimes(20);

            // Adiciona 21ª entrada - deve remover a primeira (2025-10-01)
            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ ...mockData, date: '2025-10-21' })
            } as Response);

            await sdeClient.getEvents('2025-10-21');
            expect(global.fetch).toHaveBeenCalledTimes(21);

            // Tenta acessar a primeira data - deve fazer novo request (foi removida do cache)
            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ ...mockData, date: '2025-10-01' })
            } as Response);

            await sdeClient.getEvents('2025-10-01');
            expect(global.fetch).toHaveBeenCalledTimes(22); // Nova chamada porque foi evicted

            // Mas a terceira data ainda está no cache (2025-10-03)
            await sdeClient.getEvents('2025-10-03');
            expect(global.fetch).toHaveBeenCalledTimes(22); // Sem nova chamada
        });

        it('should not cache when request fails', async () => {
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
                new Error('Network error')
            );

            await expect(sdeClient.getEvents('2025-10-11')).rejects.toThrow();
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Segunda tentativa deve fazer novo request (não foi cacheado)
            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ referencias: {}, resultados: { jogos: [] } })
            } as Response);

            await sdeClient.getEvents('2025-10-11');
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should clear cache when clearCache is called', async () => {
            const mockData = { referencias: {}, resultados: { jogos: [] } };

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            // Primeira chamada
            await sdeClient.getEvents('2025-10-11');
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Segunda chamada - deve vir do cache
            await sdeClient.getEvents('2025-10-11');
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Limpa o cache
            sdeClient.clearCache();

            // Terceira chamada - deve fazer novo request
            await sdeClient.getEvents('2025-10-11');
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should return correct cache statistics', async () => {
            const mockData = { referencias: {}, resultados: { jogos: [] } };

            // Cache vazio
            let stats = sdeClient.getCacheStats();
            expect(stats.size).toBe(0);
            expect(stats.capacity).toBe(20);
            expect(stats.usage).toBe('0.0%');

            // Adiciona 5 entradas
            for (let i = 1; i <= 5; i++) {
                (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData
                } as Response);

                await sdeClient.getEvents(`2025-10-${String(i).padStart(2, '0')}`);
            }

            stats = sdeClient.getCacheStats();
            expect(stats.size).toBe(5);
            expect(stats.capacity).toBe(20);
            expect(stats.usage).toBe('25.0%');
        });
    });
});
