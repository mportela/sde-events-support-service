import eventsRepository from '../../repositories/events/index.js';
import { Event } from '../../types/event.types.js';
import eventParser from '../../repositories/events/parsers/eventParser.js';

const eventsService = {
  async getEventsByDate(date: string): Promise<Event[]> {
    try {
      console.log(`[EventsService] Fetching events for date: ${date}`);

      // Busca a resposta completa da API (com referências e resultados)
      const apiResponse = await eventsRepository.getEventsByDate(date);

      // Valida se a resposta tem a estrutura esperada
      if (!apiResponse?.referencias || !apiResponse?.resultados) {
        console.warn('[EventsService] API response missing expected structure');
        return [];
      }

      // Parse da resposta completa usando o parser inteligente
      // O parser irá carregar as referências em memória e processar os jogos
      const parsedEvents = eventParser.parseApiResponse(apiResponse);

      console.log(`[EventsService] Found ${parsedEvents.length} events`);

      return parsedEvents;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[EventsService] Error fetching events:', errorMessage);
      throw error;
    }
  }
};

export default eventsService;
