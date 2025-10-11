import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import LRUCache from '../LRUCache.js';

describe('LRUCache', () => {
    let cache: LRUCache<string, any>;

    beforeEach(() => {
        cache = new LRUCache<string, any>(3); // Capacidade pequena para testes
        // Silencia console.log durante os testes
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restaura os mocks
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create cache with default capacity of 20', () => {
            const defaultCache = new LRUCache<string, string>();
            expect(defaultCache.capacity).toBe(20);
            expect(defaultCache.size).toBe(0);
        });

        it('should create cache with custom capacity', () => {
            const customCache = new LRUCache<string, string>(5);
            expect(customCache.capacity).toBe(5);
            expect(customCache.size).toBe(0);
        });

        it('should throw error if capacity is zero', () => {
            expect(() => new LRUCache<string, string>(0)).toThrow('LRUCache maxSize must be greater than 0');
        });

        it('should throw error if capacity is negative', () => {
            expect(() => new LRUCache<string, string>(-5)).toThrow('LRUCache maxSize must be greater than 0');
        });
    });

    describe('set and get', () => {
        it('should store and retrieve a value', () => {
            cache.set('key1', 'value1');
            expect(cache.get('key1')).toBe('value1');
        });

        it('should return undefined for non-existent key', () => {
            expect(cache.get('nonexistent')).toBeUndefined();
        });

        it('should update existing key', () => {
            cache.set('key1', 'value2');
            expect(cache.get('key1')).toBe('value2');
            expect(cache.size).toBe(1);
        });

        it('should store objects and arrays', () => {
            const obj = { name: 'test', value: 123 };
            const arr = [1, 2, 3];

            cache.set('obj', obj);
            cache.set('arr', arr);

            expect(cache.get('obj')).toEqual(obj);
            expect(cache.get('arr')).toEqual(arr);
        });
    });

    describe('LRU eviction', () => {
        it('should evict least recently used item when full', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            // Cache está cheio (3/3)
            expect(cache.size).toBe(3);

            // Adiciona nova entrada, deve remover key1 (mais antiga)
            cache.set('key4', 'value4');

            expect(cache.size).toBe(3);
            expect(cache.get('key1')).toBeUndefined(); // key1 foi removida
            expect(cache.get('key2')).toBe('value2');
            expect(cache.get('key3')).toBe('value3');
            expect(cache.get('key4')).toBe('value4');
        });

        it('should update access order when getting an item', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            // Acessa key1, movendo-a para o final (mais recente)
            cache.get('key1');

            // Adiciona nova entrada, deve remover key2 (agora é a mais antiga)
            cache.set('key4', 'value4');

            expect(cache.get('key1')).toBe('value1'); // key1 ainda está no cache
            expect(cache.get('key2')).toBeUndefined(); // key2 foi removida
            expect(cache.get('key3')).toBe('value3');
            expect(cache.get('key4')).toBe('value4');
        });

        it('should handle multiple evictions correctly', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            cache.set('key4', 'value4'); // Evicts key1
            cache.set('key5', 'value5'); // Evicts key2
            cache.set('key6', 'value6'); // Evicts key3

            expect(cache.size).toBe(3);
            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBeUndefined();
            expect(cache.get('key3')).toBeUndefined();
            expect(cache.get('key4')).toBe('value4');
            expect(cache.get('key5')).toBe('value5');
            expect(cache.get('key6')).toBe('value6');
        });
    });

    describe('has', () => {
        it('should return true for existing key', () => {
            cache.set('key1', 'value1');
            expect(cache.has('key1')).toBe(true);
        });

        it('should return false for non-existent key', () => {
            expect(cache.has('nonexistent')).toBe(false);
        });

        it('should not affect LRU order', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            // has() não deve afetar a ordem LRU
            cache.has('key1');

            // Adiciona nova entrada, deve remover key1 (ainda é a mais antiga)
            cache.set('key4', 'value4');

            expect(cache.get('key1')).toBeUndefined();
        });
    });

    describe('delete', () => {
        it('should delete existing key', () => {
            cache.set('key1', 'value1');
            expect(cache.delete('key1')).toBe(true);
            expect(cache.get('key1')).toBeUndefined();
            expect(cache.size).toBe(0);
        });

        it('should return false when deleting non-existent key', () => {
            expect(cache.delete('nonexistent')).toBe(false);
        });

        it('should allow adding after deletion', () => {
            cache.set('key1', 'value1');
            cache.delete('key1');
            cache.set('key1', 'value2');
            expect(cache.get('key1')).toBe('value2');
        });
    });

    describe('clear', () => {
        it('should remove all entries', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            cache.clear();

            expect(cache.size).toBe(0);
            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBeUndefined();
            expect(cache.get('key3')).toBeUndefined();
        });

        it('should allow adding after clear', () => {
            cache.set('key1', 'value1');
            cache.clear();
            cache.set('key2', 'value2');
            expect(cache.get('key2')).toBe('value2');
            expect(cache.size).toBe(1);
        });
    });

    describe('size and capacity', () => {
        it('should track size correctly', () => {
            expect(cache.size).toBe(0);

            cache.set('key1', 'value1');
            expect(cache.size).toBe(1);

            cache.set('key2', 'value2');
            expect(cache.size).toBe(2);

            cache.delete('key1');
            expect(cache.size).toBe(1);
        });

        it('should maintain capacity', () => {
            expect(cache.capacity).toBe(3);

            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            expect(cache.capacity).toBe(3);
        });
    });

    describe('keys', () => {
        it('should return empty array for empty cache', () => {
            expect(cache.keys()).toEqual([]);
        });

        it('should return all keys in LRU order (oldest to newest)', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            expect(cache.keys()).toEqual(['key1', 'key2', 'key3']);
        });

        it('should reflect order after access', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            cache.get('key1'); // Move key1 to the end

            expect(cache.keys()).toEqual(['key2', 'key3', 'key1']);
        });
    });

    describe('getStats', () => {
        it('should return correct statistics', () => {
            const stats = cache.getStats();
            expect(stats).toEqual({
                size: 0,
                capacity: 3,
                usage: '0.0%'
            });
        });

        it('should calculate usage percentage correctly', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            const stats = cache.getStats();
            expect(stats.size).toBe(2);
            expect(stats.capacity).toBe(3);
            expect(stats.usage).toBe('66.7%');
        });

        it('should show 100% usage when full', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            const stats = cache.getStats();
            expect(stats.usage).toBe('100.0%');
        });
    });

    describe('edge cases', () => {
        it('should handle cache of size 1', () => {
            const smallCache = new LRUCache<string, string>(1);

            smallCache.set('key1', 'value1');
            expect(smallCache.get('key1')).toBe('value1');

            smallCache.set('key2', 'value2');
            expect(smallCache.get('key1')).toBeUndefined();
            expect(smallCache.get('key2')).toBe('value2');
            expect(smallCache.size).toBe(1);
        });

        it('should handle null and undefined values', () => {
            cache.set('null', null);
            cache.set('undefined', undefined);

            expect(cache.get('null')).toBe(null);
            expect(cache.get('undefined')).toBe(undefined);
            expect(cache.has('null')).toBe(true);
            expect(cache.has('undefined')).toBe(true);
        });

        it('should handle numeric keys', () => {
            const numCache = new LRUCache<number, string>();

            numCache.set(1, 'one');
            numCache.set(2, 'two');

            expect(numCache.get(1)).toBe('one');
            expect(numCache.get(2)).toBe('two');
        });
    });
});
