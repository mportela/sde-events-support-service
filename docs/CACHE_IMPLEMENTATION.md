# 💾 Implementação de Cache LRU (Least Recently Used)

## Visão Geral

Esta documentação detalha a implementação de um cache LRU (Least Recently Used) em memória para otimizar as requisições à API do SDE, reduzindo chamadas externas e melhorando o tempo de resposta.

## O Que Foi Implementado

### 1. LRUCache Genérico (`src/utils/cache/LRUCache.ts`)

Implementação customizada de cache LRU que pode ser utilizada em qualquer parte da aplicação:

```typescript
export class LRUCache<K, V> {
  constructor(maxSize: number = 20)
  get(key: K): V | undefined
  set(key: K, value: V): void
  has(key: K): boolean
  delete(key: K): boolean
  clear(): void
  keys(): K[]
  getStats(): { size: number; capacity: number; usage: string }
}
```

#### Características

| Característica | Descrição |
|----------------|-----------|
| **Capacidade** | 20 entradas por padrão (configurável) |
| **Algoritmo** | LRU - Remove automaticamente a entrada menos recentemente usada |
| **Genérico** | Suporta qualquer tipo de chave (K) e valor (V) |
| **Logs** | HIT, MISS, EVICTION para monitoramento |
| **Type-Safe** | Totalmente tipado com TypeScript |

### 2. Integração no SDE Client

O cache foi integrado diretamente no cliente SDE para cach opções de API por data:

```typescript
// src/clients/sde/index.ts
import LRUCache from '../../utils/cache/LRUCache.js';

const responseCache = new LRUCache<string, any>(20);

const sdeClient = {
  async getEvents(date: string): Promise<any> {
    // 1. Verifica se está em cache
    const cachedResponse = responseCache.get(date);
    if (cachedResponse !== undefined) {
      return cachedResponse; // ⚡ Retorna instantaneamente
    }

    // 2. Se não está em cache, faz a requisição
    const data = await fetch(url, options);
    
    // 3. Armazena no cache para próximas requisições
    responseCache.set(date, data);
    
    return data;
  }
};
```

## Como Funciona

### Fluxo de Requisição com Cache

```
┌─────────────────────────────────────────────────────────────┐
│ Cliente faz requisição: GET /events/2025-10-11              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │ Verifica no Cache   │
         │ (LRU Cache)         │
         └──────┬──────┬───────┘
                │      │
         CACHE  │      │  CACHE
          HIT   │      │   MISS
                │      │
                ▼      ▼
         ┌──────────┐  ┌──────────────────┐
         │ Retorna  │  │ Faz requisição   │
         │ do Cache │  │ à API do SDE     │
         └──────────┘  └────┬─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Armazena no  │
                     │ Cache        │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Retorna para │
                     │ o cliente    │
                     └──────────────┘
```

### Algoritmo LRU

```
Cache com capacidade 3:

1. set('A', dataA)  →  [A]                    (size: 1/3)
2. set('B', dataB)  →  [A, B]                 (size: 2/3)
3. set('C', dataC)  →  [A, B, C]              (size: 3/3) CHEIO
4. get('A')         →  [B, C, A]              (A move para o final - mais recente)
5. set('D', dataD)  →  [C, A, D]              (B é removido - mais antigo)
                        ↑ Evicted

┌──────────────────────────────────────────────────────┐
│ Mais antigo (será removido primeiro)  →  Mais recent│
│ (Least Recently Used)          →  (Most Recently Used│
└──────────────────────────────────────────────────────┘
```

## API do LRUCache

### Constructor

```typescript
const cache = new LRUCache<string, any>(20);
```

- **Parâmetro**: `maxSize` (default: 20) - Capacidade máxima do cache
- **Retorna**: Instância do LRUCache
- **Throws**: Error se `maxSize <= 0`

### Métodos

#### `get(key: K): V | undefined`

Obtém um valor do cache e atualiza sua posição (move para o final - mais recente).

```typescript
const data = cache.get('2025-10-11');
if (data !== undefined) {
  // Cache HIT - usar data
} else {
  // Cache MISS - buscar de outra fonte
}
```

#### `set(key: K, value: V): void`

Adiciona ou atualiza um valor no cache. Remove a entrada mais antiga se necessário.

```typescript
cache.set('2025-10-11', responseData);
```

#### `has(key: K): boolean`

Verifica se uma chave existe no cache (NÃO afeta a ordem LRU).

```typescript
if (cache.has('2025-10-11')) {
  // Chave existe
}
```

#### `delete(key: K): boolean`

Remove uma entrada específica do cache.

```typescript
const deleted = cache.delete('2025-10-11');
// deleted = true se removeu, false se não existia
```

#### `clear(): void`

Remove todas as entradas do cache.

```typescript
cache.clear(); // Cache vazio
```

#### `keys(): K[]`

Retorna todas as chaves (da mais antiga para a mais recente).

```typescript
const keys = cache.keys();
// ['2025-10-01', '2025-10-02', '2025-10-03']
// ↑ Mais antiga    ↑ Mais recente
```

#### `getStats(): { size: number; capacity: number; usage: string }`

Retorna estatísticas do cache.

```typescript
const stats = cache.getStats();
// {
//   size: 15,
//   capacity: 20,
//   usage: '75.0%'
// }
```

## API do SDE Client

### `clearCache(): void`

Limpa todo o cache de respostas da API do SDE.

```typescript
import sdeClient from './clients/sde/index.js';

sdeClient.clearCache();
console.log('Cache limpo!');
```

**Casos de uso**:
- Após deploy de nova versão
- Para forçar atualização dos dados
- Em testes unitários (beforeEach)

### `getCacheStats()`

Retorna estatísticas do cache.

```typescript
const stats = sdeClient.getCacheStats();
console.log(`Cache: ${stats.size}/${stats.capacity} (${stats.usage})`);
// Output: Cache: 15/20 (75.0%)
```

## Exemplos de Uso

### Exemplo 1: Requisições Repetidas

```typescript
// Primeira requisição - Cache MISS
const events1 = await sdeClient.getEvents('2025-10-11');
// [SdeClient] Calling SDE API: ...
// [SdeClient] Successfully fetched data from SDE API
// [LRUCache] Set key: 2025-10-11 (size: 1/20)

// Segunda requisição - Cache HIT
const events2 = await sdeClient.getEvents('2025-10-11');
// [LRUCache] Cache HIT for key: 2025-10-11
// [SdeClient] Returning cached response for date: 2025-10-11
// ⚡ Retorno instantâneo, sem requisição externa!
```

### Exemplo 2: Múltiplas Datas

```typescript
// Cacheia 3 datas diferentes
await sdeClient.getEvents('2025-10-11'); // API call
await sdeClient.getEvents('2025-10-12'); // API call
await sdeClient.getEvents('2025-10-13'); // API call

// Busca novamente - todas vêm do cache
await sdeClient.getEvents('2025-10-11'); // From cache
await sdeClient.getEvents('2025-10-12'); // From cache
await sdeClient.getEvents('2025-10-13'); // From cache

const stats = sdeClient.getCacheStats();
// { size: 3, capacity: 20, usage: '15.0%' }
```

### Exemplo 3: Eviction Automático

```typescript
// Preenche o cache com 20 datas (limite)
for (let i = 1; i <= 20; i++) {
  await sdeClient.getEvents(`2025-10-${String(i).padStart(2, '0')}`);
}

const stats1 = sdeClient.getCacheStats();
// { size: 20, capacity: 20, usage: '100.0%' }

// Adiciona 21ª data - remove a mais antiga (2025-10-01)
await sdeClient.getEvents('2025-10-21');
// [LRUCache] Evicted oldest entry: 2025-10-01
// [LRUCache] Set key: 2025-10-21 (size: 20/20)

// 2025-10-01 foi removida, precisa buscar novamente
await sdeClient.getEvents('2025-10-01'); // API call
```

### Exemplo 4: Monitoramento de Performance

```typescript
import sdeClient from './clients/sde/index.js';

// Middleware para logar estatísticas do cache
app.use('/events/:date', async (req, res, next) => {
  const before = sdeClient.getCacheStats();
  
  await next();
  
  const after = sdeClient.getCacheStats();
  console.log(`Cache ${before.usage} → ${after.usage}`);
});
```

## Logs do Cache

O cache emite logs detalhados para debugging e monitoramento:

### Cache HIT

```log
[LRUCache] Cache HIT for key: 2025-10-11
[SdeClient] Returning cached response for date: 2025-10-11
```

**Significado**: Resposta encontrada no cache, retornada instantaneamente.

### Cache MISS

```log
[LRUCache] Cache MISS for key: 2025-10-11
[SdeClient] Calling SDE API: https://api.sde.globoi.com/data/2025-10-11/eventos
[SdeClient] Successfully fetched data from SDE API
[LRUCache] Set key: 2025-10-11 (size: 1/20)
```

**Significado**: Resposta não encontrada, requisição feita à API externa e armazenada no cache.

### Eviction (Remoção)

```log
[LRUCache] Evicted oldest entry: 2025-10-01
[LRUCache] Set key: 2025-10-21 (size: 20/20)
```

**Significado**: Cache cheio, entrada mais antiga removida para dar espaço à nova.

### Clear Cache

```log
[LRUCache] Cache cleared
```

**Significado**: Todas as entradas foram removidas do cache.

## Testes

### Suite de Testes do LRUCache

**30 testes unitários** cobrindo todas as funcionalidades:

```typescript
describe('LRUCache', () => {
  // Constructor (4 testes)
  - should create cache with default capacity of 20
  - should create cache with custom capacity
  - should throw error if capacity is zero
  - should throw error if capacity is negative

  // Set and Get (4 testes)
  - should store and retrieve a value
  - should return undefined for non-existent key
  - should update existing key
  - should store objects and arrays

  // LRU Eviction (3 testes)
  - should evict least recently used item when full
  - should update access order when getting an item
  - should handle multiple evictions correctly

  // Has (3 testes)
  - should return true for existing key
  - should return false for non-existent key
  - should not affect LRU order

  // Delete (3 testes)
  - should delete existing key
  - should return false when deleting non-existent key
  - should allow adding after deletion

  // Clear (2 testes)
  - should remove all entries
  - should allow adding after clear

  // Size and Capacity (2 testes)
  - should track size correctly
  - should maintain capacity

  // Keys (3 testes)
  - should return empty array for empty cache
  - should return all keys in LRU order
  - should reflect order after access

  // GetStats (3 testes)
  - should return correct statistics
  - should calculate usage percentage correctly
  - should show 100% usage when full

  // Edge Cases (3 testes)
  - should handle cache of size 1
  - should handle null and undefined values
  - should handle numeric keys
});
```

### Suite de Testes do SDE Client Cache

**6 testes de integração**:

```typescript
describe('Cache LRU', () => {
  - should return cached response on second call
  - should cache different dates separately
  - should evict oldest entry when cache is full (20 entries)
  - should not cache when request fails
  - should clear cache when clearCache is called
  - should return correct cache statistics
});
```

### Executar Testes

```bash
# Todos os testes
npm test

# Apenas testes do cache
npm test -- LRUCache

# Com cobertura
npm run test:coverage
```

## Métricas de Performance

### Antes do Cache

```
┌────────────────────────────────────────────────┐
│ Todas as requisições fazem chamadas externas  │
│ Tempo de resposta: ~200-500ms por requisição  │
│ Carga na API do SDE: Alta                     │
└────────────────────────────────────────────────┘

Request 1: GET /events/2025-10-11  →  500ms (API call)
Request 2: GET /events/2025-10-11  →  500ms (API call)
Request 3: GET /events/2025-10-11  →  500ms (API call)

Total: 1500ms para 3 requisições
```

### Depois do Cache

```
┌────────────────────────────────────────────────┐
│ Primeira requisição cacheia, próximas          │
│ retornam instantaneamente                      │
│ Tempo de resposta cache: ~1-5ms               │
│ Carga na API do SDE: Reduzida drasticamente   │
└────────────────────────────────────────────────┘

Request 1: GET /events/2025-10-11  →  500ms (API call + cache)
Request 2: GET /events/2025-10-11  →  5ms   (from cache)
Request 3: GET /events/2025-10-11  →  5ms   (from cache)

Total: 510ms para 3 requisições
Economia: ~66% do tempo total
```

## Configuração

### Alterar Capacidade do Cache

Edite `src/clients/sde/index.ts`:

```typescript
// Padrão: 20 entradas
const responseCache = new LRUCache<string, any>(20);

// Aumentar para 50 entradas
const responseCache = new LRUCache<string, any>(50);

// Reduzir para 10 entradas
const responseCache = new LRUCache<string, any>(10);
```

### Desabilitar Cache (Desenvolvimento)

```typescript
// Opção 1: Limpar cache a cada requisição
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sdeClient.clearCache();
  }
  next();
});

// Opção 2: Usar capacidade 0 (sempre MISS)
const responseCache = new LRUCache<string, any>(1);
```

## Considerações de Produção

### Quando Limpar o Cache

- **Deploy de nova versão**: Dados podem ter mudado
- **Atualização manual dos dados**: Forçar refresh
- **Erro na API externa**: Evitar cache de erros
- **Testes**: Garantir isolamento

### Monitoramento

Adicione métricas ao seu sistema de observabilidade:

```typescript
// Exemplo com Prometheus
const cacheHitCounter = new Counter({
  name: 'sde_cache_hits_total',
  help: 'Total de cache hits'
});

const cacheMissCounter = new Counter({
  name: 'sde_cache_misses_total',
  help: 'Total de cache misses'
});

// No LRUCache.get()
if (value !== undefined) {
  cacheHitCounter.inc();
} else {
  cacheMissCounter.inc();
}
```

### Gestão de Memória

```typescript
// Calcular memória usada aproximadamente
const stats = sdeClient.getCacheStats();
const avgResponseSize = 50 * 1024; // 50KB por resposta
const memoryUsed = stats.size * avgResponseSize;
console.log(`Memória estimada: ${(memoryUsed / 1024 / 1024).toFixed(2)} MB`);
```

**Capacidade 20 × 50KB = ~1MB** de memória RAM

## Limitações e Trade-offs

### ✅ Vantagens

- Reduz latência drasticamente para dados já consultados
- Diminui carga na API externa (SDE)
- Implementação simples e testável
- Zero dependências externas
- Type-safe com TypeScript

### ⚠️ Limitações

- **Cache em memória**: Perdido ao reiniciar o servidor
- **Não distribuído**: Cada instância tem seu próprio cache
- **Tamanho fixo**: 20 entradas (configurável, mas fixo em runtime)
- **Sem TTL**: Entradas não expiram por tempo, apenas por LRU
- **Sem persistência**: Não sobrevive a crashes/deploys

### 🔄 Alternativas Futuras

Para ambientes de produção de alta escala, considere:

- **Redis**: Cache distribuído com TTL e persistência
- **Memcached**: Cache distribuído simples
- **Node-cache**: Com TTL automático
- **TTL no LRUCache**: Adicionar expiração por tempo

## Troubleshooting

### Problema: Cache não está funcionando

**Sintoma**: Todas as requisições fazem chamadas externas

**Solução**:
```typescript
// Verifique se o cache não está sendo limpo
const stats = sdeClient.getCacheStats();
console.log('Cache stats:', stats);

// Verifique os logs
// Deve aparecer [LRUCache] Cache HIT após primeira requisição
```

### Problema: Memória crescendo indefinidamente

**Sintoma**: Uso de memória aumenta constantemente

**Causa**: Cache muito grande ou vazamento de memória

**Solução**:
```typescript
// Reduza a capacidade
const responseCache = new LRUCache<string, any>(10);

// Ou limpe periodicamente
setInterval(() => {
  sdeClient.clearCache();
}, 60 * 60 * 1000); // A cada 1 hora
```

### Problema: Dados desatualizados retornados

**Sintoma**: Cliente recebe dados antigos

**Causa**: Cache armazenando dados que foram atualizados na fonte

**Solução**:
```typescript
// Limpe o cache após atualizações
async function updateSdeData(date: string, newData: any) {
  // Atualiza na fonte
  await updateDataSource(date, newData);
  
  // Limpa o cache
  sdeClient.clearCache();
}
```

## Referências

- [LRU Cache Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU)
- [JavaScript Map - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

## Changelog

**Versão 1.4.0** - 11/10/2025
- ✅ Implementação inicial do LRUCache genérico
- ✅ Integração no SDE Client
- ✅ 36 testes unitários e de integração
- ✅ Documentação completa
- ✅ Logs detalhados (HIT/MISS/EVICTION)
- ✅ API de estatísticas e gestão do cache
