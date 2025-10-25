# 🗄️ Configuração do Banco de Dados PostgreSQL

## 📝 Variáveis de Ambiente

O projeto utiliza o arquivo `.env.bolao` para configurar a conexão com o PostgreSQL.

### Configuração do arquivo .env.bolao:

```env
PORT=8080
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sorteio
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

## 🚀 Como Usar

### 1. Instalar PostgreSQL

Se ainda não tiver o PostgreSQL instalado:
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt-get install postgresql`

### 2. Criar o Banco de Dados

```sql
CREATE DATABASE sorteio;
```

### 3. Configurar a Conexão

Edite o arquivo `.env.bolao` e adicione suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sorteio
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

### 4. Usar no Código

A configuração do banco está disponível em `src/config/database.js`:

```javascript
const dbConfig = require('./config/database');

// Exemplo de uso com pg (node-postgres)
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

// Fazer uma query
const result = await pool.query('SELECT * FROM usuarios');
```

## 📦 Próximos Passos

Para integrar o PostgreSQL no projeto, você precisará:

1. **Instalar o driver do PostgreSQL:**
   ```bash
   npm install pg
   ```

2. **Criar as tabelas do banco** (migrations)

3. **Atualizar os Repositories** para usar o PostgreSQL ao invés de memória

## 🔧 Estrutura de Tabelas Sugerida

```sql
-- Tabela de Usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL UNIQUE,
  grupo_id INTEGER REFERENCES grupos(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Grupos
CREATE TABLE grupos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  usuario_responsavel_id INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Sorteios
CREATE TABLE sorteios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  valores_sorteados TEXT[], -- Array de strings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Bolões
CREATE TABLE boloes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  quantidade_campeao INTEGER NOT NULL,
  reiniciar_bolao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento Bolão-Sorteio
CREATE TABLE boloes_sorteios (
  bolao_id INTEGER REFERENCES boloes(id) ON DELETE CASCADE,
  sorteio_id INTEGER REFERENCES sorteios(id) ON DELETE CASCADE,
  PRIMARY KEY (bolao_id, sorteio_id)
);

-- Tabela de Inscrições
CREATE TABLE inscricoes_bolao (
  id SERIAL PRIMARY KEY,
  bolao_id INTEGER REFERENCES boloes(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  apto BOOLEAN DEFAULT TRUE,
  pontuacao_total INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bolao_id, usuario_id)
);

-- Tabela de Apostas
CREATE TABLE apostas (
  id SERIAL PRIMARY KEY,
  inscricao_bolao_id INTEGER REFERENCES inscricoes_bolao(id) ON DELETE CASCADE,
  sorteio_id INTEGER REFERENCES sorteios(id) ON DELETE CASCADE,
  valores_escolhidos TEXT[] NOT NULL,
  valores_acertados TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(inscricao_bolao_id, sorteio_id)
);
```

## ✅ Status Atual

- ✅ Variáveis de ambiente configuradas
- ✅ Arquivo de configuração do banco criado
- ⏳ Integração com PostgreSQL (pendente)
- ⏳ Migrations (pendente)

**Nota:** Atualmente os dados estão em memória. Para persistir no PostgreSQL, será necessário atualizar os Repositories.
