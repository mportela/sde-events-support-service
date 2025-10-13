# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.8.0] - 2025-10-13

### ✨ Adicionado
- **Campos rodada e cores nos eventos e jogos**:
  - Campo `rodada` (string | null) em Event e Jogo types
  - Campo `cores` (objeto com primaria, secundaria, terciaria) nos times
  - Parsers atualizados para extrair rodada e cores da API SDE
  - Retrocompatível com campos opcionais

### 🎨 Benefícios
- Clientes podem exibir número da rodada em campeonatos de pontos corridos
- Clientes podem usar cores dos times para customização de UI
- Segue estrutura de resposta da API SDE
- Mantém retrocompatibilidade (campos opcionais)

### 🧪 Testes
- **114 testes passando**
- **Cobertura**: 98.55% statements, 100% functions
- 0 erros de lint

## [1.7.0] - 2025-10-12

### ✨ Adicionado
- **Nova rota `/jogos/:id`**:
  - Endpoint para buscar detalhes de jogos específicos
  - Parser para dados da API do SDE (jogos)
  - Repository, Service e Routes seguindo arquitetura existente
  - Cache LRU compartilhado para requests de jogos
  
### 🏗️ Arquitetura
- **Types (`jogo.types.ts`)**:
  - Interfaces para Jogo, JogoPlayer, JogoTeam
  - Types para resposta da API do SDE (SDEJogoResponse)
  
- **Parser (`jogoParser.ts`)**:
  - `parseSDEJogo()`: converte resposta do SDE para formato interno
  - `createMockJogo()`: cria dados mock para testes
  - Extração de jogadores da escalação com fotos contextuais
  
- **Client SDE**:
  - Método `getJogo(jogoId)` para buscar jogos
  - Cache LRU compartilhado com eventos
  
- **Repository (`JogosRepository`)**:
  - `getJogo(jogoId)`: busca jogo da API
  - Métodos de cache (`clearCache`, `getCacheStats`)
  
- **Service (`JogosService`)**:
  - Camada de negócio para jogos
  - Validação de jogoId
  
- **Routes (`/jogos/:id`)**:
  - GET com parâmetro de ID
  - Tratamento de erros
  - CORS configurado

### 🧪 Testes
- **102 testes passando** (5 novos testes):
  - Parser de jogos (2 testes)
  - Rota de jogos (3 testes)
- **Cobertura mantida**: 98%+

### 📊 Resposta da API
```json
{
  "id": "334218",
  "nome": "Botafogo x Flamengo",
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
      "escudo60x60": "https://...",
      "escudoSvg": "https://...",
      "jogadores": [
        {
          "nome": "Leonardo Matias Baiersdorf Linck",
          "nome_popular": "Léo Linck",
          "slug": "leolinck",
          "sexo": "M",
          "foto_319x388": "https://...",
          "fotos_contextuais": []
        }
      ]
    }
  ]
}
```

## [1.6.0] - 2025-10-11

### ⬆️ Atualizado
- **Node.js 24.x**:
  - Atualização para Node.js 24 LTS (versão mais recente)
  - Dockerfile usa `node:24-alpine`
  - `.nvmrc` atualizado para versão 24
  - `@types/node` atualizado para v24
  - Especificação `engines` em package.json: `>=20.0.0`

### 🧪 Testes Multi-versão
- **CI/CD Matrix Testing**:
  - Node.js 20.x ✅
  - Node.js 22.x ✅
  - Node.js 24.x ✅
  - Cobertura de código executada na v24
  - Build e deploy usando v24

### 📚 Documentação
- README atualizado com badge Node.js 24
- Requisitos documentando compatibilidade com 20.x, 22.x e 24.x

## [1.5.1] - 2025-10-11

### 🐳 Otimizado
- **Dockerfile - Redução de Layers**:
  - Combinados comandos RUN para criação de usuário e mudança de ownership
  - Redução de 2 layers para 1 layer
  - Mantém todas as funcionalidades e segurança (non-root user)
  - Remoção do arquivo de teste `events.json`

### 📊 Métricas de Performance
- **Build**: 144MB (otimizado)
- **Startup**: Container healthy em 14 segundos
- **Recursos**: 16MB RAM, 0% CPU (idle)
- **Health Checks**: ✅ Funcionando
- **Endpoints**: ✅ Todos operacionais

## [1.5.0] - 2025-10-11

### ✨ Adicionado
- **🔍 ESLint - Linter para TypeScript**:
  - Configuração moderna do ESLint 9+ com flat config
  - Suporte completo para TypeScript com `@typescript-eslint`
  - Integração com CI/CD pipeline
  - Scripts npm: `lint` e `lint:fix`
  
### 🔧 Configuração do Linter
- **Regras TypeScript**:
  - No explicit any (warning)
  - No unused vars com ignore para variáveis prefixadas com `_`
  - Type-checked rules habilitadas
  
- **Boas Práticas**:
  - Prefer const over let
  - No var allowed
  - Strict equality (===)
  - Always use curly braces
  - Semicolons obrigatórios
  - Single quotes (com escape permitido)
  - Trailing commas em multiline
  
- **Arquivos Ignorados**:
  - dist/
  - coverage/
  - node_modules/
  - Config files (*.config.js, jest.setup.js)

### 📦 Dependências Adicionadas
- `eslint@^9.x` - Core do ESLint
- `@eslint/js@^9.x` - Configurações recomendadas
- `@typescript-eslint/parser@^8.x` - Parser TypeScript
- `@typescript-eslint/eslint-plugin@^8.x` - Regras TypeScript
- `typescript-eslint@^8.x` - Utilitários TypeScript

### 🚀 CI/CD Atualizado
- Adicionado step "Run linter" antes do type check
- Falha do lint bloqueia o build

## [1.4.3] - 2025-10-11

### 📚 Documentação
- **Badge de Cobertura de Código (Codecov)**:
  - Adicionado badge mostrando porcentagem de code coverage
  - Badge atualizado automaticamente após cada CI/CD run
  - Link direto para dashboard detalhado do Codecov
  - Cobertura atual: ~98%+ (statements, functions, lines)

## [1.4.2] - 2025-10-11

### 📚 Documentação
- **Badge do GitHub Actions no README**:
  - Adicionado badge de status do CI/CD Pipeline
  - Badge mostra status em tempo real dos workflows
  - Link direto para a página de Actions do repositório

## [1.4.1] - 2025-10-11

### 🔒 Segurança
- **Restrição de CORS Methods**:
  - Header `Access-Control-Allow-Methods` alterado de `GET, POST, PUT, DELETE, OPTIONS` para apenas `GET`
  - API agora permite somente requisições GET, aumentando a segurança
  - Atualização dos testes para refletir a nova política de métodos HTTP

### 🐛 Correções
- **TypeScript Type Check**: Adicionado `return` explícito na rota de eventos para corrigir erro TS7030
- **CI/CD Simplificado**: 
  - Removidos scripts `test:unit` e `test:integration` (não usados)
  - Removido step de linter do CI (não configurado)
  - CI agora roda apenas `npm test` e `npm run test:coverage`
  - Todos os testes unificados em `__tests__/*.test.ts`
- **Docker Build no CI**: 
  - Adicionado `load: true` no docker/build-push-action
  - Corrige erro "image not found" ao executar teste do container
  - Imagem agora é carregada corretamente no Docker local após build

## [1.4.0] - 2025-10-11

### ✨ Adicionado
- **💾 Cache LRU (Least Recently Used) em Memória**:
  - Implementação customizada de cache LRU para respostas da API do SDE
  - Capacidade de 20 entradas (datas diferentes) configurável
  - Cache inteligente que remove automaticamente as entradas mais antigas quando cheio
  - Logs detalhados de HIT/MISS/EVICTION para monitoramento
  
- **🚀 Otimização de Performance no SDE Client**:
  - Respostas em cache são retornadas instantaneamente sem requisições externas
  - Cache por data: cada data é uma entrada separada no cache
  - Método `clearCache()` para limpar o cache quando necessário
  - Método `getCacheStats()` para obter estatísticas do cache (size, capacity, usage)

- **🧪 Testes Completos do Cache**:
  - 30 novos testes unitários para o LRUCache (100% cobertura)
  - 6 novos testes de integração para cache no SDE Client
  - Validação de eviction de entradas antigas (LRU)
  - Testes de múltiplas datas cacheadas simultaneamente
  - Testes de clear cache e estatísticas

### 📁 Novos Arquivos
- `src/utils/cache/LRUCache.ts` - Implementação do cache LRU genérico
- `src/utils/cache/__tests__/LRUCache.test.ts` - Suite de testes do LRUCache
- `docs/CACHE_IMPLEMENTATION.md` - Documentação completa do cache

### 🔧 Modificações
- `src/clients/sde/index.ts` - Integração do cache LRU nas requisições
- `src/clients/sde/__tests__/index.test.ts` - Testes de cache no cliente

### 📊 Estatísticas de Testes
- **Total de Testes**: 97 (61 → 97) - +36 testes cache
- **Taxa de Sucesso**: 100% (97/97 passando)
- **Tempo de Execução**: ~0.9s
- **Cobertura de Código**: Mantida acima de 95%

### 🎯 Benefícios
- ✅ Reduz requisições externas à API do SDE
- ✅ Melhora tempo de resposta para datas já consultadas
- ✅ Controle de memória com limite de 20 entradas
- ✅ Cache totalmente testado e confiável
- ✅ Logs detalhados para debugging e monitoramento

## [1.3.0] - 2025-10-11

### ✨ Adicionado
- **🌐 Suporte a CORS (Cross-Origin Resource Sharing)**:
  - Middleware customizado para headers CORS em todas as rotas
  - Header `Access-Control-Allow-Origin: *` - Permite requisições de qualquer origem
  - Header `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS` - Métodos HTTP permitidos
  - Header `Access-Control-Allow-Headers: Content-Type, Authorization` - Headers permitidos nas requisições
  
- **🧪 Testes Unitários de CORS**:
  - 6 novos testes verificando headers CORS em diferentes cenários
  - Validação de CORS em endpoints de sucesso (healthcheck, events)
  - Validação de CORS em respostas de erro (404, 500)
  - Cobertura completa do middleware CORS

### 🔧 Melhorias
- Middleware CORS posicionado estrategicamente após parser JSON e antes de todas as rotas
- Todos os endpoints agora retornam headers CORS automaticamente
- Aplicação pronta para consumo por frontends em diferentes origens

### 📊 Estatísticas de Testes
- **Total de Testes**: 61 (55 → 61) - +6 testes CORS
- **Taxa de Sucesso**: 100% (61/61 passando)
- **Cobertura de Código**: Mantida acima de 95%

## [1.2.0] - 2025-10-11

### ✨ Adicionado
- **🧪 Implementação Completa de TDD (Test-Driven Development)**:
  - Framework de testes Jest 29.7.0 configurado com suporte a ESM e TypeScript
  - 72 casos de teste criados cobrindo todas as camadas da aplicação
  - Suporte a testes unitários e de integração
  - Configuração de cobertura de código (threshold: 70%)
  
- **📁 Arquivos de Teste Criados**:
  - `src/types/__tests__/event.types.test.ts` - Validação de interfaces TypeScript
  - `src/clients/sde/__tests__/index.test.ts` - Testes do cliente SDE API
  - `src/repositories/events/__tests__/index.test.ts` - Testes da camada de repositório
  - `src/services/events/__tests__/index.test.ts` - Testes da lógica de negócio
  - `src/services/events/parsers/__tests__/eventParser.test.ts` - Testes do parser inteligente
  - `src/routes/events/__tests__/index.test.ts` - Testes de integração das rotas HTTP
  - `src/__tests__/app.test.ts` - Testes de integração da aplicação completa

- **🔧 Dependências de Teste**:
  - `jest@^29.7.0` - Framework de testes
  - `ts-jest@^29.1.2` - Suporte TypeScript para Jest
  - `@jest/globals@^29.7.0` - APIs globais do Jest tipadas
  - `supertest@^6.3.4` - Testes HTTP de integração
  - `@types/jest@^29.5.12` - Tipagens Jest
  - `@types/supertest@^6.0.2` - Tipagens Supertest

- **📜 Scripts NPM de Teste**:
  - `npm test` - Executar todos os testes
  - `npm run test:watch` - Modo watch para desenvolvimento
  - `npm run test:coverage` - Executar com relatório de cobertura
  - `npm run test:unit` - Executar apenas testes unitários
  - `npm run test:integration` - Executar apenas testes de integração

- **📖 Documentação de Testes**:
  - `docs/TESTING.md` - Guia completo com 450+ linhas (estrutura, execução, boas práticas, mocking, troubleshooting)
  - `docs/TDD_IMPLEMENTATION_SUMMARY.md` - Resumo executivo da implementação

- **🚀 CI/CD Atualizado**:
  - Job de lint e type check
  - Job de testes em múltiplas versões do Node.js (20.x e 21.x)
  - Upload de relatórios de cobertura para Codecov
  - Artifacts de cobertura salvos por 30 dias
  - Verificação de thresholds de cobertura

### 🔧 Modificado
- `package.json` - Adicionadas dependências e scripts de teste
- `jest.config.json` - Configuração completa do Jest com ESM support
- `.github/workflows/ci.yml` - Pipeline CI/CD expandido com jobs de teste
- `README.md` - Adicionada seção de testes e links para documentação

### 📊 Cobertura de Testes por Camada
- **Types**: 6 testes - Validação de interfaces Event e EventsResponse
- **Client SDE**: 7 testes - Fetch API, headers, autenticação, error handling
- **Repository**: 7 testes - Integração com client, tratamento de erros
- **Service**: 10 testes - Lógica de negócio, validação de resposta API
- **Parser**: 9 testes - Parse completo, referências, escudos, transmissões, edge cases
- **Routes**: 14 testes - Validação de data, HTTP status, response structure
- **App**: 16 testes - Healthcheck, 404 handler, error middleware, CORS, content-type

### 🎯 Funcionalidades de Teste
- Mock de fetch API para testes de client
- Mock de módulos para isolamento de camadas
- Testes de integração HTTP com Supertest
- Validação de estruturas TypeScript
- Cobertura de edge cases (dados faltantes, erros de rede, JSON inválido)
- Testes de formatação de data e datetime
- Validação de escudos (60x60 e SVG)
- Validação de transmissões e plataformas

### 📈 Métricas
- **Total de Testes**: 72 casos de teste
- **Linhas de Código de Teste**: ~1.420 linhas
- **Arquivos de Teste**: 7 arquivos
- **Coverage Threshold**: 70% (branches, functions, lines, statements)

---

## [1.1.0] - 2025-10-11

### ✨ Adicionado
- **Escudos dos Times**: Agora cada time retorna dois campos de escudo:
  - `escudo60x60`: URL do escudo em tamanho 60x60 pixels (formato PNG)
  - `escudoSvg`: URL do escudo em formato SVG vetorial
  
- **Informações de Transmissão**: Novos dados sobre onde assistir os jogos:
  - `transmissoes.semTransmissao`: Indica se o jogo tem transmissão
  - `transmissoes.plataformas[]`: Lista de plataformas que transmitem
    - `nome`: Nome da plataforma (Premiere, Globo, Disney+, HBO Max, etc)
    - `logoOficial`: URL do logo da plataforma
    - `descricao`: Informações adicionais (ex: "Globoplay Plano Premium")

### 🔧 Modificado
- Interface TypeScript `Event` atualizada com novos campos
- Parser `eventParser.ts` atualizado para processar escudos e transmissões
- Documentação `PARSER_IMPLEMENTATION.md` atualizada com exemplos

### 📋 Exemplo de Resposta Atualizada
```json
{
  "id": "334198",
  "nome": "Botafogo 2 x 1 Bahia",
  "times": [
    { 
      "nome": "Botafogo", 
      "sigla": "BOT",
      "escudo60x60": "https://s.sde.globo.com/.../botafogo-65.png",
      "escudoSvg": "https://s.sde.globo.com/.../botafogo-svg.svg"
    }
  ],
  "transmissoes": {
    "semTransmissao": false,
    "plataformas": [
      {
        "nome": "Premiere",
        "logoOficial": "https://s.sde.globo.com/.../Logo_Premiere.png",
        "descricao": ""
      }
    ]
  }
}
```

---

## [1.0.0] - 2025-10-11

### ✨ Lançamento Inicial
- Backend Node.js com Express e TypeScript
- Rota `/healthcheck` para verificação de saúde
- Rota `/events/:date` para buscar eventos por data (formato YYYY-MM-DD)
- Parser inteligente com referências em memória
- Integração com API SDE da Globo
- Suporte a Docker (desenvolvimento e produção)
- Documentação completa
- CI/CD com GitHub Actions

### 🎯 Funcionalidades Principais
- Arquitetura em camadas: Routes → Services → Repositories → Clients
- Processamento inteligente de referências (equipes, campeonatos, esportes)
- Validação de formato de data
- Logs detalhados em cada etapa
- Configuração via variáveis de ambiente
- Hot reload em modo desenvolvimento

---

## Formato

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças
- **✨ Adicionado** para novas funcionalidades
- **🔧 Modificado** para mudanças em funcionalidades existentes
- **❌ Depreciado** para funcionalidades que serão removidas em breve
- **🗑️ Removido** para funcionalidades removidas
- **🐛 Corrigido** para correções de bugs
- **🔒 Segurança** para vulnerabilidades corrigidas
