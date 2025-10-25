# 🐳 Guia Docker - Sistema de Sorteio

## 📋 Pré-requisitos

- **Docker** instalado: https://www.docker.com/get-started
- **Docker Compose** instalado (geralmente vem com Docker Desktop)

## 🚀 Como Rodar o Projeto

### 1️⃣ Subir os containers (API + PostgreSQL)

```bash
# Na pasta raiz do projeto
docker-compose up -d
```

Isso vai:
- ✅ Criar o container do PostgreSQL
- ✅ Criar o container da API Node.js
- ✅ Criar o banco de dados automaticamente
- ✅ Criar todas as tabelas (via init-db.sql)
- ✅ Conectar tudo em uma rede Docker

### 2️⃣ Verificar se os containers estão rodando

```bash
docker-compose ps
```

Você deve ver:
```
NAME                IMAGE                  STATUS
sorteio_api         sorteio-api           Up
sorteio_postgres    postgres:15-alpine    Up (healthy)
```

### 3️⃣ Acessar a aplicação

- **API**: http://localhost:8080
- **Swagger**: http://localhost:8080/api-docs

### 4️⃣ Ver os logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas da API
docker-compose logs -f api

# Logs apenas do PostgreSQL
docker-compose logs -f postgres
```

## 🛠️ Comandos Úteis

### Parar os containers
```bash
docker-compose stop
```

### Parar e remover os containers
```bash
docker-compose down
```

### Parar, remover containers E deletar volumes (⚠️ apaga o banco de dados)
```bash
docker-compose down -v
```

### Reconstruir a imagem da API (após alterações no código)
```bash
docker-compose up -d --build
```

### Acessar o terminal do container da API
```bash
docker exec -it sorteio_api sh
```

### Acessar o PostgreSQL via terminal
```bash
docker exec -it sorteio_postgres psql -U bolao_cota_admin -d db_bolao
```

### Ver o uso de recursos
```bash
docker stats
```

## 🗄️ Gerenciamento do Banco de Dados

### Conectar ao banco de dados

**Via Docker:**
```bash
docker exec -it sorteio_postgres psql -U bolao_cota_admin -d db_bolao
```

**Via cliente externo (DBeaver, pgAdmin, etc):**
- Host: `localhost`
- Port: `5432`
- Database: `db_bolao`
- User: `bolao_cota_admin`
- Password: `root1234`

### Fazer backup do banco
```bash
docker exec sorteio_postgres pg_dump -U bolao_cota_admin db_bolao > backup.sql
```

### Restaurar backup
```bash
cat backup.sql | docker exec -i sorteio_postgres psql -U bolao_cota_admin db_bolao
```

## 📦 Estrutura dos Containers

### Container: `sorteio_postgres`
- **Imagem**: postgres:15-alpine
- **Porta**: 5432
- **Volume**: `postgres_data` (dados persistem mesmo após `docker-compose down`)
- **Healthcheck**: Verifica se o PostgreSQL está pronto antes de iniciar a API

### Container: `sorteio_api`
- **Imagem**: Construída a partir do Dockerfile
- **Porta**: 8080
- **Depende de**: postgres (aguarda o healthcheck)
- **Volume**: Código montado (modo desenvolvimento)

## 🔧 Variáveis de Ambiente

As variáveis são configuradas no `docker-compose.yml`:

```yaml
environment:
  PORT: 8080
  NODE_ENV: production
  DB_HOST: postgres          # Nome do serviço, não "localhost"
  DB_PORT: 5432
  DB_NAME: db_bolao
  DB_USER: bolao_cota_admin
  DB_PASSWORD: root1234
```

## 🔄 Modo Desenvolvimento vs Produção

### Desenvolvimento (com hot-reload)
O docker-compose já está configurado para desenvolvimento com volume montado.
Qualquer alteração no código reinicia a aplicação automaticamente.

### Produção
Para produção, remova o volume de código no docker-compose.yml:

```yaml
api:
  volumes:
    # - .:/app              # Comentar esta linha
    - /app/node_modules     # Manter apenas esta
```

## 🚨 Troubleshooting

### Porta 8080 já está em uso
```bash
# Pare o processo que está usando a porta ou mude no docker-compose.yml:
ports:
  - "8081:8080"  # Acesse via localhost:8081
```

### Porta 5432 já está em uso (PostgreSQL local)
```bash
# Pare o PostgreSQL local ou mude a porta:
ports:
  - "5433:5432"  # PostgreSQL vai rodar na 5433

# E atualize o .env.bolao:
DB_PORT=5433
```

### Banco de dados não foi criado
```bash
# Derrube tudo e suba novamente
docker-compose down -v
docker-compose up -d
```

### Ver erros detalhados
```bash
docker-compose logs -f api
```

## ✅ Checklist de Deploy

- [ ] Docker e Docker Compose instalados
- [ ] Arquivo `.env.bolao` configurado
- [ ] Executar `docker-compose up -d`
- [ ] Verificar logs: `docker-compose logs -f`
- [ ] Acessar http://localhost:8080
- [ ] Testar endpoints no Swagger
- [ ] Verificar conexão com PostgreSQL

## 🎯 Próximos Passos

1. ✅ Containers configurados
2. ✅ Banco de dados criado automaticamente
3. ⏳ Atualizar Repositories para usar PostgreSQL (ainda em memória)
4. ⏳ Implementar migrations
5. ⏳ Adicionar testes

---

**🎉 Pronto! Seu projeto está rodando no Docker!**

Acesse: http://localhost:8080/api-docs
