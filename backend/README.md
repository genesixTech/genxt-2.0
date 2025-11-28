# GenesiX Backend

Backend da plataforma GenesiX (Node/Express, Sequelize, Postgres/Redis). ASCII limpo e instrucoes enxutas.

## Requisitos
- Node 18+
- Postgres 14+
- Redis (opcional, pode desligar)

## Configuracao
1. Copie `.env.example` para `.env` e ajuste (inclua `CORS_ORIGIN`, ex: http://localhost:3000):
   - `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`, `DB_DIALECT=postgres`
   - `REDIS_HOST/REDIS_PORT` (ou `REDIS_DISABLED=1`, `REDIS_PASSWORD` se aplicavel)
   - `JWT_SECRET` (obrigatorio em prod), `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
   - `USE_SQLITE=0`, `ALLOW_SQLITE_FALLBACK=0` para evitar fallback
   - `FORCE_SYNC=0` em producao (para nao dropar dados)
   - `DEV_BYPASS_AUTH=0` em producao
   - OAuth: preencha GOOGLE/GITHUB/LINKEDIN client/secret se usar login social
2. Instale deps: `npm install`
3. Opcional: seed admin/projeto inicial em Postgres: `npm run seed:prod`  
   (use `ADMIN_EMAIL`/`ADMIN_PASSWORD` no `.env` se quiser customizar)

## Execucao
- Producao: `npm start`  
  (certifique-se de que Postgres/Redis estao configurados; nao use `FORCE_SYNC=1` em prod)
- Dev com SQLite (nao recomendado para prod): defina `USE_SQLITE=1` e rode `npm start`.

## Scripts uteis
- `npm run seed:prod` — cria admin, perfil completo e um projeto inicial.
- `npm run db:sync` — sincroniza modelos (sem force); use `FORCE_SYNC=1` apenas em dev.

## Endpoints principais
- Auth: `/api/auth/*`
- Projetos: `/api/projects/*` (inclui steps)
- Documentos: `/api/documents/*` (versoes, restore, approve)
- Colaboradores: `/api/collaborators/*`
- Settings: `/api/settings/*`
- Analytics: `/api/analytics/*`
- Planos/assinaturas: `/api/plans`, `/api/subscriptions`
- Health: `/health`

## Notas
- Seed dev (usuario/projeto/demo) so roda com `DEV_BYPASS_AUTH=1`.
- Redis pode ser desligado com `REDIS_DISABLED=1`.

## Stack
- Express, Sequelize, Postgres/SQLite (dev), Redis, JWT, express-validator, helmet, rate-limit-redis, winston.
