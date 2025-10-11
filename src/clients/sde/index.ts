import LRUCache from '../../utils/cache/LRUCache.js';

// Cache LRU para armazenar respostas da API do SDE
// Capacidade: 20 entradas (datas diferentes)
const responseCache = new LRUCache<string, any>(20);

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

  async getEvents(date: string): Promise<any> {
    // Verifica se a resposta está em cache
    const cachedResponse = responseCache.get(date);
    if (cachedResponse !== undefined) {
      console.log(`[SdeClient] Returning cached response for date: ${date}`);
      return cachedResponse;
    }

    const baseUrl = process.env.SDE_API_URL || 'https://api.sde.globoi.com';
    const token = process.env.SDE_API_TOKEN;

    if (!token) {
      throw new Error('SDE_API_TOKEN is not configured');
    }

    const url = `${baseUrl}/data/${date}/eventos`;

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
      responseCache.set(date, data);

      // A API retorna um objeto com referencias e resultados
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[SdeClient] Error calling SDE API:', errorMessage);
      throw new Error(`Failed to fetch events from SDE API: ${errorMessage}`);
    }
  }
};

export default sdeClient;
