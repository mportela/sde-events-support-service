#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Testando Docker Setup${NC}\n"

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado${NC}"
    exit 1
fi

# Verifica se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose estão instalados${NC}\n"

# Verifica se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
    echo -e "${YELLOW}Criando .env a partir de .env.sample...${NC}"
    cp .env.sample .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo -e "${YELLOW}⚠️  Edite o arquivo .env com suas configurações antes de continuar${NC}\n"
fi

# Build da imagem
echo -e "${GREEN}📦 Fazendo build da imagem...${NC}"
docker-compose build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso${NC}\n"
else
    echo -e "${RED}❌ Falha no build${NC}"
    exit 1
fi

# Inicia o container
echo -e "${GREEN}🚀 Iniciando container...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container iniciado${NC}\n"
else
    echo -e "${RED}❌ Falha ao iniciar container${NC}"
    exit 1
fi

# Aguarda o container ficar healthy
echo -e "${YELLOW}⏳ Aguardando container ficar saudável...${NC}"
sleep 10

# Testa o healthcheck
echo -e "\n${GREEN}🔍 Testando endpoint /healthcheck...${NC}"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3001/healthcheck)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Healthcheck OK${NC}"
    echo -e "${GREEN}Response: ${RESPONSE_BODY}${NC}\n"
else
    echo -e "${RED}❌ Healthcheck falhou (HTTP ${HTTP_CODE})${NC}"
    echo -e "${RED}Response: ${RESPONSE_BODY}${NC}\n"
fi

# Mostra status do container
echo -e "${GREEN}📊 Status do container:${NC}"
docker-compose ps

# Mostra logs
echo -e "\n${GREEN}📜 Últimas linhas do log:${NC}"
docker-compose logs --tail=20 app

echo -e "\n${GREEN}✨ Teste concluído!${NC}"
echo -e "${YELLOW}Para ver os logs em tempo real: docker-compose logs -f${NC}"
echo -e "${YELLOW}Para parar o container: docker-compose down${NC}\n"
