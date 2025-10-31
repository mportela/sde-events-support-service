/**
 * Types for Jogo (Game) domain
 */

export interface JogoPlayer {
    nome: string;
    nome_popular: string;
    slug: string;
    sexo: string;
    foto_319x388: string;
    fotos_contextuais: string[];
}

export interface JogoTeam {
    nome: string;
    sigla: string;
    escudo60x60: string;
    escudoSvg: string;
    cores?: {
        primaria: string;
        secundaria: string;
        terciaria: string;
    } | null;
    jogadores: JogoPlayer[];
}

export interface JogoEsporte {
    id: string;
    slug: string;
    nome: string;
}

export interface JogoCompeticao {
    nome: string;
}

export interface Jogo {
    id: string;
    nome: string;
    esporte: JogoEsporte;
    competicao: JogoCompeticao;
    times: JogoTeam[];
    rodada?: string | null;
}

// SDE API Response Types
export interface SDEAtleta {
    atleta_id: number;
    posicao: {
        macro: string;
        sigla: string;
        descricao: string;
        macro_posicao: string | null;
    };
    nome: string;
    nome_popular: string;
    slug: string;
    sexo: string;
    fotos: {
        '140x140'?: string;
        '220x220'?: string;
        '300x300'?: string;
        '319x388'?: string;
        '35x35'?: string;
        '50x50'?: string;
        '80x80'?: string;
        [key: string]: string | undefined;
    } | null;
    nacionalidade_id: number | null;
    fotos_contextuais: {
        [equipeId: string]: {
            equipe: number;
            spotlight?: {
                altura: number;
                data_criacao: string;
                largura: number;
                tipo: string;
                url: string;
            };
        } | null;
    } | null;
}

export interface SDEEquipe {
    nome: string;
    nome_popular: string;
    apelido: string;
    equipe_id: number;
    slug: string;
    sigla: string;
    genero: string;
    nacionalidade_id: number;
    escudos: {
        '30x30': string;
        '45x45': string;
        '60x60': string;
        '150x150': string;
        svg: string;
        escudo_alternativo: string;
        escudo_alternativo_svg: string;
    };
    cores: {
        primaria: string;
        secundaria: string;
        terciaria: string;
    };
    uniformes: Array<{
        camisa: string;
        camisa_svg: string;
        ordem: number;
    }>;
}

export interface SDEEsporte {
    esporte_id: number;
    nome: string;
    slug: string;
    codigo_odf: string;
    logo: string;
    logo_svg: string;
}

export interface SDECampeonato {
    campeonato_id: number;
    nome: string;
    nome_popular: string;
    nome_alternativo: string;
    slug: string;
    genero: string;
    esporte_id: number;
    categoria_id: number;
    modalidade_id: number;
    logo: string;
    logo_svg: string;
}

export interface SDEEscalacao {
    titulares: Array<{
        camisa: string;
        escalacaoequipe_id: number;
        atleta_id: number;
        posicao_campo: {
            macro: string;
            sigla: string;
            descricao: string;
            macro_posicao: string | null;
        };
        ordem: number;
        substituido: number | null;
    }>;
    reservas: Array<{
        atleta_id: number;
        numero: number | null;
        posicao: string | null;
        ordem: number;
    }>;
    tecnico_id: number;
    esquema_tatico: string;
}

export interface SDEJogoResponse {
    referencias: {
        arbitros: Record<string, unknown>;
        atletas: Record<string, SDEAtleta>;
        campeonatos: Record<string, SDECampeonato>;
        categorias: Record<string, unknown>;
        edicoes: Record<string, unknown>;
        equipes: Record<string, SDEEquipe>;
        escalacao: Record<string, SDEEscalacao>;
        esportes: Record<string, SDEEsporte>;
        fases: Record<string, unknown>;
        modalidades: Record<string, unknown>;
        nacionalidades: Record<string, unknown>;
        sedes: Record<string, unknown>;
        super_edicoes: Record<string, unknown>;
        super_eventos: Record<string, unknown>;
        tecnicos?: Record<string, unknown>;
    };
    resultados: {
        jogo_id: number;
        equipe_mandante_id: number;
        placar_oficial_mandante: number | null;
        placar_penaltis_mandante: number | null;
        escalacao_mandante_id: number | null;
        equipe_visitante_id: number;
        placar_oficial_visitante: number | null;
        placar_penaltis_visitante: number | null;
        escalacao_visitante_id: number | null;
        primeiro_atleta_id: number | null;
        segundo_atleta_id: number | null;
        data_realizacao: string;
        hora_realizacao: string;
        hora_fim: string | null;
        fuso_horario: string;
        data_realizacao_timezone: string;
        sede_id: number;
        fase_id: number;
        wo: boolean;
        cancelado: boolean;
        decisivo: boolean;
        rodada: number | null;
        suspenso: boolean;
        vencedor_jogo: string | null;
        transmissoes: Array<{
            id: number;
            nome: string;
            url?: string;
        }> | null;
        detalhamento_placar: Array<{
            periodo: string;
            placar_mandante: number;
            placar_visitante: number;
        }>;
        disputa_medalha: boolean;
        resultado: string;
        status: string;
        renda_moeda?: string;
        renda?: number | null;
        publico_total?: number | null;
        publico_pagante?: number | null;
        observacao?: string;
        arbitragem?: {
            arbitro_id?: number;
            assistentes?: number[];
        };
        ordem_na_chave?: number | null;
    };
}
