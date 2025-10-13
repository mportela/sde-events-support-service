import sdeClient from '../../clients/sde/index.js';
import type { Jogo, SDEJogoResponse } from '../../types/jogo.types.js';
import { parseSDEJogo } from './parsers/jogoParser.js';

/**
 * Repository for Jogo data access
 */
class JogosRepository {
    /**
     * Get jogo by ID
     * @param jogoId - Game ID
     * @returns Parsed jogo object
     */
    async getJogo(jogoId: string): Promise<Jogo> {
        console.log(`[JogosRepository] Fetching jogo: ${jogoId}`);

        try {
            // Fetch from SDE API usando o cliente genérico
            // Path específico: jogos/{jogoId}
            const cacheKey = `jogo_${jogoId}`;
            const sdeResponse: SDEJogoResponse = await sdeClient.get(`jogos/${jogoId}`, cacheKey);

            // Parse response
            const jogo = parseSDEJogo(sdeResponse);

            console.log(`[JogosRepository] Successfully fetched and parsed jogo: ${jogoId}`);

            return jogo;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`[JogosRepository] Error fetching jogo: ${errorMessage}`);
            throw new Error(`Failed to fetch jogo from repository: ${errorMessage}`);
        }
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        sdeClient.clearCache();
        console.log('[JogosRepository] Cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return sdeClient.getCacheStats();
    }
}

export default new JogosRepository();
