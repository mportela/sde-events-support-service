import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock do eventsService ANTES de importar o router
const mockGetEventsByDate = jest.fn<() => Promise<any[]>>();
jest.unstable_mockModule('../../../services/events/index.js', () => ({
    default: {
        getEventsByDate: mockGetEventsByDate
    }
}));

// Agora importa o router (que já terá o mock)
const { default: eventsRouter } = await import('../index.js');

// Cria app express de teste
const app = express();
app.use(express.json());
app.use('/events', eventsRouter);

describe('Events Routes', () => {
    beforeEach(() => {
        mockGetEventsByDate.mockClear();
        // Silencia console.log durante os testes
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restaura os mocks
        jest.restoreAllMocks();
    });

    describe('GET /events/:date', () => {
        it('should return events successfully for valid date', async () => {
            const mockEvents = [
                {
                    id: '123',
                    nome: 'Flamengo x Fluminense',
                    esporte: {
                        id: '1',
                        slug: 'futebol',
                        nome: 'Futebol'
                    },
                    competicao: {
                        nome: 'Brasileirão'
                    },
                    times: [
                        {
                            nome: 'Flamengo',
                            sigla: 'FLA',
                            escudo60x60: 'https://s.glbimg.com/es/sde/f/equipes/2018/04/09/flamengo_60x60.png',
                            escudoSvg: 'https://s.glbimg.com/es/sde/f/equipes/2018/04/09/flamengo.svg'
                        },
                        {
                            nome: 'Fluminense',
                            sigla: 'FLU',
                            escudo60x60: 'https://s.glbimg.com/es/sde/f/equipes/2018/04/09/fluminense_60x60.png',
                            escudoSvg: 'https://s.glbimg.com/es/sde/f/equipes/2018/04/09/fluminense.svg'
                        }
                    ],
                    dataHora: '2025-10-11T21:30:00',
                    transmissoes: [
                        {
                            nome: 'Premiere',
                            slug: 'premiere'
                        }
                    ]
                }
            ];

            mockGetEventsByDate.mockResolvedValueOnce(mockEvents);

            const response = await request(app)
                .get('/events/2025-10-11')
                .expect(200);

            expect(response.body).toEqual({ events: mockEvents });
            expect(mockGetEventsByDate).toHaveBeenCalledWith('2025-10-11');
        });

        it('should return empty array when no events found', async () => {
            mockGetEventsByDate.mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/events/2025-12-25')
                .expect(200);

            expect(response.body).toEqual({ events: [] });
            expect(mockGetEventsByDate).toHaveBeenCalledWith('2025-12-25');
        });

        it('should reject invalid date format - text instead of numbers', async () => {
            const response = await request(app)
                .get('/events/today')
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(mockGetEventsByDate).not.toHaveBeenCalled();
        });
    });
});
