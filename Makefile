.PHONY: help install dev build start docker-dev docker-prod docker-down logs clean

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)SDE Events Support Service - Comandos disponíveis:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Comandos locais
install: ## Instala as dependências
	npm install

dev: ## Inicia em modo desenvolvimento (local)
	npm run dev

build: ## Compila o TypeScript
	npm run build

start: build ## Inicia em modo produção (local)
	npm start

type-check: ## Verifica tipos TypeScript
	npm run type-check

# Comandos Docker - Desenvolvimento
docker-dev: ## Inicia em modo desenvolvimento (Docker com hot reload)
	docker-compose -f docker-compose.dev.yml up

docker-dev-build: ## Rebuild e inicia em modo desenvolvimento (Docker)
	docker-compose -f docker-compose.dev.yml up --build

docker-dev-bg: ## Inicia em background modo desenvolvimento (Docker)
	docker-compose -f docker-compose.dev.yml up -d

# Comandos Docker - Produção
docker-prod: ## Inicia em modo produção (Docker)
	docker-compose up -d

docker-prod-build: ## Rebuild e inicia em modo produção (Docker)
	docker-compose up --build -d

# Comandos Docker - Gerais
docker-down: ## Para todos os containers
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

docker-down-volumes: ## Para containers e remove volumes
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v

logs: ## Mostra logs dos containers
	docker-compose logs -f

logs-dev: ## Mostra logs do container de desenvolvimento
	docker-compose -f docker-compose.dev.yml logs -f

ps: ## Lista containers rodando
	docker-compose ps

# Limpeza
clean: ## Remove node_modules e dist
	rm -rf node_modules dist

clean-docker: ## Remove imagens e containers do projeto
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all

# Testes
test-health: ## Testa o endpoint de healthcheck
	@echo "$(GREEN)Testando healthcheck...$(NC)"
	@curl -s http://localhost:3001/healthcheck | jq '.' || curl -s http://localhost:3001/healthcheck

test-events: ## Testa o endpoint de eventos (requer data como argumento: make test-events DATE=2025-10-11)
	@echo "$(GREEN)Testando eventos para data: $(DATE)$(NC)"
	@curl -s http://localhost:3001/events/$(DATE) | jq '.' || curl -s http://localhost:3001/events/$(DATE)

# Setup
setup: ## Setup completo do projeto (copia .env.sample e instala deps)
	@if [ ! -f .env ]; then \
		echo "$(GREEN)Criando arquivo .env...$(NC)"; \
		cp .env.sample .env; \
		echo "$(YELLOW)⚠️  Edite o arquivo .env com suas configurações!$(NC)"; \
	else \
		echo "$(YELLOW)Arquivo .env já existe$(NC)"; \
	fi
	@echo "$(GREEN)Instalando dependências...$(NC)"
	@npm install
	@echo "$(GREEN)✅ Setup completo!$(NC)"
