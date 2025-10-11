# Guia de Testes - SDE Events Support Service

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando os Testes](#executando-os-testes)
- [Cobertura de Testes](#cobertura-de-testes)
- [Escrevendo Novos Testes](#escrevendo-novos-testes)
- [Boas Práticas](#boas-práticas)
- [Mocking](#mocking)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Este projeto segue a metodologia **TDD (Test-Driven Development)** e utiliza **Jest** como framework de testes. A estrutura de testes cobre todas as camadas da aplicação:

- ✅ **Types**: Validação de estruturas de dados
- ✅ **Clients**: Comunicação com APIs externas
- ✅ **Repositories**: Camada de acesso a dados
- ✅ **Services**: Lógica de negócio
- ✅ **Parsers**: Transformação de dados
- ✅ **Routes**: Endpoints HTTP (testes de integração)
- ✅ **App**: Testes da aplicação completa

## 📁 Estrutura de Testes

```
src/
├── __tests__/
│   └── app.test.ts                          # Testes da aplicação principal
├── types/
│   └── __tests__/
│       └── event.types.test.ts              # Validação de interfaces
├── clients/
│   └── sde/
│       └── __tests__/
│           └── index.test.ts                # Testes do cliente SDE API
├── repositories/
│   └── events/
│       └── __tests__/
│           └── index.test.ts                # Testes do repositório
├── services/
│   └── events/
│       ├── __tests__/
│       │   └── index.test.ts                # Testes do serviço
│       └── parsers/
│           └── __tests__/
│               └── eventParser.test.ts      # Testes do parser
└── routes/
    └── events/
        └── __tests__/
            └── index.test.ts                # Testes de integração das rotas
```

## 🚀 Executando os Testes

### Instalar Dependências

```bash
npm install
```

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration
```

### Executar Testes Específicos

```bash
# Testar um arquivo específico
npm test -- src/clients/sde/__tests__/index.test.ts

# Testar por padrão de nome
npm test -- --testNamePattern="should return events successfully"

# Testar com verbose
npm test -- --verbose
```

## 📊 Cobertura de Testes

### Métricas de Cobertura

O projeto exige **70% de cobertura mínima** em:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Visualizar Cobertura

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Abrir relatório HTML no navegador
open coverage/lcov-report/index.html
```

### Relatório de Cobertura

Após executar `npm run test:coverage`, você verá:

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.23 |    78.45 |   90.12 |   86.34 |
 clients/sde        |   92.31 |    85.71 |  100.00 |   92.31 | 45-48
 repositories       |   88.89 |    75.00 |  100.00 |   88.89 | 23
 services/events    |   95.45 |    90.00 |  100.00 |   95.45 | 67
 parsers            |   87.50 |    82.14 |   91.67 |   88.24 | 89,102-105
 routes/events      |   90.48 |    85.71 |  100.00 |   91.67 | 34,45
--------------------|---------|----------|---------|---------|-------------------
```

## ✍️ Escrevendo Novos Testes

### Template Básico de Teste

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Nome do Componente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Funcionalidade Específica', () => {
    it('should realizar ação esperada', () => {
      // Arrange: Preparar dados
      const input = 'teste';

      // Act: Executar ação
      const result = funcaoTeste(input);

      // Assert: Verificar resultado
      expect(result).toBe('esperado');
    });
  });
});
```

### Teste com Mock de Função

```typescript
import { jest } from '@jest/globals';

jest.mock('../../../clients/sde/index.js', () => ({
  default: {
    getEvents: jest.fn()
  }
}));

const mockClient = sdeClient as jest.Mocked<typeof sdeClient>;

it('should call client with correct parameters', async () => {
  mockClient.getEvents.mockResolvedValueOnce(mockData);

  const result = await repository.getEventsByDate('2025-10-11');

  expect(mockClient.getEvents).toHaveBeenCalledWith('2025-10-11');
  expect(result).toEqual(mockData);
});
```

### Teste de Integração com Supertest

```typescript
import request from 'supertest';
import app from '../app.js';

it('should return 200 for valid request', async () => {
  const response = await request(app)
    .get('/events/2025-10-11')
    .expect(200)
    .expect('Content-Type', /json/);

  expect(response.body).toBeInstanceOf(Array);
});
```

## 🎯 Boas Práticas

### 1. Nomenclatura de Testes

✅ **Bom**:
```typescript
it('should return events successfully for valid date', async () => {
  // teste
});
```

❌ **Evitar**:
```typescript
it('test 1', async () => {
  // teste
});
```

### 2. Organize Testes por Cenário

```typescript
describe('EventParser', () => {
  describe('parseApiResponse', () => {
    describe('when data is valid', () => {
      it('should parse complete event data', () => {});
      it('should extract escudos from teams', () => {});
    });

    describe('when data is missing', () => {
      it('should handle missing team data', () => {});
      it('should handle missing championship', () => {});
    });
  });
});
```

### 3. Use Arrange-Act-Assert (AAA)

```typescript
it('should format date correctly', () => {
  // Arrange
  const date = new Date('2025-10-11T21:30:00');

  // Act
  const formatted = formatDate(date);

  // Assert
  expect(formatted).toBe('2025-10-11T21:30:00');
});
```

### 4. Teste Edge Cases

```typescript
describe('Date Validation', () => {
  it('should accept leap year dates', async () => {
    await request(app).get('/events/2024-02-29').expect(200);
  });

  it('should reject non-leap year February 29', async () => {
    await request(app).get('/events/2025-02-29').expect(400);
  });

  it('should reject invalid month', async () => {
    await request(app).get('/events/2025-13-01').expect(400);
  });
});
```

### 5. Limpe Mocks entre Testes

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## 🎭 Mocking

### Mock de Módulo Completo

```typescript
jest.mock('../../../clients/sde/index.js', () => ({
  default: {
    getEvents: jest.fn()
  }
}));
```

### Mock de Fetch Global

```typescript
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
  ok: true,
  json: async () => mockData
} as Response);
```

### Mock de Classe com Estado

```typescript
const mockParser = {
  parseApiResponse: jest.fn(),
  clearReferences: jest.fn()
};

jest.mock('../parsers/eventParser.js', () => ({
  default: mockParser
}));
```

### Spy em Função Existente

```typescript
const consoleSpy = jest.spyOn(console, 'error');

// Executar código

expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error'));

consoleSpy.mockRestore();
```

## 🛠️ Troubleshooting

### Problema: "Cannot find module '@jest/globals'"

**Solução**: Execute `npm install` para instalar as dependências.

```bash
npm install
```

### Problema: Testes falhando com erro de ESM

**Solução**: Certifique-se de usar as flags corretas:

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

### Problema: Mock não está funcionando

**Verificações**:

1. Mock está declarado antes da importação?
2. Está usando o caminho correto com `.js`?
3. Limpou os mocks com `jest.clearAllMocks()`?

```typescript
// ✅ Correto: Mock antes da importação
jest.mock('../../../clients/sde/index.js');
import sdeClient from '../../../clients/sde/index.js';

// ❌ Errado: Importação antes do mock
import sdeClient from '../../../clients/sde/index.js';
jest.mock('../../../clients/sde/index.js');
```

### Problema: Cobertura não atinge 70%

**Soluções**:

1. Identifique linhas não cobertas no relatório
2. Adicione testes para edge cases
3. Teste cenários de erro

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Problema: Testes lentos

**Otimizações**:

1. Use `jest.mock()` para mockar dependências externas
2. Evite chamadas reais a APIs
3. Execute testes em paralelo (padrão do Jest)

```bash
# Executar com mais workers
npm test -- --maxWorkers=4
```

## 📈 Métricas de Qualidade

### Indicadores de Sucesso

- ✅ Cobertura > 70% em todas as métricas
- ✅ Todos os testes passando
- ✅ Tempo de execução < 30 segundos
- ✅ Zero falhas no CI/CD

### Metas de Cobertura por Camada

| Camada       | Meta de Cobertura |
|--------------|-------------------|
| Types        | 100%              |
| Clients      | 90%               |
| Repositories | 85%               |
| Services     | 90%               |
| Parsers      | 95%               |
| Routes       | 85%               |

## 🔗 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://testingjavascript.com/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Jest Mocking Guide](https://jestjs.io/docs/mock-functions)

## 🤝 Contribuindo com Testes

Ao adicionar novos recursos:

1. ✅ Escreva testes primeiro (TDD)
2. ✅ Cubra casos de sucesso e erro
3. ✅ Adicione edge cases
4. ✅ Mantenha cobertura > 70%
5. ✅ Execute testes localmente antes de commit

```bash
# Antes de fazer commit
npm run test:coverage
npm run type-check
npm run lint
```

---

**Última atualização**: Janeiro 2025
**Mantido por**: Time de Desenvolvimento
