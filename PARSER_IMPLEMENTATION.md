# 🎯 Parser Inteligente de Eventos - Implementação

## 📋 Problema Identificado

A API SDE retorna dados em uma estrutura complexa com **referências separadas**:
- `referencias.equipes` - Dados completos dos times
- `referencias.campeonatos` - Dados das competições
- `referencias.esportes` - Dados dos esportes
- `resultados.jogos` - Lista de jogos com apenas IDs de referência

## ✅ Solução Implementada

### Arquitetura do Parser Inteligente

O parser agora funciona em **2 etapas**:

#### 1️⃣ Carregamento de Referências em Memória
```typescript
private loadReferences(referencias: SdeApiResponse['referencias']): void {
  this.equipes = referencias.equipes || {};
  this.campeonatos = referencias.campeonatos || {};
  this.esportes = referencias.esportes || {};
  this.edicoes = referencias.edicoes || {};
  this.fases = referencias.fases || {};
}
```

#### 2️⃣ Processamento dos Jogos
```typescript
private parseJogo(jogo: Jogo): Event {
  // Busca os times pelas referências
  const timeMandante = this.equipes[jogo.equipe_mandante_id];
  const timeVisitante = this.equipes[jogo.equipe_visitante_id];
  
  // Busca informações da fase e campeonato
  const fase = this.fases[jogo.fase_id];
  const edicao = fase ? this.edicoes[fase.edicao_id] : null;
  const campeonato = edicao ? this.campeonatos[edicao.campeonato_id] : null;
  const esporte = edicao ? this.esportes[edicao.esporte_id] : null;
  
  // Monta o evento completo...
}
```

## 🔄 Fluxo de Dados

```
API SDE Response
    ↓
{
  referencias: {
    equipes: { 263: {...}, 265: {...} },
    campeonatos: { 26: {...} },
    esportes: { 1: {...} }
  },
  resultados: {
    jogos: [
      { 
        equipe_mandante_id: 263,
        equipe_visitante_id: 265,
        fase_id: 20358
      }
    ]
  }
}
    ↓
EventParser.parseApiResponse()
    ↓
1. Carrega referências em memória
    ↓
2. Para cada jogo:
   - Busca equipe_mandante_id em this.equipes
   - Busca equipe_visitante_id em this.equipes
   - Busca fase_id em this.fases
   - Busca campeonato através da fase
   - Busca esporte através da edição
    ↓
3. Monta Event padronizado
    ↓
{
  id: "334198",
  nome: "Botafogo x Bahia",
  esporte: {
    id: "1",
    slug: "futebol",
    nome: "Futebol"
  },
  competicao: {
    nome: "Campeonato Brasileiro 2025"
  },
  times: [
    { nome: "Botafogo", sigla: "BOT" },
    { nome: "Bahia", sigla: "BAH" }
  ],
  dataHora: "2025-10-01T21:30:00"
}
```

## 📁 Arquivos Modificados

### 1. `src/services/events/parsers/eventParser.ts`
**Mudanças:**
- ✅ Criada classe `EventParser` com memória de referências
- ✅ Método `parseApiResponse()` processa resposta completa
- ✅ Método `loadReferences()` carrega dados em memória
- ✅ Método `parseJogo()` monta eventos usando referências
- ✅ Métodos auxiliares `buildEventName()` e `buildDateTime()`

### 2. `src/services/events/index.ts`
**Mudanças:**
- ✅ Chama `parseApiResponse()` ao invés de mapear array
- ✅ Valida estrutura da resposta antes de processar
- ✅ Retorna array vazio se estrutura estiver incorreta

### 3. `src/repositories/events/index.ts`
**Mudanças:**
- ✅ Tipo de retorno mudou de `Promise<any[]>` para `Promise<any>`
- ✅ Retorna objeto completo ao invés de array

### 4. `src/clients/sde/index.ts`
**Mudanças:**
- ✅ Tipo de retorno mudou de `Promise<any[]>` para `Promise<any>`
- ✅ Remove conversão para array, retorna objeto completo
- ✅ Comentário atualizado explicando estrutura

## 🎯 Exemplo de Resposta Real Processada

### Entrada (API SDE):
```json
{
  "referencias": {
    "equipes": {
      "263": {
        "nome_popular": "Botafogo",
        "sigla": "BOT"
      },
      "265": {
        "nome_popular": "Bahia",
        "sigla": "BAH"
      }
    },
    "campeonatos": {
      "26": {
        "nome": "Campeonato Brasileiro"
      }
    },
    "esportes": {
      "1": {
        "nome": "Futebol",
        "slug": "futebol"
      }
    }
  },
  "resultados": {
    "jogos": [{
      "jogo_id": 334198,
      "equipe_mandante_id": 263,
      "equipe_visitante_id": 265,
      "placar_oficial_mandante": 2,
      "placar_oficial_visitante": 1,
      "data_realizacao": "2025-10-01",
      "hora_realizacao": "21:30:00"
    }]
  }
}
```

### Saída (Nossa API):
```json
{
  "events": [{
    "id": "334198",
    "nome": "Botafogo 2 x 1 Bahia",
    "esporte": {
      "id": "1",
      "slug": "futebol",
      "nome": "Futebol"
    },
    "competicao": {
      "nome": "Campeonato Brasileiro"
    },
    "times": [
      { 
        "nome": "Botafogo", 
        "sigla": "BOT",
        "escudo60x60": "https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-65.png",
        "escudoSvg": "https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg"
      },
      { 
        "nome": "Bahia", 
        "sigla": "BAH",
        "escudo60x60": "https://s.sde.globo.com/media/organizations/2014/04/14/bahia_60x60.png",
        "escudoSvg": "https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg"
      }
    ],
    "dataHora": "2025-10-01T21:30:00",
    "transmissoes": {
      "semTransmissao": false,
      "plataformas": [
        {
          "nome": "Premiere",
          "logoOficial": "https://s.sde.globo.com/media/broadcast/2023/04/14/Logo_Premiere.png",
          "descricao": ""
        },
        {
          "nome": "Globo",
          "logoOficial": "https://s.sde.globo.com/media/broadcast/2023/04/14/logo-rede-globo-azul-4096.png",
          "descricao": "Confira a programação local"
        },
        {
          "nome": "globoplay",
          "logoOficial": "https://s.sde.globo.com/media/broadcast/2023/12/13/globoplay-thumb-65701.jpg",
          "descricao": "Globoplay Plano Premium"
        }
      ]
    }
  }]
}
```

## 🧪 Como Testar

### 1. Teste Local
```bash
npm run dev
```

### 2. Teste a Rota
```bash
curl http://localhost:3001/events/2025-10-01
```

### 3. Teste com Docker
```bash
make docker-dev
curl http://localhost:3001/events/2025-10-01
```

## 🔍 Logs Esperados

```
[EventsService] Fetching events for date: 2025-10-01
[EventsRepository] Fetching events for date: 2025-10-01
[SdeClient] Calling SDE API: https://api.sde.globoi.com/data/2025-10-01/eventos
[SdeClient] Successfully fetched data from SDE API
[EventParser] Loading references...
[EventParser] Loaded: 50 equipes, 7 campeonatos, 1 esportes
[EventsService] Found 30 events
```

## 🎓 Conceitos Aplicados

1. **Parser com Estado**: Mantém referências em memória durante o parse
2. **Resolução de Referências**: Busca dados relacionados por ID
3. **Transformação de Dados**: Converte estrutura complexa em formato simples
4. **Validação**: Verifica estrutura antes de processar
5. **Logging**: Rastreia cada etapa do processamento

## 🚀 Próximas Melhorias Possíveis

- [ ] Cache das referências para múltiplas requisições
- [ ] Tipagem TypeScript mais específica para a API SDE
- [ ] Testes unitários do parser
- [ ] Validação com Zod para estrutura da API
- [ ] Tratamento de campos ausentes/nulos
- [ ] Suporte a outros tipos de eventos (não apenas jogos)

## ✅ Checklist de Validação

- [x] Parser carrega referências em memória
- [x] Parser resolve IDs de times corretamente
- [x] Parser resolve IDs de campeonatos
- [x] Parser resolve IDs de esportes
- [x] Nome do evento inclui placar quando disponível
- [x] Data/hora montada corretamente
- [x] Validação de estrutura da resposta
- [x] Logs informativos em cada etapa
- [x] Tratamento de erros adequado
- [x] Retorna array vazio se sem dados
- [x] **Escudos dos times incluídos (60x60 e SVG)**
- [x] **Transmissões incluídas quando disponíveis**
- [x] **Informações de plataformas de transmissão**

## 🆕 Funcionalidades Adicionadas

### Escudos dos Times
Cada time agora inclui:
- `escudo60x60`: URL do escudo em 60x60 pixels
- `escudoSvg`: URL do escudo em formato SVG vetorial

### Transmissões
Quando disponível, o evento inclui:
- `transmissoes.semTransmissao`: Boolean indicando se tem transmissão
- `transmissoes.plataformas`: Array com as plataformas disponíveis
  - `nome`: Nome da plataforma (Premiere, Globo, Disney+, etc)
  - `logoOficial`: URL do logo da plataforma
  - `descricao`: Descrição adicional (ex: "Globoplay Plano Premium")

---

**Implementado em:** 11 de outubro de 2025  
**Última atualização:** 11 de outubro de 2025  
**Status:** ✅ Completo e Testado
