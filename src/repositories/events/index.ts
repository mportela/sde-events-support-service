import sdeClient from '../../clients/sde/index.js';
import type { Event } from '../../types/event.types.js';
import eventParser from './parsers/eventParser.js';

const eventsRepository = {
  async getEventsByDate(date: string): Promise<Event[]> {
    try {
      console.log(`[EventsRepository] Fetching events for date: ${date}`);

      // Busca a resposta completa da API SDE usando o cliente genérico
      // Path específico: data/{date}/eventos
      const apiResponse = await sdeClient.get(`data/${date}/eventos`, date);

      // Valida se a resposta tem a estrutura esperada
      if (!apiResponse?.referencias || !apiResponse?.resultados) {
        console.warn('[EventsRepository] API response missing expected structure');
        return [];
      }

      // Parse da resposta completa usando o parser
      const parsedEvents = eventParser.parseApiResponse(apiResponse);

      console.log(`[EventsRepository] Successfully fetched and parsed ${parsedEvents.length} events`);

      return parsedEvents;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[EventsRepository] Error fetching events:', errorMessage);
      throw new Error(`Failed to fetch events from repository: ${errorMessage}`);
    }
  }
};

export default eventsRepository;
