/**
 * LRU (Least Recently Used) Cache Implementation
 * 
 * Esta implementação usa um Map para armazenar os dados e mantém uma lista
 * de chaves ordenadas por uso recente. Quando a capacidade máxima é atingida,
 * a entrada menos recentemente usada é removida.
 */
export class LRUCache<K, V> {
    private readonly maxSize: number;
    private readonly cache: Map<K, V>;

    constructor(maxSize: number = 20) {
        if (maxSize <= 0) {
            throw new Error('LRUCache maxSize must be greater than 0');
        }
        this.maxSize = maxSize;
        this.cache = new Map<K, V>();
    }

    /**
     * Obtém um valor do cache
     * Move a chave para o final (mais recente) se encontrada
     */
    get(key: K): V | undefined {
        const value = this.cache.get(key);

        if (value !== undefined) {
            // Remove e re-adiciona para mover para o final (mais recente)
            this.cache.delete(key);
            this.cache.set(key, value);
            console.log(`[LRUCache] Cache HIT for key: ${String(key)}`);
        } else {
            console.log(`[LRUCache] Cache MISS for key: ${String(key)}`);
        }

        return value;
    }

    /**
     * Adiciona ou atualiza um valor no cache
     * Remove a entrada mais antiga se necessário
     */
    set(key: K, value: V): void {
        // Se a chave já existe, remove para re-adicionar no final
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // Se o cache está cheio, remove a primeira entrada (mais antiga)
        else if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value as K;
            if (oldestKey !== undefined) {
                this.cache.delete(oldestKey);
                console.log(`[LRUCache] Evicted oldest entry: ${String(oldestKey)}`);
            }
        }

        this.cache.set(key, value);
        console.log(`[LRUCache] Set key: ${String(key)} (size: ${this.cache.size}/${this.maxSize})`);
    }

    /**
     * Verifica se uma chave existe no cache
     */
    has(key: K): boolean {
        return this.cache.has(key);
    }

    /**
     * Remove uma entrada específica do cache
     */
    delete(key: K): boolean {
        const deleted = this.cache.delete(key);
        if (deleted) {
            console.log(`[LRUCache] Deleted key: ${String(key)}`);
        }
        return deleted;
    }

    /**
     * Limpa o cache (remove todas as entradas)
     */
    clear(): void {
        this.cache.clear();
        console.log('[LRUCache] Cache cleared');
    }

    /**
     * Retorna o tamanho atual do cache
     */
    get size(): number {
        return this.cache.size;
    }

    /**
     * Retorna a capacidade máxima do cache
     */
    get capacity(): number {
        return this.maxSize;
    }

    /**
     * Retorna todas as chaves do cache (da mais antiga para a mais recente)
     */
    keys(): K[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Retorna estatísticas do cache
     */
    getStats(): { size: number; capacity: number; usage: string } {
        return {
            size: this.cache.size,
            capacity: this.maxSize,
            usage: `${((this.cache.size / this.maxSize) * 100).toFixed(1)}%`
        };
    }
}

export default LRUCache;
