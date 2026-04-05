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

## Como iniciar

1. Configurar o banco PostgreSQL
2. Ajustar `apps/api/.env`
3. Instalar dependencias com `npm install`
4. Rodar a API com `npm run dev:api`
5. Rodar o painel com `npm run dev:web`

## Modos de execucao da API

Por padrao, a API sobe em modo mock para facilitar desenvolvimento inicial.

- `USE_MOCK_DATA=true`: usa dados em memoria
- `USE_MOCK_DATA=false`: usa Prisma/PostgreSQL

Quando for usar PostgreSQL real:

1. ajustar `DATABASE_URL`
2. definir `USE_MOCK_DATA=false`
3. rodar `npx prisma generate --schema apps/api/prisma/schema.prisma`
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

## Atualizacao da retomada

Ponto atualizado em 03/04/2026:

- tela de login implementada no frontend
- token da API armazenado no painel
- rotas protegidas no frontend com redirecionamento para `/login`
- operacoes de `POST`, `PUT` e `DELETE` conectadas no frontend para `chales`, `clientes` e `reservas`
- endpoint adicional `GET /api/reservas/detalhadas` criado para suportar edicao de reservas no painel
- CRUD de `comodidades` implementado na API
- relacionamento `chale_comodidade` implementado na API e conectado ao menu de acoes de `chales`
- novo modulo `Comodidades` criado no menu principal com listagem em tabela, cadastro, edicao e exclusao
- layout administrativo padronizado entre `chales`, `clientes`, `reservas` e `comodidades`
- `apps/api/.env` criado com `USE_MOCK_DATA=false`
- `Prisma Client` regenerado com sucesso
- schema `apps` do PostgreSQL confirmado existente e vazio
- `apps/api` com `build` validado apos os ajustes locais

Validacao adicional executada no fim do dia em 03/04/2026:

- `npm run dev:api` subido com sucesso em `http://localhost:3333`
- `npm run dev:web` subido com sucesso em `http://localhost:3000`
- rota `/comodidades` validada com resposta `200 OK`
- CRUD de `comodidades` validado com sucesso na API:
  - criacao
  - listagem
  - edicao
  - exclusao
- vinculo de `comodidades` em `chales` validado via `PUT /api/chales/:id/comodidades`
- ambiente limpo ao final da validacao:
  - comodidade de teste removida
  - vinculacao do `chale` restaurada ao estado anterior

Pendencia atual:

- revisar visualmente no navegador a tela `Comodidades`, agora que a rota e o CRUD ja foram validados tecnicamente
- seguir para os proximos modulos ainda nao implementados

Importante ao voltar:

- o banco `dbchale` responde em `localhost:5432`
- o schema `apps` ja foi sincronizado com sucesso via Prisma
- a ultima validacao do frontend passou com `npm run build -w apps/web`
- a ultima validacao do backend passou com `npm run build -w apps/api`

Comandos para retomar:

1. `npm run dev:api`
2. `npm run dev:web`
3. validar no navegador o fluxo visual de `comodidades`
4. testar login e fluxo completo de `chales`, `comodidades`, `clientes` e `reservas`

Observacao:

- o `db push` final foi aplicado com sucesso ao banco `dbchale`
- como `USE_MOCK_DATA=false`, as listagens reais podem aparecer vazias ate cadastrar os primeiros `chales` e `clientes`

## Retomada

Ultimo ponto concluido:

- frontend com login, sessao e CRUD autenticado para `chales`, `clientes`, `reservas` e `comodidades`
- `apps/api/.env` configurado para PostgreSQL real com `USE_MOCK_DATA=false`
- `Prisma Client` regenerado
- `npx prisma db push --schema prisma/schema.prisma --skip-generate --accept-data-loss` executado com sucesso
- `npm run build -w apps/api` validado
- `npm run build -w apps/web` validado
- menu principal atualizado com a nova opcao `Comodidades`
- tela `Comodidades` criada com grid no mesmo padrao das demais telas
- API de relacionamento `chale_comodidade` implementada para vincular comodidades aos chales
- `npm run dev:api` validado
- `npm run dev:web` validado
- rota `/comodidades` validada com `200 OK`
- CRUD real de `comodidades` validado na API
- vinculo real de `comodidades` em `chales` validado e restaurado ao estado original

Proximo passo recomendado para continuar amanha:

1. subir `npm run dev:api` e `npm run dev:web`
2. validar visualmente no navegador a tela `/comodidades` e o fluxo pelos botoes da interface
3. validar o vinculo de comodidades diretamente pela UI de `chales`
4. seguir para a proxima frente funcional ainda nao coberta no painel
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
