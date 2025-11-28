#!/usr/bin/env bash
set -euo pipefail

# Subir Postgres e Redis para desenvolvimento local sem docker-compose
# Ajuste as senhas/ports se necessario.

docker run -d --name genesix-postgres \
  -e POSTGRES_USER=genesix_user \
  -e POSTGRES_PASSWORD=troque_aqui \
  -e POSTGRES_DB=genesix_db \
  -p 5432:5432 postgres:14

docker run -d --name genesix-redis \
  -p 6379:6379 redis:7

echo "Postgres em localhost:5432 (user: genesix_user, db: genesix_db)"
echo "Redis em localhost:6379"
