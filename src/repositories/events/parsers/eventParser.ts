import { Event } from '../../../types/event.types.js';

interface SdeApiResponse {
  referencias: {
    equipes: Record<string, any>;
    campeonatos: Record<string, any>;
    esportes: Record<string, any>;
    edicoes?: Record<string, any>;
    fases?: Record<string, any>;
  };
  resultados: {
    jogos: any[];
  };
}

interface Jogo {
  jogo_id: number;
  equipe_mandante_id: number;
  equipe_visitante_id: number;
  placar_oficial_mandante: number | null;
  placar_oficial_visitante: number | null;
  data_realizacao: string;
  hora_realizacao: string;
  fase_id: number;
  rodada: number | null;
  sede_id?: number;
  transmissoes?: {
    sem_transmissao: boolean;
    plataformas: Array<{
      transmissao_id: number;
      nome: string;
      logo_oficial: string;
      logo_destaque: string;
      url: string;
      descricao: string;
      call_to_action: string;
    }>;
  };
}

/**
 * Parser inteligente que processa a resposta da API SDE
 * Guarda as referências em memória para processar os jogos corretamente
 */
class EventParser {
  // Referências em memória
  private equipes: Record<string, any> = {};
  private campeonatos: Record<string, any> = {};
  private esportes: Record<string, any> = {};
  private edicoes: Record<string, any> = {};
  private fases: Record<string, any> = {};

  /**
   * Processa a resposta completa da API SDE
   * @param apiResponse Resposta da API com referências e resultados
   * @returns Array de eventos formatados
   */
  parseApiResponse(apiResponse: SdeApiResponse): Event[] {
    // 1. Carrega as referências em memória
    this.loadReferences(apiResponse.referencias);

    // 2. Processa os jogos usando as referências
    return this.parseJogos(apiResponse.resultados.jogos);
  }

  /**
   * Carrega todas as referências em memória
   */
  private loadReferences(referencias: SdeApiResponse['referencias']): void {
    console.log('[EventParser] Loading references...');

    this.equipes = referencias.equipes || {};
    this.campeonatos = referencias.campeonatos || {};
    this.esportes = referencias.esportes || {};
    this.edicoes = referencias.edicoes || {};
    this.fases = referencias.fases || {};

    console.log(`[EventParser] Loaded: ${Object.keys(this.equipes).length} equipes, ${Object.keys(this.campeonatos).length} campeonatos, ${Object.keys(this.esportes).length} esportes`);
  }

  /**
   * Processa a lista de jogos usando as referências em memória
   */
  private parseJogos(jogos: Jogo[]): Event[] {
    return jogos.map(jogo => this.parseJogo(jogo));
  }

  /**
   * Processa um jogo individual
   */
  private parseJogo(jogo: Jogo): Event {
    // Busca os times pelas referências
    const timeMandante = this.equipes[jogo.equipe_mandante_id];
    const timeVisitante = this.equipes[jogo.equipe_visitante_id];

    // Busca informações da fase e campeonato
    const fase = this.fases[jogo.fase_id];
    const edicao = fase ? this.edicoes[fase.edicao_id] : null;
    const campeonato = edicao ? this.campeonatos[edicao.campeonato_id] : null;
    const esporte = edicao ? this.esportes[edicao.esporte_id] : null;

    // Monta o nome do evento
    const nomeEvento = this.buildEventName(timeMandante, timeVisitante, jogo);

    // Monta a data/hora completa
    const dataHora = this.buildDateTime(jogo.data_realizacao, jogo.hora_realizacao);

    // Monta o objeto do evento
    const event: Event = {
      id: String(jogo.jogo_id),
      nome: nomeEvento,
      esporte: {
        id: esporte?.esporte_id ? String(esporte.esporte_id) : '',
        slug: esporte?.slug || '',
        nome: esporte?.nome || 'Futebol'
      },
      competicao: {
        nome: campeonato?.nome_popular || campeonato?.nome || edicao?.nome || ''
      },
      times: [
        {
          nome: timeMandante?.nome_popular || timeMandante?.nome || 'Time Desconhecido',
          sigla: timeMandante?.sigla || '',
          escudo60x60: timeMandante?.escudos?.['60x60'] || '',
          escudoSvg: timeMandante?.escudos?.svg || '',
          cores: timeMandante?.cores || null
        },
        {
          nome: timeVisitante?.nome_popular || timeVisitante?.nome || 'Time Desconhecido',
          sigla: timeVisitante?.sigla || '',
          escudo60x60: timeVisitante?.escudos?.['60x60'] || '',
          escudoSvg: timeVisitante?.escudos?.svg || '',
          cores: timeVisitante?.cores || null
        }
      ],
      dataHora,
      rodada: jogo.rodada !== null ? String(jogo.rodada) : null
    };

    // Adiciona transmissões se existirem
    if (jogo.transmissoes) {
      event.transmissoes = {
        semTransmissao: jogo.transmissoes.sem_transmissao,
        plataformas: jogo.transmissoes.plataformas.map(plataforma => ({
          nome: plataforma.nome,
          logoOficial: plataforma.logo_oficial,
          descricao: plataforma.descricao
        }))
      };
    }

    return event;
  }

  /**
   * Constrói o nome do evento baseado nos times e placar
   */
  private buildEventName(timeMandante: any, timeVisitante: any, jogo: Jogo): string {
    const nomeMandante = timeMandante?.nome_popular || timeMandante?.nome || 'Time Desconhecido';
    const nomeVisitante = timeVisitante?.nome_popular || timeVisitante?.nome || 'Time Desconhecido';

    // Se tem placar, inclui no nome
    if (jogo.placar_oficial_mandante !== null && jogo.placar_oficial_visitante !== null) {
      return `${nomeMandante} ${jogo.placar_oficial_mandante} x ${jogo.placar_oficial_visitante} ${nomeVisitante}`;
    }

    return `${nomeMandante} x ${nomeVisitante}`;
  }

  /**
   * Constrói a data/hora completa no formato ISO
   */
  private buildDateTime(data: string, hora: string): string {
    if (!data) return '';

    // Se já tem hora, monta o datetime completo
    if (hora) {
      return `${data}T${hora}`;
    }

    return data;
  }

  /**
   * Limpa as referências da memória
   */
  clearReferences(): void {
    this.equipes = {};
    this.campeonatos = {};
    this.esportes = {};
    this.edicoes = {};
    this.fases = {};
  }
}

// Exporta uma instância única do parser
const eventParser = new EventParser();

export default eventParser;
