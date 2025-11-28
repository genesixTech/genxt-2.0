Write-Host "Subindo Postgres..." -ForegroundColor Cyan
docker run -d --name genesix-postgres `
  -e POSTGRES_USER=genesix_user `
  -e POSTGRES_PASSWORD=troque_aqui `
  -e POSTGRES_DB=genesix_db `
  -p 5432:5432 postgres:14

Write-Host "Subindo Redis..." -ForegroundColor Cyan
docker run -d --name genesix-redis -p 6379:6379 redis:7

Write-Host "Postgres em localhost:5432 (user: genesix_user, db: genesix_db)" -ForegroundColor Green
Write-Host "Redis em localhost:6379" -ForegroundColor Green
