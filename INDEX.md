# 📚 Índice de Documentação

## 🚀 Comece Aqui

1. **[DOCKER_SUMMARY.md](DOCKER_SUMMARY.md)** ⭐ **LEIA PRIMEIRO**
   - Resumo executivo completo
   - Comandos principais
   - Início rápido em 3 passos

2. **[DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)** ⚡
   - Guia rápido de uso
   - Comandos essenciais
   - Troubleshooting básico

## 📖 Documentação Completa

3. **[README.md](README.md)** 📝
   - Visão geral do projeto
   - Setup local e Docker
   - Estrutura do projeto
   - Endpoints da API

4. **[DOCKER.md](DOCKER.md)** 🐳
   - Documentação completa do Docker
   - Monitoramento e logs
   - Troubleshooting avançado
   - Segurança e otimizações

## 🧪 Testes e API

5. **[API_TESTS.md](API_TESTS.md)** 🔍
   - Exemplos de requisições
   - Casos de teste
   - Respostas esperadas

## 🎓 Referências Técnicas

### Docker
- `Dockerfile` - Imagem de produção
- `Dockerfile.dev` - Imagem de desenvolvimento
- `docker-compose.yml` - Orquestração produção
- `docker-compose.dev.yml` - Orquestração desenvolvimento
- `.dockerignore` - Otimização de builds

### Configuração
- `.nvmrc` - Versão do Node.js
- `.env.example` - Template de variáveis
- `tsconfig.json` - Configuração TypeScript
- `package.json` - Dependências e scripts

### Automação
- `Makefile` - Atalhos de comandos
- `scripts/test-docker.sh` - Teste automatizado

### CI/CD
- `.github/workflows/ci.yml` - GitHub Actions

### IDE
- `.vscode/settings.json` - Configurações do editor
- `.vscode/launch.json` - Configurações de debug
- `.vscode/extensions.json` - Extensões recomendadas

## 🗺️ Fluxo de Leitura Recomendado

### Para Começar Rápido
```
DOCKER_SUMMARY.md → Execute: make docker-dev → Pronto! 🎉
```

### Para Entender Tudo
```
1. README.md (visão geral)
   ↓
2. DOCKER_QUICKSTART.md (início rápido)
   ↓
3. DOCKER.md (documentação completa)
   ↓
4. API_TESTS.md (testar API)
```

### Para Desenvolvedores
```
1. README.md (setup)
   ↓
2. src/ (código fonte)
   ↓
3. API_TESTS.md (testar)
   ↓
4. DOCKER.md (deploy)
```

## 🎯 Encontre Rápido

| Preciso de... | Veja... |
|---------------|---------|
| **Começar agora** | [DOCKER_SUMMARY.md](DOCKER_SUMMARY.md) |
| **Comandos Docker** | [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) |
| **Setup inicial** | [README.md](README.md) |
| **Documentação completa** | [DOCKER.md](DOCKER.md) |
| **Testar API** | [API_TESTS.md](API_TESTS.md) |
| **Ver comandos** | Execute: `make help` |
| **Troubleshooting** | [DOCKER.md](DOCKER.md) seção Troubleshooting |
| **CI/CD** | `.github/workflows/ci.yml` |
| **Configurar VSCode** | `.vscode/` |

## 🚀 Comandos Mais Usados

```bash
# Ver todos os comandos
make help

# Iniciar desenvolvimento
make docker-dev

# Ver logs
make logs

# Testar
make test-health

# Parar
make docker-down
```

## 📂 Estrutura do Código

```
src/
├── server.ts              # Entry point
├── app.ts                 # Express setup
├── types/                 # TypeScript types
├── routes/               # Rotas HTTP
│   └── events/
├── services/             # Lógica de negócio
│   └── events/
│       └── parsers/      # Parsers
├── repositories/         # Camada de dados
│   └── events/
└── clients/              # APIs externas
    └── sde/
```

## 🎨 Diagrama de Fluxo

```
HTTP Request
    ↓
Routes (src/routes/events/)
    ↓
Services (src/services/events/)
    ↓
    ├→ Parsers (src/services/events/parsers/)
    ↓
Repositories (src/repositories/events/)
    ↓
Clients (src/clients/sde/)
    ↓
External API (api.sde.globoi.com)
```

## 📞 Links Úteis

- **Node.js**: https://nodejs.org/
- **TypeScript**: https://www.typescriptlang.org/
- **Express**: https://expressjs.com/
- **Docker**: https://www.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/

## 💡 Dicas

1. Sempre comece com `make help`
2. Use `make docker-dev` para desenvolvimento
3. Mantenha `make logs` aberto em outro terminal
4. Leia os comentários no código
5. Teste antes de fazer commit

---

**Boa leitura! 📚**
