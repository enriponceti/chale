# Exemplos de uso da API

Base local:

```text
http://localhost:3333
```

## Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@serra.local",
    "senha": "admin123"
  }'
```

## Criar chale

```bash
curl -X POST http://localhost:3333/api/chales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "codigo": "CH-010",
    "nome": "Chale Lago Azul",
    "descricao": "Unidade com vista para o lago",
    "status": "ativo",
    "capacidadeMaxima": 4,
    "valorDiariaBase": 890,
    "localizacaoInterna": "Lago Leste"
  }'
```

## Criar cliente

```bash
curl -X POST http://localhost:3333/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nomeCompleto": "Juliana Alves",
    "email": "juliana@example.com",
    "celular": "(85) 99999-5555",
    "cidade": "Fortaleza",
    "status": "ativo"
  }'
```

## Criar reserva

```bash
curl -X POST http://localhost:3333/api/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "idChale": 1,
    "idCliente": 1,
    "dataCheckinPrevisto": "2026-04-12",
    "dataCheckoutPrevisto": "2026-04-15",
    "qtdAdultos": 2,
    "qtdCriancas": 1,
    "valorDiariaAplicada": 650,
    "valorDesconto": 0,
    "valorTaxaLimpeza": 50,
    "valorTaxaExtra": 0,
    "statusReserva": "confirmada",
    "origemReserva": "site",
    "observacao": "Cliente solicitou check-in tardio"
  }'
```

## Regras implementadas

- nao permite reservar chale em manutencao
- valida a capacidade maxima
- recalcula noites automaticamente
- recalcula valor total da reserva
- impede conflito de datas com reservas `confirmada` e `hospedado`
