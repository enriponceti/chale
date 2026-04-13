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

Atualizacao de encerramento em 05/04/2026:

- corrigida a pagina interna `not-found` do Next em `apps/web/src/app/not-found.tsx`
- corrigida a instabilidade entre `next dev` e `next build` usando `distDir` separado em desenvolvimento (`.next-dev`)
- `apps/web/tsconfig.json` ajustado para incluir tipos gerados em `.next-dev`
- fluxo de autenticacao do frontend ajustado para evitar tela presa em loading antes do login
- modal de `chales` ajustado para exibir erros dentro do proprio dialog
- modal de `chales` ajustado com mascara monetaria em Real com casas decimais
- modal de `reservas` ajustado para exibir erros dentro do proprio dialog
- modal de `reservas` ajustado com campos obrigatorios sinalizados e mascara monetaria em Real com casas decimais
- `npm run check` segue passando apos as correcoes

Atualizacao de encerramento em 10/04/2026:

- frontend remodelado para uma linguagem visual inspirada no `AdminLTE`
- menu lateral reorganizado com `Dashboard`, `Reservas`, `Chales`, `Comodidades`, `Clientes`, `Manutencao`, `Modelo` e `Financeiro`
- pagina inicial reorganizada com `Painel de reservas` mostrando cards por chale
- cards do painel de reservas agora exibem status `Disponivel`, `Reservado` ou `Manutencao`
- cards reservados agora mostram tooltip no hover com nome e telefone do cliente
- cabeçalho antigo da home removido para deixar o painel mais direto
- CRUD de `manutencao` implementado na API e no frontend
- tela `Manutencao` conectada ao backend real
- formulario de manutencao restrito para exibir apenas chales sem reserva ativa e sem manutencao ativa
- entidades de checklist implementadas no sistema:
  - `checklist_item_modelo`
  - `checklist_limpeza`
  - `checklist_limpeza_item`
- API criada para modelos de checklist e checklists de limpeza
- nova tela `Modelo` adicionada no frontend para gerenciar modelos e checklists
- `npm run check` validado com todas as alteracoes acima

Atualizacao de encerramento em 13/04/2026:

- identidade visual do login atualizada com imagem de fundo `fortim_login.webp`
- login ajustado para prefetch da home e novo estado de loading global no App Router, reduzindo a sensacao de travamento ao entrar no painel
- nome da aplicacao ajustado para `Chalés Admin` nos principais pontos do frontend
- textos visiveis de `Manutenção` revisados no frontend para corrigir acentuacao sem alterar rotas ou contratos tecnicos
- grade da tela de `Reservas` ajustada para listar da mais recente para a mais antiga
- cards do `Dashboard` agora exibem o tipo da manutencao ativa no formato `Manutenção - <tipo>`
- checkout de uma reserva agora cria automaticamente uma manutencao de `limpeza` com status `aberta` e data de abertura igual a data do checkout
- a atualizacao da mesma reserva apos o checkout nao fica mais bloqueada pela manutencao automatica criada para o chale
- chalés com manutencao ativa apenas do tipo `limpeza` agora podem receber novas reservas; manutencoes ativas dos demais tipos seguem bloqueando
- simulacoes em modo mock confirmaram:
  - criacao automatica da manutencao de limpeza no checkout
  - ausencia de duplicidade ao salvar a mesma reserva novamente
  - permissao de reserva em chale apenas com limpeza ativa
  - bloqueio mantido para manutencao corretiva/preventiva/inspescao

Importante ao voltar:

- o banco `dbchale` responde em `localhost:5432`
- como `USE_MOCK_DATA=false`, as listagens reais podem aparecer vazias ate cadastrar os primeiros registros
- a branch protegida nao aceita push direto em `main`
- o frontend em desenvolvimento agora usa `.next-dev`; a pasta `.next` fica reservada para `build`
- se a interface ficar presa em estado antigo, limpar `localStorage` pela chave `chales.session`
- a tela `Manutencao` agora depende de chales elegiveis sem reserva ativa e sem manutencao ativa
- manutencoes automaticas de limpeza podem ser abertas no checkout e nao devem bloquear novas reservas por si so
- a tela `Modelo` usa status operacionais definidos no sistema:
  - checklist de limpeza: `aberto`, `em_andamento`, `concluido`, `cancelado`
  - item do checklist: `pendente`, `concluido`, `nao_aplicavel`
- na API, os registros de checklist usam `idUsuario = 1` como padrao tecnico enquanto nao houver gestao real de usuarios operacionais

Proximo passo recomendado:

1. subir `npm run dev:api`
2. subir `npm run dev:web`
3. validar visualmente a home nova no estilo `AdminLTE`
4. validar o `Painel de reservas` com hover de cliente nos chales reservados
5. validar o login com a nova arte de fundo e a transicao ate o dashboard
6. validar o CRUD de `Manutenção` na UI com persistencia real
7. validar o checkout de uma reserva e confirmar a criacao automatica da manutencao de `limpeza`
8. validar que um chale com manutencao apenas de `limpeza` continua aceitando nova reserva
9. validar que um chale com manutencao `corretiva`, `preventiva` ou `inspescao` continua bloqueando nova reserva
10. validar o CRUD de `Modelo` e `Checklist de limpeza` na UI com persistencia real
11. validar se os checklists criados aparecem corretamente com seus itens
12. validar o vinculo de comodidades diretamente pela UI de `chales`

Depois disso:

1. validar criacao de um `chale`
2. validar criacao de uma `comodidade`
3. validar criacao de um `cliente`
4. validar criacao e edicao de uma `reserva`
5. validar criacao, edicao e exclusao de uma `manutencao`
6. validar criacao, edicao e exclusao de um `modelo de checklist`
7. validar criacao, edicao e exclusao de um `checklist de limpeza`
8. revisar se ainda existe algum loading indevido ao navegar entre `login`, `dashboard`, `manutencao` e `modelo`

## Proximos passos recomendados

1. Gerar as migrations Prisma a partir do schema final
2. Implementar autenticacao com JWT e controle por perfil
3. Conectar as telas do frontend aos endpoints reais
4. Adicionar testes de regras de reserva, conflito de datas e faturamento
