# Sistema de Administracao de Chales

Base full stack para administracao de chales, reservas, manutencoes e operacao de hospedagem.

## Stack escolhida

- Backend: Node.js, Express, TypeScript, Prisma e PostgreSQL
- Frontend: Next.js, TypeScript e MUI
- Design system: MUI com tema customizado para painel administrativo

## Por que essa escolha

O backend com Express e Prisma entrega uma base simples, produtiva e facil de evoluir para regras operacionais, integracoes e autenticação.

Para o front, o MUI foi escolhido por oferecer um design system maduro, consistente e muito forte para interfaces administrativas, com componentes de tabela, formularios, navegacao, feedback e responsividade.

## Modulos previstos

- Dashboard operacional
- Cadastro de chales
- Clientes
- Reservas
- Pagamentos
- Hospedes
- Manutencao
- Bloqueios de disponibilidade
- Checklist de limpeza
- Tarifas por periodo

## Estrutura

```text
apps/
  api/  -> API REST em Node.js
  web/  -> painel admin em Next.js
script  -> esquema original fornecido
```

## Ajustes recomendados no esquema original

O arquivo `script` foi usado como base, mas ele possui alguns pontos que devem ser corrigidos antes da migracao definitiva:

- `apps.checklist_limpeza` referencia `apps.usuario(id)` usando a coluna `id`; o correto parece ser `id_usuario`
- `apps.cliente._bairro` provavelmente deveria ser `bairro`
- `apps.cliente.data_cadastro` esta como `VARCHAR`; para PostgreSQL o ideal e `TIMESTAMP`
- existem colunas com comentarios de status textuais mas tipos `INTEGER`; para o sistema, foi padronizado como `String/enum`
- existe chave estrangeira duplicada em `apps.reserva` para `id_chale`

## Requisitos

- Node.js `22`
- npm `10+`
- PostgreSQL disponivel localmente

## Como iniciar

1. Instalar dependencias com `npm install`
2. Configurar o banco PostgreSQL
3. Ajustar `apps/api/.env`
4. Gerar o client do Prisma com `npm run prisma:generate`
5. Rodar a API com `npm run dev:api`
6. Rodar o painel com `npm run dev:web`

## Scripts principais

- `npm run dev:api`: sobe a API em desenvolvimento
- `npm run dev:web`: sobe o frontend Next.js
- `npm run build`: build completo do monorepo
- `npm run typecheck`: typecheck da API e do frontend
- `npm run prisma:generate`: regenera o Prisma Client da API
- `npm run check`: executa `prisma generate`, `typecheck` e `build`

## Modos de execucao da API

Por padrao, a API sobe em modo mock para facilitar desenvolvimento inicial.

- `USE_MOCK_DATA=true`: usa dados em memoria
- `USE_MOCK_DATA=false`: usa Prisma/PostgreSQL

Quando for usar PostgreSQL real:

1. ajustar `DATABASE_URL`
2. definir `USE_MOCK_DATA=false`
3. rodar `npm run prisma:generate`
4. aplicar a estrutura do banco ou migrations

## Autenticacao inicial

Foi adicionada uma autenticacao inicial para operacoes de escrita na API.

- rota: `POST /api/auth/login`
- usuario demo: `admin@serra.local`
- senha demo: `admin123`

As rotas `POST`, `PUT` e `DELETE` de `chales`, `clientes` e `reservas` exigem `Authorization: Bearer <token>`.

## Endpoints iniciais

- `GET /health`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET|POST|PUT|DELETE /api/chales`
- `GET|POST|PUT|DELETE /api/comodidades`
- `GET|PUT /api/chales/:id/comodidades`
- `GET|POST|PUT|DELETE /api/clientes`
- `GET|POST|PUT|DELETE /api/reservas`

## Regras operacionais implementadas

- validacao de payload com `zod`
- bloqueio de reserva em chale em manutencao
- bloqueio de overbooking por conflito de datas em reservas confirmadas e hospedadas
- validacao de capacidade maxima do chale
- recalculo automatico de noites e valor total da reserva

## Status atual

- `apps/api`: `typecheck` e `build` validados
- `apps/web`: `build` validado
- frontend consumindo a API com fallback local
- backend preparado para alternar entre memoria e Prisma

## Pipeline de desenvolvimento

O repositorio agora esta integrado ao GitHub com uma base minima de desenvolvimento.

- branch principal `main` protegida no GitHub
- fluxo de entrega via branch + pull request
- workflow de CI em `.github/workflows/ci.yml`
- templates de PR e issues em `.github/`
- `Dependabot` configurado para atualizacoes semanais
- upgrades `major` de `prisma` e `@prisma/client` bloqueados no `Dependabot`
- `CODEOWNERS` configurado para `@enriponceti`

## Fluxo recomendado com GitHub

1. criar uma branch a partir da `main`
2. desenvolver e validar localmente com `npm run check`
3. fazer push da branch
4. abrir pull request
5. aguardar o `CI`
6. revisar e fazer merge na `main`

## Retomada

Ponto consolidado em 05/04/2026:

- frontend com login, sessao e CRUD autenticado para `chales`, `clientes`, `reservas` e `comodidades`
- endpoint `GET /api/reservas/detalhadas` disponivel para suporte ao painel
- API de relacionamento `chale_comodidade` implementada
- menu principal atualizado com o modulo `Comodidades`
- `apps/api/.env` configurado para PostgreSQL real com `USE_MOCK_DATA=false`
- `Prisma Client` regenerado com sucesso
- schema `apps` do PostgreSQL sincronizado
- `npm run check` validado localmente
- CI do GitHub validada em pull request e em `main`

Importante ao voltar:

- o banco `dbchale` responde em `localhost:5432`
- como `USE_MOCK_DATA=false`, as listagens reais podem aparecer vazias ate cadastrar os primeiros registros
- a branch protegida nao aceita push direto em `main`

Proximo passo recomendado:

1. subir `npm run dev:api`
2. subir `npm run dev:web`
3. validar visualmente o fluxo de `comodidades` no navegador
4. validar o vinculo de comodidades diretamente pela UI de `chales`
5. validar persistencia real no PostgreSQL para `chales`, `comodidades`, `clientes` e `reservas`

Depois disso:

1. validar criacao de um `chale`
2. validar criacao de uma `comodidade`
3. validar criacao de um `cliente`
4. validar criacao e edicao de uma `reserva`

## Proximos passos recomendados

1. Gerar as migrations Prisma a partir do schema final
2. Implementar autenticacao com JWT e controle por perfil
3. Conectar as telas do frontend aos endpoints reais
4. Adicionar testes de regras de reserva, conflito de datas e faturamento
