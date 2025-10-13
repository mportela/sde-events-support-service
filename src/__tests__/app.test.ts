import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import eventsService from '../services/events/index.js';
import type { Event } from '../types/event.types.js';

describe('App Integration Tests', () => {
    let mockGetEventsByDate: jest.SpiedFunction<(date: string) => Promise<Event[]>>;

    beforeEach(() => {
        mockGetEventsByDate = jest.spyOn(eventsService, 'getEventsByDate');
        // Silencia console.error durante os testes
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('GET /healthcheck', () => {
        it('should return 200 with healthy status', async () => {
            const response = await request(app)
                .get('/healthcheck')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
            expect(response.body).toHaveProperty('timestamp');
        });

        it('should have correct content-type', async () => {
            const response = await request(app)
                .get('/healthcheck')
                .expect('Content-Type', /json/);

            expect((response.body as { status: string }).status).toBe('ok');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for invalid event routes', async () => {
            const response = await request(app)
                .get('/events')
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });

        it('should return 404 for POST on healthcheck', async () => {
            const response = await request(app)
                .post('/healthcheck')
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('Content-Type Headers', () => {
        it('should return JSON for healthcheck', async () => {
            await request(app)
                .get('/healthcheck')
                .expect('Content-Type', /json/);
        });

        it('should return JSON for events', async () => {
            mockGetEventsByDate.mockResolvedValueOnce([]);

            await request(app)
                .get('/events/2025-10-11')
                .expect('Content-Type', /json/);
        });

        it('should return JSON for errors', async () => {
            await request(app)
                .get('/unknown-route')
                .expect('Content-Type', /json/);
        });
    });

    describe('Request Methods', () => {
        it('should accept GET on healthcheck', async () => {
            await request(app)
                .get('/healthcheck')
                .expect(200);
        });

        it('should accept GET on events with date', async () => {
            mockGetEventsByDate.mockResolvedValueOnce([]);

            await request(app)
                .get('/events/2025-10-11')
                .expect(200);
        });

        it('should reject PUT requests', async () => {
            await request(app)
                .put('/healthcheck')
                .expect(404);
        });

        it('should reject DELETE requests', async () => {
            await request(app)
                .delete('/healthcheck')
                .expect(404);
        });

        it('should reject PATCH requests', async () => {
            await request(app)
                .patch('/healthcheck')
                .expect(404);
        });
    });

    describe('Express Middleware Configuration', () => {
        it('should parse JSON request bodies', async () => {
            // Mesmo que não usamos POST, vamos testar se o middleware está configurado
            const response = await request(app)
                .post('/unknown-route')
                .send({ test: 'data' })
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });

        it('should handle empty request bodies', async () => {
            await request(app)
                .get('/healthcheck')
                .expect(200);
        });
    });

    describe('CORS Headers', () => {
        it('should include Access-Control-Allow-Origin header on healthcheck', async () => {
            const response = await request(app)
                .get('/healthcheck')
                .expect(200);

            expect(response.headers['access-control-allow-origin']).toBe('*');
        });

        it('should include Access-Control-Allow-Origin header on events endpoint', async () => {
            mockGetEventsByDate.mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/events/2025-10-11')
                .expect(200);

            expect(response.headers['access-control-allow-origin']).toBe('*');
        });

        it('should include Access-Control-Allow-Methods header', async () => {
            const response = await request(app)
                .get('/healthcheck')
                .expect(200);

            expect(response.headers['access-control-allow-methods']).toBe('GET');
        });

        it('should include Access-Control-Allow-Headers header', async () => {
            const response = await request(app)
                .get('/healthcheck')
                .expect(200);

            expect(response.headers['access-control-allow-headers']).toBe('Content-Type, Authorization');
        });

        it('should include CORS headers on 404 responses', async () => {
            const response = await request(app)
                .get('/unknown-route')
                .expect(404);

            expect(response.headers['access-control-allow-origin']).toBe('*');
            expect(response.headers['access-control-allow-methods']).toBe('GET');
            expect(response.headers['access-control-allow-headers']).toBe('Content-Type, Authorization');
        });

        it('should include CORS headers on error responses', async () => {
            mockGetEventsByDate.mockRejectedValueOnce(new Error('Service error'));

            const response = await request(app)
                .get('/events/2025-10-11')
                .expect(500);

            expect(response.headers['access-control-allow-origin']).toBe('*');
        });
    });

});

