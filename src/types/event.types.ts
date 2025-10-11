export interface Event {
  id: string;
  nome: string;
  esporte: {
    id: string;
    slug: string;
    nome: string;
  };
  competicao: {
    nome: string;
  };
  times: Array<{
    nome: string;
    sigla: string;
    escudo60x60: string;
    escudoSvg: string;
  }>;
  dataHora: string;
  transmissoes?: {
    semTransmissao: boolean;
    plataformas: Array<{
      nome: string;
      logoOficial: string;
      descricao: string;
    }>;
  };
}

export interface EventsResponse {
  events: Event[];
}
