# Testes das APIs

## Health Check
```bash
curl http://localhost:3001/healthcheck
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-10-11T..."
}
```

## Get Events
```bash
curl http://localhost:3001/events/2025-10-11
```

Resposta esperada:
```json
{
  "events": [
    {
      "id": "12345",
      "nome": "Flamengo x Palmeiras",
      "esporte": {
        "id": "1",
        "slug": "futebol",
        "nome": "Futebol"
      },
      "competicao": {
        "nome": "Brasileirão Série A"
      },
      "times": [
        {
          "nome": "Flamengo",
          "sigla": "FLA"
        },
        {
          "nome": "Palmeiras",
          "sigla": "PAL"
        }
      ],
      "dataHora": "2025-10-01T21:30:00Z"
    }
  ]
}
```

## Teste de data inválida
```bash
curl http://localhost:3001/events/invalid-date
```

Resposta esperada:
```json
{
  "error": "Invalid date format. Expected YYYY-MM-DD"
}
```

## Teste de rota não existente
```bash
curl http://localhost:3001/nao-existe
```

Resposta esperada:
```json
{
  "error": "Route not found"
}
```
