# 🐳 Docker Setup - Guia Rápido

## ✅ Arquivos Criados

- ✅ `Dockerfile` - Imagem de produção (multi-stage build)
- ✅ `Dockerfile.dev` - Imagem de desenvolvimento
- ✅ `docker-compose.yml` - Orquestração produção
- ✅ `docker-compose.dev.yml` - Orquestração desenvolvimento
- ✅ `.dockerignore` - Arquivos ignorados no build
- ✅ `Makefile` - Atalhos para comandos
- ✅ `scripts/test-docker.sh` - Script de teste automatizado
- ✅ `.github/workflows/ci.yml` - CI/CD com GitHub Actions
- ✅ `.vscode/*` - Configurações do VSCode

## 🚀 Comandos Principais

### Opção 1: Usando Makefile (Recomendado)

```bash
# Ver todos os comandos
make help

# Desenvolvimento com Docker + Hot Reload
make docker-dev

# Produção com Docker
make docker-prod-build

# Ver logs
make logs

# Parar tudo
make docker-down

# Testar API
make test-health
```

### Opção 2: Usando npm scripts

```bash
# Desenvolvimento
npm run docker:dev

# Produção
npm run docker:prod:build

# Ver logs
npm run docker:logs

# Parar
npm run docker:prod:down
```

### Opção 3: Docker Compose direto

```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Produção
docker-compose up --build -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

## 🧪 Testar o Setup

```bash
# Teste automatizado completo
./scripts/test-docker.sh
```

## 📋 Checklist Antes de Começar

- [ ] Docker e Docker Compose instalados
- [ ] Arquivo `.env` configurado (copie de `.env.sample`)
- [ ] Token da API SDE configurado no `.env`

## 🎯 Diferenças: Dev vs Prod

### Desenvolvimento (`docker-compose.dev.yml`)
- ✅ Hot reload automático
- ✅ Volume mapeado para código fonte
- ✅ Todas as dependências (dev + prod)
- ✅ Logs em tempo real
- ⚡ Ideal para desenvolvimento

### Produção (`docker-compose.yml`)
- ✅ Build otimizado (multi-stage)
- ✅ Apenas dependências de produção
- ✅ Imagem menor (~200MB)
- ✅ Health checks configurados
- ✅ Usuário não-root
- 🔒 Ideal para deploy

## 📊 Monitoramento

```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats sde-events-support-service

# Logs em tempo real
docker-compose logs -f

# Último 50 linhas de log
docker-compose logs --tail=50
```

## 🔧 Troubleshooting

### Porta 3001 já em uso?
```bash
# Descobrir o que está usando
lsof -i :3001

# Ou mudar a porta no .env
echo "PORT=3002" >> .env
```

### Container não inicia?
```bash
# Ver logs detalhados
docker-compose logs app

# Verificar .env
cat .env
```

### Rebuild do zero
```bash
# Parar tudo e limpar
docker-compose down -v

# Rebuild sem cache
docker-compose build --no-cache

# Iniciar
docker-compose up -d
```

## 📚 Documentação Completa

- 📖 [DOCKER.md](DOCKER.md) - Documentação completa do Docker
- 📖 [README.md](README.md) - Documentação geral do projeto
- 📖 [API_TESTS.md](API_TESTS.md) - Testes da API

## 🎉 Próximos Passos

1. **Teste local**: `make docker-dev`
2. **Acesse**: http://localhost:3001/healthcheck
3. **Teste eventos**: http://localhost:3001/events/2025-10-11
4. **Deploy**: Use `docker-compose.yml` para produção

---

**Dica**: Execute `make help` para ver todos os comandos disponíveis! 🚀
