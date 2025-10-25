# Script para resetar completamente o banco de dados
# USE COM CUIDADO! Isso apagará TODOS os dados.

Write-Host "⚠️  ATENÇÃO: Este script vai APAGAR TODOS OS DADOS do banco!" -ForegroundColor Red
Write-Host ""
$resposta = Read-Host "Tem certeza que deseja continuar? (digite 'SIM' para confirmar)"

if ($resposta -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "🗑️  Parando containers..." -ForegroundColor Cyan
docker-compose down

Write-Host ""
Write-Host "🗑️  Removendo volume do PostgreSQL..." -ForegroundColor Cyan
docker volume rm sorteio_postgres_data

Write-Host ""
Write-Host "🚀 Recriando containers com banco limpo..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "✅ Banco de dados resetado com sucesso!" -ForegroundColor Green
Write-Host "⏳ Aguarde alguns segundos para o banco inicializar..." -ForegroundColor Yellow
