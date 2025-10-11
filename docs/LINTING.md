# 🔍 ESLint - Guia de Uso

## 📋 Visão Geral

O projeto usa ESLint 9+ com configuração moderna (flat config) para garantir qualidade e consistência do código TypeScript.

## 🚀 Comandos Disponíveis

### Verificar Código (Lint)
```bash
npm run lint
```
Analisa todo o código TypeScript em `src/` e reporta problemas.

### Corrigir Automaticamente
```bash
npm run lint:fix
```
Corrige automaticamente problemas que podem ser resolvidos (formatação, semicolons, etc).

### Executar no CI/CD
O linter roda automaticamente no GitHub Actions antes dos testes:
```yaml
- name: Run linter
  run: npm run lint
```

## 📐 Regras Configuradas

### TypeScript Específico

#### ⚠️ Warnings (Avisos)
- **`@typescript-eslint/no-explicit-any`**: Evitar uso de `any`
  ```typescript
  // ❌ Evitar
  const data: any = fetchData();
  
  // ✅ Preferir
  const data: UserData = fetchData();
  ```

- **`@typescript-eslint/no-unsafe-assignment`**: Atribuições type-safe
- **`@typescript-eslint/no-unsafe-member-access`**: Acesso seguro a membros
- **`@typescript-eslint/no-unsafe-call`**: Chamadas type-safe

#### ❌ Errors (Erros)
- **`@typescript-eslint/no-unused-vars`**: Variáveis não utilizadas
  ```typescript
  // ❌ Error: variável não usada
  const unusedVar = 'test';
  
  // ✅ OK: prefixo _ ignora a regra
  const _unusedVar = 'test';
  
  // ✅ OK: variável usada
  const usedVar = 'test';
  console.log(usedVar);
  ```

### Boas Práticas JavaScript/TypeScript

#### ❌ Errors (Erros)
- **`prefer-const`**: Usar `const` quando variável não é reatribuída
  ```typescript
  // ❌ Error
  let name = 'John';
  console.log(name); // nunca reatribuído
  
  // ✅ OK
  const name = 'John';
  console.log(name);
  ```

- **`no-var`**: Não usar `var`, apenas `let` ou `const`
  ```typescript
  // ❌ Error
  var count = 0;
  
  // ✅ OK
  let count = 0;
  // ou
  const count = 0;
  ```

- **`eqeqeq`**: Sempre usar `===` ao invés de `==`
  ```typescript
  // ❌ Error
  if (value == null) { }
  
  // ✅ OK
  if (value === null) { }
  // ou
  if (value == null) { } // permite apenas para null check
  ```

- **`curly`**: Sempre usar chaves em blocos
  ```typescript
  // ❌ Error
  if (condition) return;
  
  // ✅ OK
  if (condition) {
    return;
  }
  ```

### Estilo de Código

#### ❌ Errors (Erros)
- **`semi`**: Semicolons obrigatórios
  ```typescript
  // ❌ Error
  const name = 'John'
  
  // ✅ OK
  const name = 'John';
  ```

- **`quotes`**: Single quotes (aspas simples)
  ```typescript
  // ❌ Error
  const name = "John";
  
  // ✅ OK
  const name = 'John';
  
  // ✅ OK: escape permitido
  const message = "It's working";
  ```

- **`comma-dangle`**: Trailing comma em multiline
  ```typescript
  // ❌ Error
  const obj = {
    name: 'John',
    age: 30
  };
  
  // ✅ OK
  const obj = {
    name: 'John',
    age: 30,
  };
  ```

## 🎯 Arquivos Ignorados

Os seguintes arquivos/pastas são automaticamente ignorados:

```
dist/          # Build output
coverage/      # Test coverage
node_modules/  # Dependencies
*.config.js    # Config files
jest.setup.js  # Jest setup
```

## 🔧 Configuração

### Arquivo: `eslint.config.js`

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // ... regras customizadas
);
```

## 📊 Integração com IDEs

### VS Code

Instale a extensão ESLint:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint"
  ]
}
```

Configuração automática em `.vscode/settings.json`:
```json
{
  "eslint.validate": ["typescript"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm / IntelliJ

ESLint já vem habilitado por padrão. Para ativar fix automático:
1. Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Marcar "Automatic ESLint configuration"
3. Marcar "Run eslint --fix on save"

## 🚨 Tratamento de Exceções

### Desabilitar Regra para Linha Específica
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = legacyApi();
```

### Desabilitar Regra para Bloco
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
const data1: any = legacyApi1();
const data2: any = legacyApi2();
/* eslint-enable @typescript-eslint/no-explicit-any */
```

### Desabilitar Regra para Arquivo Inteiro
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// Todo o arquivo...
```

⚠️ **Importante**: Use com moderação! Exceções devem ser documentadas com comentário explicando o motivo.

## 📈 Métricas de Qualidade

### Status Atual
- ✅ Linter configurado e funcionando
- ⚠️ 3 warnings no código atual (uso de `any` em testes)
- ❌ 0 errors

### Meta
- 🎯 Zero warnings em código de produção
- 🎯 Warnings permitidos apenas em testes quando necessário
- 🎯 100% de cobertura do linter em arquivos TypeScript

## 🔄 Workflow Recomendado

1. **Durante Desenvolvimento**:
   ```bash
   npm run lint:fix  # Corrige problemas automaticamente
   ```

2. **Antes de Commit**:
   ```bash
   npm run lint      # Verifica se há problemas
   npm run type-check # Verifica tipos TypeScript
   npm test          # Roda testes
   ```

3. **No CI/CD**:
   - Linter roda automaticamente
   - Build falha se houver errors
   - Warnings são permitidos mas devem ser investigados

## 📚 Recursos Adicionais

- [ESLint Official Docs](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint Rules Reference](https://eslint.org/docs/latest/rules/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)

## 🤝 Contribuindo

Ao contribuir com código:

1. ✅ Rode `npm run lint:fix` antes de commitar
2. ✅ Resolva todos os errors
3. ⚠️ Investigue warnings e resolva quando possível
4. 📝 Documente exceções com comentários claros
5. 🧪 Garanta que testes passam

---

**Mantido por**: Time de Desenvolvimento SDE Events
**Última atualização**: 2025-10-11
