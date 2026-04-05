# Arquitetura proposta

## Backend

API REST em Node.js com Express e TypeScript.

Camadas previstas:

- `routes`: exposicao HTTP
- `modules`: regras por contexto de negocio
- `prisma`: modelo de dados e acesso ao PostgreSQL

Contextos iniciais:

- dashboard
- chales
- clientes
- reservas
- manutencao
- financeiro

## Frontend

Painel administrativo com Next.js App Router.

Decisoes de interface:

- MUI como design system
- tema customizado para operacao de hospedagem
- layout lateral fixo com area principal para analytics e CRUDs
- foco em leitura operacional rapida

## Fluxo esperado

1. O frontend consome a API REST
2. A API aplica regras de negocio
3. Prisma persiste no PostgreSQL
4. O dashboard consolida reservas, ocupacao, pagamentos e manutencao

## Evolucoes recomendadas

1. JWT com perfis `admin`, `recepcao`, `financeiro` e `manutencao`
2. validacoes de conflito de reserva por periodo
3. modulo de tarifacao sazonal
4. checklist operacional de limpeza
5. auditoria de alteracoes e logs
