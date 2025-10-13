# Docker Guide

## 🐳 Docker Setup

Este projeto possui configuração Docker completa para desenvolvimento e produção.

## Arquivos Docker

- `Dockerfile` - Imagem de produção otimizada (multi-stage build)
- `Dockerfile.dev` - Imagem de desenvolvimento com hot reload
- `docker-compose.yml` - Configuração para produção
- `docker-compose.dev.yml` - Configuração para desenvolvimento
- `.dockerignore` - Arquivos ignorados no build

## 🚀 Comandos Rápidos

### Desenvolvimento (com hot reload)

```bash
# Iniciar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Iniciar em background
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar
docker-compose -f docker-compose.dev.yml down
```

### Produção

```bash
# Build e iniciar
docker-compose up --build

# Iniciar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 🔧 Variáveis de Ambiente

Certifique-se de ter o arquivo `.env` configurado:

```bash
cp .env.sample .env
# Edite o .env com suas configurações
```

## 📊 Monitoramento

### Health Check

O container possui health check automático que verifica a rota `/healthcheck` a cada 30 segundos.

Verificar status:
```bash
docker ps
# A coluna STATUS mostrará "healthy" ou "unhealthy"
```

### Logs

```bash
# Ver logs em tempo real
docker-compose logs -f app

# Ver últimas 100 linhas
docker-compose logs --tail=100 app

# Logs de desenvolvimento
docker-compose -f docker-compose.dev.yml logs -f app
```

## 🛠️ Comandos Úteis

### Acessar o container

```bash
# Produção
docker-compose exec app sh

# Desenvolvimento
docker-compose -f docker-compose.dev.yml exec app sh
```

### Rebuild completo

```bash
# Produção
docker-compose build --no-cache
docker-compose up -d

# Desenvolvimento
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### Limpar recursos Docker

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover tudo não utilizado (cuidado!)
docker system prune -a
```

## 🔍 Debugging

### Ver informações do container

```bash
docker-compose ps
docker inspect sde-events-support-service
```

### Verificar uso de recursos

```bash
docker stats sde-events-support-service
```

### Testar a API

```bash
# Health check
curl http://localhost:3001/healthcheck

# Eventos
curl http://localhost:3001/events/2025-10-11
```

## 📦 Portas

- **3001** - Porta padrão da aplicação (configurável via PORT no .env)

## 🏗️ Arquitetura da Imagem de Produção

A imagem de produção usa multi-stage build para otimização:

1. **Builder Stage**: 
   - Instala todas as dependências
   - Compila TypeScript para JavaScript

2. **Production Stage**:
   - Apenas dependências de produção
   - Código compilado
   - Usuário não-root para segurança
   - Imagem Alpine (menor tamanho)

**Tamanho estimado da imagem final**: ~200MB

## 🔒 Segurança

- ✅ Usuário não-root (nodejs)
- ✅ Apenas dependências de produção
- ✅ Health checks configurados
- ✅ Variáveis de ambiente via .env
- ✅ Logs rotativos (max 10MB, 3 arquivos)

## 🌐 Networks

O Docker Compose cria uma rede chamada `sde-network` para facilitar a comunicação entre serviços futuros (ex: banco de dados, cache, etc).

## 🚨 Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta 3001
lsof -i :3001

# Ou mude a porta no .env
echo "PORT=3002" >> .env
```

### Erro de permissão

```bash
# Dar permissão aos scripts
chmod +x docker-compose.yml
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs app

# Verificar se o .env existe
ls -la .env
```

## 📚 Próximos Passos

Para adicionar mais serviços ao docker-compose (ex: PostgreSQL, Redis):

```yaml
services:
  app:
    # ... configuração existente
    depends_on:
      - postgres
  
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sde_events
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
