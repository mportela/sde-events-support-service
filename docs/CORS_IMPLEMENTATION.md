# 🌐 Implementação de CORS

## Visão Geral

Esta documentação detalha a implementação de CORS (Cross-Origin Resource Sharing) no serviço SDE Events Support, permitindo que a API seja consumida por frontends hospedados em diferentes origens.

## O Que Foi Implementado

### Middleware CORS Customizado

Foi implementado um middleware customizado no `src/app.ts` que adiciona automaticamente os headers CORS em todas as respostas HTTP.

```typescript
// Middleware CORS - Adiciona headers em todas as respostas
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

### Headers CORS Configurados

| Header | Valor | Descrição |
|--------|-------|-----------|
| `Access-Control-Allow-Origin` | `*` | Permite requisições de qualquer origem |
| `Access-Control-Allow-Methods` | `GET, POST, PUT, DELETE, OPTIONS` | Métodos HTTP permitidos |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization` | Headers permitidos nas requisições |

## Posicionamento do Middleware

O middleware CORS foi estrategicamente posicionado na cadeia de middlewares:

```
1. express.json()           ← Parser JSON
2. CORS middleware          ← Headers CORS (NOVO)
3. Healthcheck route        ← GET /healthcheck
4. Events routes            ← GET /events/:date
5. 404 handler              ← Erros 404
6. Error handler            ← Erros 500
```

Esta ordem garante que:
- ✅ Headers CORS são aplicados a **todas as rotas**
- ✅ Headers CORS são aplicados a **respostas de erro** (404, 500)
- ✅ Headers CORS são aplicados **antes** de qualquer processamento de rota

## Testes Unitários

### Cobertura de Testes CORS

Foram implementados **6 testes unitários** específicos para validar o comportamento do CORS:

#### 1. **Healthcheck com CORS**
```typescript
it('should include Access-Control-Allow-Origin header on healthcheck', async () => {
  const response = await request(app).get('/healthcheck').expect(200);
  expect(response.headers['access-control-allow-origin']).toBe('*');
});
```

#### 2. **Endpoint de Events com CORS**
```typescript
it('should include Access-Control-Allow-Origin header on events endpoint', async () => {
  mockGetEventsByDate.mockResolvedValueOnce([]);
  const response = await request(app).get('/events/2025-10-11').expect(200);
  expect(response.headers['access-control-allow-origin']).toBe('*');
});
```

#### 3. **Header Access-Control-Allow-Methods**
```typescript
it('should include Access-Control-Allow-Methods header', async () => {
  const response = await request(app).get('/healthcheck').expect(200);
  expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE, OPTIONS');
});
```

#### 4. **Header Access-Control-Allow-Headers**
```typescript
it('should include Access-Control-Allow-Headers header', async () => {
  const response = await request(app).get('/healthcheck').expect(200);
  expect(response.headers['access-control-allow-headers']).toBe('Content-Type, Authorization');
});
```

#### 5. **CORS em Respostas 404**
```typescript
it('should include CORS headers on 404 responses', async () => {
  const response = await request(app).get('/unknown-route').expect(404);
  expect(response.headers['access-control-allow-origin']).toBe('*');
  expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE, OPTIONS');
  expect(response.headers['access-control-allow-headers']).toBe('Content-Type, Authorization');
});
```

#### 6. **CORS em Respostas de Erro (500)**
```typescript
it('should include CORS headers on error responses', async () => {
  mockGetEventsByDate.mockRejectedValueOnce(new Error('Service error'));
  const response = await request(app).get('/events/2025-10-11').expect(500);
  expect(response.headers['access-control-allow-origin']).toBe('*');
});
```

### Resultados dos Testes

```bash
CORS Headers
  ✓ should include Access-Control-Allow-Origin header on healthcheck (1 ms)
  ✓ should include Access-Control-Allow-Origin header on events endpoint (1 ms)
  ✓ should include Access-Control-Allow-Methods header (1 ms)
  ✓ should include Access-Control-Allow-Headers header (1 ms)
  ✓ should include CORS headers on 404 responses (1 ms)
  ✓ should include CORS headers on error responses (15 ms)
```

**Todos os 6 testes passando! ✅**

## Estatísticas de Cobertura

Após a implementação do CORS e seus testes:

| Métrica | Cobertura | Status |
|---------|-----------|--------|
| **Statements** | 98.14% | ✅ Excelente |
| **Branches** | 87.83% | ✅ Ótimo |
| **Functions** | 100% | ✅ Perfeito |
| **Lines** | 99.05% | ✅ Excelente |

### Cobertura por Arquivo

| Arquivo | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| `src/app.ts` | 100% | 75% | 100% | 100% |
| `src/clients/sde/index.ts` | 100% | 83.33% | 100% | 100% |
| `src/repositories/events/index.ts` | 100% | 100% | 100% | 100% |
| `src/routes/events/index.ts` | 100% | 100% | 100% | 100% |
| `src/services/events/index.ts` | 100% | 80% | 100% | 100% |
| `src/services/events/parsers/eventParser.ts` | 95.55% | 89.28% | 100% | 97.67% |

## Impacto nos Testes

### Antes da Implementação CORS
- **Total de Testes**: 55
- **Taxa de Sucesso**: 100% (55/55)

### Depois da Implementação CORS
- **Total de Testes**: 61 (+6 testes CORS)
- **Taxa de Sucesso**: 100% (61/61)
- **Tempo de Execução**: ~0.7s

## Como Usar

### Requisição sem CORS (Antes)

```bash
curl -X GET http://localhost:3000/healthcheck
```

❌ Erro no browser: `CORS policy: No 'Access-Control-Allow-Origin' header`

### Requisição com CORS (Depois)

```bash
curl -X GET http://localhost:3000/healthcheck

# Response Headers:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization
```

✅ Sucesso! Frontend pode consumir a API de qualquer origem

### Exemplo de Uso em Frontend

```javascript
// React / Next.js / JavaScript puro
fetch('http://localhost:3000/events/2025-10-11')
  .then(response => response.json())
  .then(data => {
    console.log('Events:', data.events);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Exemplo com Authorization Header

```javascript
fetch('http://localhost:3000/events/2025-10-11', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## Considerações de Segurança

### Ambiente de Desenvolvimento

Atualmente configurado com `Access-Control-Allow-Origin: *`:
- ✅ Permite desenvolvimento rápido
- ✅ Testes de diferentes origens
- ✅ Protótipos e demos

### Ambiente de Produção (Recomendações)

Para produção, considere restringir as origens:

```typescript
// Opção 1: Lista específica de origens
const allowedOrigins = [
  'https://app.exemplo.com',
  'https://admin.exemplo.com'
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Opção 2: Usar variável de ambiente
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

## Troubleshooting

### Problema: Browser ainda bloqueia requisições

**Solução**: Verifique se o middleware CORS está **antes** das rotas:

```typescript
// ❌ ERRADO - CORS depois das rotas
app.use('/events', eventsRoutes);
app.use(corsMiddleware); // Não vai funcionar!

// ✅ CORRETO - CORS antes das rotas
app.use(corsMiddleware);
app.use('/events', eventsRoutes);
```

### Problema: Preflight OPTIONS requests falhando

**Solução**: Adicione handler específico para OPTIONS:

```typescript
app.options('*', (_req, res) => {
  res.status(200).end();
});
```

### Problema: Headers customizados não são permitidos

**Solução**: Adicione o header ao `Access-Control-Allow-Headers`:

```typescript
res.setHeader(
  'Access-Control-Allow-Headers', 
  'Content-Type, Authorization, X-Custom-Header'
);
```

## Referências

- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [W3C CORS Specification](https://www.w3.org/TR/cors/)

## Próximos Passos

- [ ] Configurar origens específicas para produção
- [ ] Adicionar suporte a cookies com `Access-Control-Allow-Credentials`
- [ ] Implementar preflight caching com `Access-Control-Max-Age`
- [ ] Monitorar logs de requisições cross-origin
- [ ] Considerar uso do pacote `cors` npm para configurações avançadas

## Changelog

**Versão 1.3.0** - 11/10/2025
- ✅ Implementação inicial do middleware CORS
- ✅ 6 testes unitários criados
- ✅ Documentação completa
- ✅ Cobertura 98.14% statements, 87.83% branches, 100% functions
