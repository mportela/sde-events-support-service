import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../app.js';
import jogosService from '../../../services/jogos/index.js';

describe('GET /jogos/:id', () => {
    let getJogoSpy: any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (getJogoSpy) {
            getJogoSpy.mockRestore();
        }
    });

    it('should return jogo data for valid ID', async () => {
        const mockJogo = {
            id: '334218',
            nome: 'Botafogo x Flamengo',
            esporte: {
                id: '1',
                slug: 'futebol',
                nome: 'Futebol'
            },
            competicao: {
                nome: 'Campeonato Brasileiro'
            },
            times: [
                {
                    nome: 'Botafogo',
                    sigla: 'BOT',
                    escudo60x60: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-65.png',
                    escudoSvg: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg',
                    jogadores: [
                        {
                            nome: 'Leonardo Matias Baiersdorf Linck',
                            nome_popular: 'Léo Linck',
                            slug: 'leolinck',
                            sexo: 'M',
                            foto_319x388: 'https://s.sde.globo.com/media/person_role/2025/04/04/photo_300x300_FKStERZ.png',
                            fotos_contextuais: []
                        }
                    ]
                },
                {
                    nome: 'Flamengo',
                    sigla: 'FLA',
                    escudo60x60: 'https://s.sde.globo.com/media/organizations/2018/04/09/Flamengo-65.png',
                    escudoSvg: 'https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg',
                    jogadores: [
                        {
                            nome: 'Giorgian Daniel de Arrascaeta Benedetti',
                            nome_popular: 'Arrascaeta',
                            slug: 'arrascaeta',
                            sexo: 'M',
                            foto_319x388: 'https://s.sde.globo.com/media/person_role/2022/04/25/cc92618f5866aefc097fc6f6ad12eef6_original.png',
                            fotos_contextuais: [
                                'https://s.sde.globo.com/media/person_contract/2025/09/20/photo_spotlight.png'
                            ]
                        }
                    ]
                }
            ]
        };

        getJogoSpy = jest.spyOn(jogosService, 'getJogo').mockResolvedValue(mockJogo);

        const response = await request(app)
            .get('/jogos/334218')
            .expect(200);

        expect(response.body).toEqual(mockJogo);
        expect(response.body.id).toBe('334218');
        expect(response.body.nome).toBe('Botafogo x Flamengo');
        expect(response.body.times).toHaveLength(2);
        expect(response.body.times[0].jogadores.length).toBeGreaterThan(0);
        expect(response.body.times[1].jogadores.length).toBeGreaterThan(0);

        // Verify jogadores structure
        expect(response.body.times[0].jogadores[0]).toHaveProperty('nome');
        expect(response.body.times[0].jogadores[0]).toHaveProperty('nome_popular');
        expect(response.body.times[0].jogadores[0]).toHaveProperty('slug');
        expect(response.body.times[0].jogadores[0]).toHaveProperty('sexo');
        expect(response.body.times[0].jogadores[0]).toHaveProperty('foto_319x388');
        expect(response.body.times[0].jogadores[0]).toHaveProperty('fotos_contextuais');
    });

    it('should return 500 if service throws error', async () => {
        getJogoSpy = jest.spyOn(jogosService, 'getJogo').mockRejectedValue(
            new Error('Service error')
        );

        const response = await request(app)
            .get('/jogos/999999')
            .expect(500);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Service error');
    });

    it('should have CORS headers', async () => {
        const mockJogo = {
            id: '334218',
            nome: 'Botafogo x Flamengo',
            esporte: { id: '1', slug: 'futebol', nome: 'Futebol' },
            competicao: { nome: 'Campeonato Brasileiro' },
            times: []
        };

        getJogoSpy = jest.spyOn(jogosService, 'getJogo').mockResolvedValue(mockJogo);

        const response = await request(app)
            .get('/jogos/334218')
            .expect(200);

        expect(response.headers['access-control-allow-origin']).toBe('*');
        expect(response.headers['access-control-allow-methods']).toBe('GET');
    });
});
