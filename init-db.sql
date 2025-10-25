-- Script de inicialização do banco de dados
-- Criado automaticamente quando o container PostgreSQL é iniciado

-- Tabela de Grupos
CREATE TABLE IF NOT EXISTS grupos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  usuario_responsavel_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL UNIQUE,
  grupo_id INTEGER REFERENCES grupos(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar FK de usuário responsável após criar a tabela de usuários
ALTER TABLE grupos 
  ADD CONSTRAINT fk_usuario_responsavel 
  FOREIGN KEY (usuario_responsavel_id) 
  REFERENCES usuarios(id) 
  ON DELETE SET NULL;

-- Tabela de Sorteios
CREATE TABLE IF NOT EXISTS sorteios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  valores_sorteados TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Bolões
CREATE TABLE IF NOT EXISTS boloes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  quantidade_campeao INTEGER NOT NULL,
  reiniciar_bolao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento Bolão-Sorteio
CREATE TABLE IF NOT EXISTS boloes_sorteios (
  bolao_id INTEGER REFERENCES boloes(id) ON DELETE CASCADE,
  sorteio_id INTEGER REFERENCES sorteios(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (bolao_id, sorteio_id)
);

-- Tabela de Inscrições
CREATE TABLE IF NOT EXISTS inscricoes_bolao (
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
CREATE TABLE IF NOT EXISTS apostas (
  id SERIAL PRIMARY KEY,
  inscricao_bolao_id INTEGER REFERENCES inscricoes_bolao(id) ON DELETE CASCADE,
  sorteio_id INTEGER REFERENCES sorteios(id) ON DELETE CASCADE,
  valores_escolhidos TEXT[] NOT NULL,
  valores_acertados TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(inscricao_bolao_id, sorteio_id)
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_usuarios_telefone ON usuarios(telefone);
CREATE INDEX IF NOT EXISTS idx_usuarios_grupo ON usuarios(grupo_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_bolao ON inscricoes_bolao(bolao_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_usuario ON inscricoes_bolao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_apostas_inscricao ON apostas(inscricao_bolao_id);
CREATE INDEX IF NOT EXISTS idx_apostas_sorteio ON apostas(sorteio_id);

-- Inserir dados de exemplo (opcional)
-- INSERT INTO usuarios (nome, telefone) VALUES ('Admin', '11999999999');
