import eventsRepository from '../../repositories/events/index.js';
import { Event } from '../../types/event.types.js';

const eventsService = {
  async getEventsByDate(date: string): Promise<Event[]> {
    try {
      console.log(`[EventsService] Fetching events for date: ${date}`);

      // Repository já retorna os eventos parseados
      const events = await eventsRepository.getEventsByDate(date);

      console.log(`[EventsService] Found ${events.length} events`);

      return events;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[EventsService] Error fetching events:', errorMessage);
      throw error;
    }
  }
};

export default eventsService;
