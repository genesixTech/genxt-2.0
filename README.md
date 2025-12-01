# GenesiX Monorepo (Frontend + Backend)

Front: React/Vite/Tailwind/Shadcn.  
Back: Node/Express, Sequelize, Postgres/Redis (SQLite so em dev explicito).  
Infra opcional: Docker Compose (Postgres, Redis, backend, frontend).

## Requisitos
- Node 18+ggg
- npm
- Para producao: Postgres e Redis

## Backend
1. Copie `backend/.env.example` para `backend/.env` e configure Postgres/Redis/JWT (`USE_SQLITE=0`, `ALLOW_SQLITE_FALLBACK=0`).
2. Instale deps: `cd backend && npm install`.
3. Seed opcional (admin/projeto inicial em Postgres): `npm run seed:prod` (use `ADMIN_EMAIL/ADMIN_PASSWORD` no `.env`).
4. Rodar: `npm start` (nao use `FORCE_SYNC=1` em producao).  
   Dev rapido com SQLite: defina `USE_SQLITE=1` (nao recomendado em prod).

## Frontend
1. Instale deps: `cd frontend && npm install --legacy-peer-deps` (necessario por conflito de peer do `react-day-picker`).
2. Rodar: `REACT_APP_API_URL=http://localhost:3001 npm run dev`.
3. Build: `npm run build`.

## Docker Compose (opcional)aaaaa
`docker-compose up --build` usa:
- Postgres (porta 5432), Redis (6379)
- Backend (porta 3001) com env de `backend/.env` e host do DB apontando para `db`
- Frontend (porta 3000) servindo em modo dev; ajuste `REACT_APP_API_URL` se mudar host

## Subir Postgres/Redis rapido (docker run)
- Bash: `scripts/run-postgres-redis.sh`
- PowerShell: `scripts/run-postgres-redis.ps1`

## Scripts uteis (backend)
- `npm run seed:prod` — cria admin/projeto inicial em Postgres.
- `npm run db:sync` — sincroniza modelos; `FORCE_SYNC=1 npm start` so em dev (dropara tabelas).

## Endpoints principais
- Auth `/api/auth/*`, Projetos `/api/projects/*`, Documentos `/api/documents/*` (versoes/restore/aprovar), Colaboradores `/api/collaborators/*`, Analytics `/api/analytics/*`, Planos `/api/plans` e Subscriptions `/api/subscriptions`, Health `/health`.

## Observacoes
- Fallback dev/seed demo so se `DEV_BYPASS_AUTH=1` ou uso explicito de SQLite.
- Redis pode ser desativado com `REDIS_DISABLED=1`.
