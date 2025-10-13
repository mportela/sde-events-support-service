import LRUCache from '../../utils/cache/LRUCache.js';

// Cache LRU para armazenar respostas da API do SDE
// Capacidade: 20 entradas
const responseCache = new LRUCache<string, any>(20);

/**
 * Cliente genérico para comunicação com a API do SDE
 * Responsável apenas por fazer requisições HTTP e gerenciar cache
 */
const sdeClient = {
  /**
   * Limpa o cache de respostas
   */
  clearCache(): void {
    responseCache.clear();
  },

  /**
   * Retorna estatísticas do cache
   */
  getCacheStats() {
    return responseCache.getStats();
  },

  /**
   * Faz uma requisição GET genérica para a API do SDE
   * @param path - Caminho relativo da API (ex: 'data/2025-10-11/eventos' ou 'jogos/334218')
   * @param cacheKey - Chave única para cache (opcional)
   * @returns Dados da resposta da API
   */
  async get(path: string, cacheKey?: string): Promise<any> {
    // Usa o path como cache key se não for fornecida uma chave específica
    const key = cacheKey || path;

    // Verifica se a resposta está em cache
    const cachedResponse = responseCache.get(key);
    if (cachedResponse !== undefined) {
      console.log(`[SdeClient] Returning cached response for: ${key}`);
      return cachedResponse;
    }

    const baseUrl = process.env.SDE_API_URL || 'https://api.sde.globoi.com';
    const token = process.env.SDE_API_TOKEN;

    if (!token) {
      throw new Error('SDE_API_TOKEN is not configured');
    }

    const url = `${baseUrl}/${path}`;

    console.log(`[SdeClient] Calling SDE API: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`SDE API returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(`[SdeClient] Successfully fetched data from SDE API`);

      // Armazena a resposta no cache
      responseCache.set(key, data);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[SdeClient] Error calling SDE API:', errorMessage);
      throw new Error(`Failed to fetch data from SDE API: ${errorMessage}`);
    }
  }
};

export default sdeClient;
