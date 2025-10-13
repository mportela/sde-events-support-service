# SDE Events Support Service

Backend service para suporte de eventos do SDE.

[![CI/CD Pipeline](https://github.com/mportela/sde-events-support-service/actions/workflows/ci.yml/badge.svg)](https://github.com/mportela/sde-events-support-service/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/mportela/sde-events-support-service/branch/main/graph/badge.svg)](https://codecov.io/gh/mportela/sde-events-support-service)
[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

🏠 **[Índice de Documentação](docs/INDEX.md)** | 📖 **[Guia Rápido Docker](docs/DOCKER_QUICKSTART.md)** | 📖 **[Doc Completa](docs/DOCKER.md)** | 🧪 **[Testes](docs/TESTING.md)** | 📡 **[API Tests](docs/API_TESTS.md)**

## 🚀 Início Rápido

```bash
# Com Docker (Recomendado)
make docker-dev

# Ou local
npm install && npm run dev
```

� **[Índice de Documentação](INDEX.md)** | �📖 **[Guia Rápido Docker](DOCKER_QUICKSTART.md)** | 📖 **[Doc Completa](DOCKER.md)** | 🧪 **[Testes](API_TESTS.md)**

## Requisitos

### Opção 1: Local
- Node.js 24.x (use nvm para gerenciar versões)
- Compatível com Node.js 20.x e 22.x

### Opção 2: Docker
- Docker & Docker Compose

## Setup

### Setup Local

1. Instale a versão correta do Node:
```bash
nvm use
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### Setup com Docker

1. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

2. Inicie com Docker:
```bash
# Desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up

# Produção
docker-compose up --build
```

📖 **[Ver documentação completa do Docker](DOCKER.md)**

## Executar

### 🚀 Forma Rápida (com Makefile)

```bash
# Ver todos os comandos disponíveis
make help

# Setup inicial completo
make setup

# Desenvolvimento local
make dev

# Desenvolvimento com Docker (hot reload)
make docker-dev

# Produção com Docker
make docker-prod-build

# Ver logs
make logs

# Parar containers
make docker-down

# Testar API
make test-health
make test-events DATE=2025-10-11
```

### Local

#### Desenvolvimento (com hot reload)
```bash
npm run dev
```

#### Build
```bash
npm run build
```

#### Produção
```bash
npm run build
npm start
```

#### Linting
```bash
# Verificar código
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

📖 **[Ver documentação completa do linter](docs/LINTING.md)**

#### Type Check
```bash
npm run type-check
```

#### Testes
```bash
# Todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration
```

📖 **[Ver documentação completa de testes](docs/TESTING.md)**

### Docker

#### Desenvolvimento
```bash
# Iniciar
docker-compose -f docker-compose.dev.yml up
# Ou: npm run docker:dev

# Parar
docker-compose -f docker-compose.dev.yml down
# Ou: npm run docker:dev:down
```

#### Produção
```bash
# Iniciar
docker-compose up -d
# Ou: npm run docker:prod

# Ver logs
docker-compose logs -f
# Ou: npm run docker:logs

# Parar
docker-compose down
# Ou: npm run docker:prod:down
```

#### Teste Automatizado do Docker
```bash
./scripts/test-docker.sh
```

O servidor irá subir na porta configurada (padrão: 3001).

## Endpoints

### Health Check
```
GET /healthcheck
```

### Eventos
```
GET /events/:date
```
Exemplo: `GET /events/2025-10-11`

### Jogos
```
GET /jogos/:id
```
Exemplo: `GET /jogos/334218`

Retorna informações detalhadas do jogo incluindo:
- Dados da competição e esporte
- Times com escudos
- Jogadores escalados com fotos e fotos contextuais

## Estrutura do Projeto

```
src/
├── app.ts              # Configuração do Express
├── server.ts           # Entry point
├── routes/             # Rotas da API
│   └── events/
├── services/           # Lógica de negócio
│   └── events/
│       └── parsers/    # Parsers específicos de events
├── repositories/       # Camada de dados
│   └── events/
└── clients/            # Clientes externos (APIs)
    └── sde/
```
