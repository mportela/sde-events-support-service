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
        sdeClient.clearCache();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    describe('get', () => {
        it('should fetch data from SDE API successfully', async () => {
            const mockData = {
                referencias: {},
                resultados: {}
            };

            process.env.SDE_API_TOKEN = 'test-token';
            process.env.SDE_API_URL = 'https://api.test.com';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            const result = await sdeClient.get('data/2025-10-11/eventos', '2025-10-11');

            expect(result).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.test.com/data/2025-10-11/eventos',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'token': 'test-token'
                    })
                })
            );
        });

        it('should use default API URL if not configured', async () => {
            const mockData = { test: 'data' };

            process.env.SDE_API_TOKEN = 'test-token';
            delete process.env.SDE_API_URL;

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            await sdeClient.get('data/2025-10-11/eventos');

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.sde.globoi.com/data/2025-10-11/eventos',
                expect.any(Object)
            );
        });

        it('should throw error if token is not configured', async () => {
            delete process.env.SDE_API_TOKEN;

            await expect(sdeClient.get('test/path')).rejects.toThrow(
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

            await expect(sdeClient.get('test/path')).rejects.toThrow(
                'Failed to fetch data from SDE API'
            );
        });

        it('should handle network errors', async () => {
            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
                new Error('Network error')
            );

            await expect(sdeClient.get('test/path')).rejects.toThrow('Network error');
        });

        it('should use path as cache key when no key provided', async () => {
            const mockData = { test: 'data' };

            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            const result1 = await sdeClient.get('test/path');
            expect(result1).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledTimes(1);

            const result2 = await sdeClient.get('test/path');
            expect(result2).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('Cache', () => {
        it('should return cached response on second call', async () => {
            const mockData = { test: 'data' };

            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            const result1 = await sdeClient.get('test/path', 'key1');
            expect(result1).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledTimes(1);

            const result2 = await sdeClient.get('test/path', 'key1');
            expect(result2).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        it('should cache different paths separately', async () => {
            const mockData1 = { data: 1 };
            const mockData2 = { data: 2 };

            process.env.SDE_API_TOKEN = 'test-token';

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

            const result1 = await sdeClient.get('path1', 'key1');
            const result2 = await sdeClient.get('path2', 'key2');

            expect(result1).toEqual(mockData1);
            expect(result2).toEqual(mockData2);
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should evict oldest entry when cache is full', async () => {
            const mockData = { test: 'data' };

            process.env.SDE_API_TOKEN = 'test-token';

            for (let i = 1; i <= 21; i++) {
                (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData
                } as Response);

                await sdeClient.get(`path${i}`, `key${i}`);
            }

            expect(global.fetch).toHaveBeenCalledTimes(21);

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockData
            } as Response);

            await sdeClient.get('path1', 'key1');
            expect(global.fetch).toHaveBeenCalledTimes(22);
        });

        it('should not cache when request fails', async () => {
            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>)
                .mockResolvedValueOnce({
                    ok: false,
                    status: 500,
                    statusText: 'Error'
                } as Response)
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => ({})
                } as Response);

            await expect(sdeClient.get('test/path', 'key1')).rejects.toThrow();
            const result = await sdeClient.get('test/path', 'key1');
            expect(result).toBeDefined();
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should clear cache when clearCache is called', async () => {
            const mockData = { test: 'data' };

            process.env.SDE_API_TOKEN = 'test-token';

            (global.fetch as jest.MockedFunction<typeof fetch>)
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData
                } as Response)
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData
                } as Response);

            await sdeClient.get('test/path', 'key1');
            expect(global.fetch).toHaveBeenCalledTimes(1);

            sdeClient.clearCache();

            await sdeClient.get('test/path', 'key1');
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should return correct cache statistics', async () => {
            const mockData = { test: 'data' };

            process.env.SDE_API_TOKEN = 'test-token';

            let stats = sdeClient.getCacheStats();
            expect(stats.size).toBe(0);
            expect(stats.capacity).toBe(20);
            expect(stats.usage).toBe('0.0%');

            for (let i = 1; i <= 5; i++) {
                (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: async () => mockData
                } as Response);

                await sdeClient.get(`path${i}`, `key${i}`);
            }

            stats = sdeClient.getCacheStats();
            expect(stats.size).toBe(5);
            expect(stats.capacity).toBe(20);
            expect(stats.usage).toBe('25.0%');
        });
    });
});
