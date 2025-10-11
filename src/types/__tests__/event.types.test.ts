import { describe, expect, it } from '@jest/globals';
import type { Event, EventsResponse } from '../event.types.js';

describe('Event Types', () => {
    describe('Event interface', () => {
        it('should have all required properties', () => {
            const event: Event = {
                id: '123',
                nome: 'Time A x Time B',
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
                        nome: 'Time A',
                        sigla: 'TIA',
                        escudo60x60: 'https://example.com/escudo-a-60.png',
                        escudoSvg: 'https://example.com/escudo-a.svg'
                    },
                    {
                        nome: 'Time B',
                        sigla: 'TIB',
                        escudo60x60: 'https://example.com/escudo-b-60.png',
                        escudoSvg: 'https://example.com/escudo-b.svg'
                    }
                ],
                dataHora: '2025-10-11T15:00:00'
            };

            expect(event).toHaveProperty('id');
            expect(event).toHaveProperty('nome');
            expect(event).toHaveProperty('esporte');
            expect(event).toHaveProperty('competicao');
            expect(event).toHaveProperty('times');
            expect(event).toHaveProperty('dataHora');
        });

        it('should have optional transmissoes property', () => {
            const eventWithTransmissoes: Event = {
                id: '123',
                nome: 'Time A x Time B',
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
                        nome: 'Time A',
                        sigla: 'TIA',
                        escudo60x60: 'https://example.com/escudo-a-60.png',
                        escudoSvg: 'https://example.com/escudo-a.svg'
                    },
                    {
                        nome: 'Time B',
                        sigla: 'TIB',
                        escudo60x60: 'https://example.com/escudo-b-60.png',
                        escudoSvg: 'https://example.com/escudo-b.svg'
                    }
                ],
                dataHora: '2025-10-11T15:00:00',
                transmissoes: {
                    semTransmissao: false,
                    plataformas: [
                        {
                            nome: 'Premiere',
                            logoOficial: 'https://example.com/premiere.png',
                            descricao: 'Assine o Premiere'
                        }
                    ]
                }
            };

            expect(eventWithTransmissoes).toHaveProperty('transmissoes');
            expect(eventWithTransmissoes.transmissoes).toHaveProperty('semTransmissao');
            expect(eventWithTransmissoes.transmissoes).toHaveProperty('plataformas');
        });

        it('should validate esporte structure', () => {
            const event: Event = {
                id: '123',
                nome: 'Time A x Time B',
                esporte: {
                    id: '1',
                    slug: 'futebol',
                    nome: 'Futebol'
                },
                competicao: {
                    nome: 'Campeonato Brasileiro'
                },
                times: [],
                dataHora: '2025-10-11T15:00:00'
            };

            expect(event.esporte).toHaveProperty('id');
            expect(event.esporte).toHaveProperty('slug');
            expect(event.esporte).toHaveProperty('nome');
            expect(typeof event.esporte.id).toBe('string');
            expect(typeof event.esporte.slug).toBe('string');
            expect(typeof event.esporte.nome).toBe('string');
        });

        it('should validate times structure with escudos', () => {
            const event: Event = {
                id: '123',
                nome: 'Time A x Time B',
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
                        nome: 'Time A',
                        sigla: 'TIA',
                        escudo60x60: 'https://example.com/escudo-a-60.png',
                        escudoSvg: 'https://example.com/escudo-a.svg'
                    }
                ],
                dataHora: '2025-10-11T15:00:00'
            };

            expect(event.times[0]).toHaveProperty('nome');
            expect(event.times[0]).toHaveProperty('sigla');
            expect(event.times[0]).toHaveProperty('escudo60x60');
            expect(event.times[0]).toHaveProperty('escudoSvg');
        });
    });

    describe('EventsResponse interface', () => {
        it('should have events array property', () => {
            const response: EventsResponse = {
                events: []
            };

            expect(response).toHaveProperty('events');
            expect(Array.isArray(response.events)).toBe(true);
        });

        it('should contain valid Event objects', () => {
            const response: EventsResponse = {
                events: [
                    {
                        id: '123',
                        nome: 'Time A x Time B',
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
                                nome: 'Time A',
                                sigla: 'TIA',
                                escudo60x60: 'https://example.com/escudo-a-60.png',
                                escudoSvg: 'https://example.com/escudo-a.svg'
                            }
                        ],
                        dataHora: '2025-10-11T15:00:00'
                    }
                ]
            };

            expect(response.events).toHaveLength(1);
            expect(response.events[0]).toHaveProperty('id');
            expect(response.events[0]).toHaveProperty('nome');
        });
    });
});
