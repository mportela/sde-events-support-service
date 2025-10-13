import jogosRepository from '../../repositories/jogos/index.js';
import type { Jogo } from '../../types/jogo.types.js';

/**
 * Service layer for Jogo business logic
 */
class JogosService {
    /**
     * Get jogo by ID
     * @param jogoId - Game ID
     * @returns Jogo object
     */
    async getJogo(jogoId: string): Promise<Jogo> {
        console.log(`[JogosService] Getting jogo: ${jogoId}`);

        if (!jogoId || jogoId.trim() === '') {
            throw new Error('Jogo ID is required');
        }

        try {
            const jogo = await jogosRepository.getJogo(jogoId);

            console.log(`[JogosService] Successfully retrieved jogo: ${jogoId}`);

            return jogo;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`[JogosService] Error getting jogo: ${errorMessage}`);
            throw new Error(`Failed to get jogo from service: ${errorMessage}`);
        }
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        jogosRepository.clearCache();
        console.log('[JogosService] Cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return jogosRepository.getCacheStats();
    }
}

export default new JogosService();
