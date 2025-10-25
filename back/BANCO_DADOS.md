# 🗄️ Gerenciamento do Banco de Dados

## Como funciona a persistência?

O Docker cria um **volume persistente** chamado `postgres_data` que armazena todos os dados do banco PostgreSQL. Isso significa que:

✅ **Os dados NÃO são perdidos** quando você:
- Para os containers (`docker-compose down`)
- Reinicia os containers (`docker-compose restart`)
- Reinicia o computador

❌ **Os dados SÃO perdidos** quando você:
- Remove o volume manualmente (`docker volume rm sorteio_postgres_data`)
- Usa `docker-compose down -v` (flag `-v` remove volumes)
- Executa o script `docker-db-reset.ps1`

## Scripts de inicialização

### init-db.sql
- Executa **APENAS na primeira criação** do volume
- Se o volume já existe, **NÃO executa novamente**
- Por segurança, está comentado no `docker-compose.yml` após a primeira execução

## Comandos úteis

### Ver se o volume existe
```powershell
docker volume ls | Select-String "postgres_data"
```

### Ver dados do volume
```powershell
docker volume inspect sorteio_postgres_data
```

### Backup do banco (manual)
```powershell
# Exportar dados
docker exec sorteio_postgres pg_dump -U bolao_cota_admin db_bolao > backup.sql

# Restaurar dados
docker exec -i sorteio_postgres psql -U bolao_cota_admin db_bolao < backup.sql
```

### Resetar o banco (⚠️ CUIDADO!)
```powershell
# Usando o script (recomendado - pede confirmação)
.\docker-db-reset.ps1

# Manualmente
docker-compose down
docker volume rm sorteio_postgres_data
docker-compose up -d
```

## Solução de problemas

### O banco está limpando sozinho?

1. **Verifique se está usando `-v`:**
   ```powershell
   # ❌ ERRADO - Remove volumes
   docker-compose down -v
   
   # ✅ CORRETO - Mantém volumes
   docker-compose down
   ```

2. **Verifique se o volume existe:**
   ```powershell
   docker volume ls | Select-String "postgres"
   ```

3. **Veja os logs do PostgreSQL:**
   ```powershell
   docker logs sorteio_postgres
   ```

### Quero recriar apenas as tabelas (sem perder dados)

Execute SQL diretamente no container:
```powershell
docker exec -it sorteio_postgres psql -U bolao_cota_admin -d db_bolao
```

Depois execute comandos SQL manualmente:
```sql
DROP TABLE IF EXISTS apostas CASCADE;
DROP TABLE IF EXISTS inscricoes_bolao CASCADE;
-- etc...
```

## Boas práticas

1. **Sempre use `docker-compose down`** (sem `-v`) para parar
2. **Faça backups regulares** antes de mudanças grandes
3. **Teste em ambiente de desenvolvimento** antes de produção
4. **Documente mudanças** no esquema do banco

## Migração de dados

Quando for para produção, considere usar ferramentas como:
- **Flyway** - Migrations em SQL
- **Liquibase** - Migrations com XML/YAML
- **node-pg-migrate** - Migrations em Node.js
