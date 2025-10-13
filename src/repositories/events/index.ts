import sdeClient from '../../clients/sde/index.js';

const eventsRepository = {
  async getEventsByDate(date: string): Promise<any> {
    try {
      console.log(`[EventsRepository] Fetching events for date: ${date}`);

      // Busca a resposta completa da API SDE usando o cliente genérico
      // Path específico: data/{date}/eventos
      const apiResponse = await sdeClient.get(`data/${date}/eventos`, date);

      return apiResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[EventsRepository] Error fetching events:', errorMessage);
      throw new Error(`Failed to fetch events from repository: ${errorMessage}`);
    }
  }
};

export default eventsRepository;
