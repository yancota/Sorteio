# 🔄 Ajustes Finais na Lógica do Sistema

## Alterações Implementadas

### 1. **Valor agora pertence ao Bolão (não ao Sorteio)**

#### Antes:
- Campo `valor` estava no modelo `Sorteio`
- Cada sorteio tinha seu próprio valor

#### Agora:
- Campo `valor` está no modelo `Bolao`
- Todos os sorteios de um bolão compartilham o mesmo valor
- Campo `valor` é **obrigatório** na criação do bolão

#### Exemplo de Criação de Bolão:
```json
POST /api/boloes
{
  "nome": "Bolão da Firma 2025",
  "valor": 10.00,           // NOVO: Valor do bolão
  "quantidadeCampeao": 1,
  "reiniciarBolao": false
}
```

#### Exemplo de Criação de Sorteio:
```json
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2500",
  "bolao": 1
  // NÃO precisa mais do campo "valor"
}
```

---

### 2. **Realizar Sorteio atualiza automaticamente a pontuação**

#### Comportamento Anterior:
- Realizar sorteio apenas salvava os números sorteados
- Cálculo de acertos era manual

#### Comportamento Atual:
Quando você realiza um sorteio (`POST /sorteios/:id/realizar`), o sistema **automaticamente**:

1. ✅ Salva os valores sorteados
2. ✅ Busca todas as apostas do bolão
3. ✅ Calcula os acertos de cada aposta
4. ✅ Cria/atualiza registro em `resultados_sorteios` com:
   - Valores acertados
   - Pontuação do sorteio
5. ✅ Atualiza a `pontuacaoTotal` na tabela `inscricoes_bolao`

#### Exemplo:
```bash
POST /api/sorteios/1/realizar
{
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
}
```

**O que acontece:**
- Usuário A apostou ["10", "25", "30", "40", "50", "60"]
  - Acertou 3 números: ["10", "25", "60"]
  - Ganha 3 pontos
  - `pontuacaoTotal` dele é atualizada: +3

- Usuário B apostou ["33", "42", "51", "55", "58", "61"]
  - Acertou 3 números: ["33", "42", "51"]
  - Ganha 3 pontos
  - `pontuacaoTotal` dele é atualizada: +3

---

## Novo Modelo: ResultadoSorteio

Para armazenar os acertos de cada aposta em cada sorteio, criamos uma nova entidade:

```javascript
{
  id: 1,
  aposta: 1,              // ID da aposta
  sorteio: 1,             // ID do sorteio
  valoresAcertados: ["10", "25", "60"],
  pontuacao: 3            // Quantidade de acertos
}
```

### Vantagens:
- ✅ Histórico completo de cada sorteio
- ✅ Permite refazer cálculos sem perder dados
- ✅ Facilita auditoria
- ✅ Permite ver quais números cada pessoa acertou em cada sorteio

---

## Mudanças no Banco de Dados

### Tabela `boloes`
```sql
-- ANTES
CREATE TABLE boloes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  quantidade_campeao INTEGER NOT NULL,
  reiniciar_bolao BOOLEAN DEFAULT FALSE
);

-- AGORA
CREATE TABLE boloes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,  -- NOVO!
  quantidade_campeao INTEGER NOT NULL,
  reiniciar_bolao BOOLEAN DEFAULT FALSE
);
```

### Tabela `sorteios`
```sql
-- ANTES
CREATE TABLE sorteios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,  -- REMOVIDO!
  bolao_id INTEGER REFERENCES boloes(id),
  valores_sorteados TEXT[]
);

-- AGORA
CREATE TABLE sorteios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  bolao_id INTEGER REFERENCES boloes(id),
  valores_sorteados TEXT[]
);
```

### Tabela `apostas`
```sql
-- ANTES
CREATE TABLE apostas (
  id SERIAL PRIMARY KEY,
  inscricao_bolao_id INTEGER,
  valores_escolhidos TEXT[] NOT NULL,
  valores_acertados TEXT[],  -- REMOVIDO!
  UNIQUE(inscricao_bolao_id)
);

-- AGORA
CREATE TABLE apostas (
  id SERIAL PRIMARY KEY,
  inscricao_bolao_id INTEGER,
  valores_escolhidos TEXT[] NOT NULL,
  UNIQUE(inscricao_bolao_id)
);
```

### Nova Tabela `resultados_sorteios` ⭐
```sql
CREATE TABLE resultados_sorteios (
  id SERIAL PRIMARY KEY,
  aposta_id INTEGER REFERENCES apostas(id) ON DELETE CASCADE,
  sorteio_id INTEGER REFERENCES sorteios(id) ON DELETE CASCADE,
  valores_acertados TEXT[],
  pontuacao INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(aposta_id, sorteio_id)
);
```

---

## Fluxo Completo Atualizado

### 1. Criar Grupo
```bash
POST /api/grupos
{
  "nome": "Família Silva"
}
```

### 2. Criar Usuário
```bash
POST /api/usuarios
{
  "nome": "João Silva",
  "telefone": "11999999999",
  "grupo": 1
}
```

### 3. Criar Bolão (COM VALOR)
```bash
POST /api/boloes
{
  "nome": "Bolão da Mega Sena 2025",
  "valor": 15.00,
  "quantidadeCampeao": 1,
  "reiniciarBolao": false
}
```

### 4. Criar Sorteios (SEM VALOR)
```bash
POST /api/sorteios
{
  "nome": "Concurso 2500",
  "bolao": 1
}

POST /api/sorteios
{
  "nome": "Concurso 2501",
  "bolao": 1
}
```

### 5. Inscrever Usuário no Bolão
```bash
POST /api/inscricoes
{
  "bolao": 1,
  "usuario": 1
}
```

### 6. Fazer Aposta
```bash
POST /api/apostas
{
  "inscricaoBolao": 1,
  "valoresEscolhidos": ["10", "25", "33", "42", "51", "60"]
}
```

### 7. Realizar Sorteio 2500 (ATUALIZAÇÃO AUTOMÁTICA!)
```bash
POST /api/sorteios/1/realizar
{
  "valoresSorteados": ["10", "25", "33", "45", "52", "61"]
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Sorteio realizado com sucesso",
  "data": {
    "id": 1,
    "nome": "Concurso 2500",
    "bolao": 1,
    "valoresSorteados": ["10", "25", "33", "45", "52", "61"]
  }
}
```

**O que aconteceu nos bastidores:**
1. Salvou os valores sorteados
2. Buscou a aposta da inscrição 1
3. Calculou acertos: ["10", "25", "33"] = 3 pontos
4. Criou registro em `resultados_sorteios`:
   ```json
   {
     "id": 1,
     "aposta": 1,
     "sorteio": 1,
     "valoresAcertados": ["10", "25", "33"],
     "pontuacao": 3
   }
   ```
5. Atualizou `pontuacaoTotal` da inscrição: 0 → 3

### 8. Verificar Pontuação
```bash
GET /api/inscricoes/1
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bolao": { "id": 1, "nome": "Bolão da Mega Sena 2025" },
    "usuario": { "id": 1, "nome": "João Silva" },
    "apto": true,
    "pontuacaoTotal": 3  // Atualizado automaticamente!
  }
}
```

### 9. Realizar Sorteio 2501 (mesma aposta, nova pontuação!)
```bash
POST /api/sorteios/2/realizar
{
  "valoresSorteados": ["10", "42", "51", "60", "55", "58"]
}
```

**O que aconteceu:**
1. Acertou: ["10", "42", "51", "60"] = 4 pontos
2. Criou novo registro em `resultados_sorteios`
3. Atualizou `pontuacaoTotal`: 3 → 7

### 10. Ver Ranking
```bash
GET /api/inscricoes/bolao/1/ranking
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "posicao": 1,
      "usuario": "João Silva",
      "pontuacaoTotal": 7
    }
  ]
}
```

---

## Mudanças nas APIs

### Endpoints Atualizados:

#### `POST /api/boloes`
**Antes:**
```json
{
  "nome": "Bolão",
  "quantidadeCampeao": 1
}
```

**Agora:**
```json
{
  "nome": "Bolão",
  "valor": 10.00,  // OBRIGATÓRIO
  "quantidadeCampeao": 1
}
```

#### `POST /api/sorteios`
**Antes:**
```json
{
  "nome": "Mega Sena 2500",
  "valor": 5.00,
  "bolao": 1
}
```

**Agora:**
```json
{
  "nome": "Mega Sena 2500",
  "bolao": 1
  // "valor" não existe mais
}
```

#### `POST /api/sorteios/:id/realizar`
**Comportamento Anterior:**
- Apenas salvava os números sorteados

**Comportamento Atual:**
- Salva os números sorteados
- **Calcula automaticamente os acertos de todas as apostas**
- **Atualiza pontuação de todos os participantes**
- **Cria registros em `resultados_sorteios`**

---

## Novos Endpoints (futuro)

Para consultar os resultados detalhados, você pode criar:

```bash
# Buscar resultados de um sorteio
GET /api/resultados/sorteio/:sorteioId

# Buscar resultados de uma aposta
GET /api/resultados/aposta/:apostaId

# Buscar resultado específico
GET /api/resultados/aposta/:apostaId/sorteio/:sorteioId
```

---

## ⚠️ Breaking Changes

1. **Campo `valor` movido de Sorteio para Bolão**
   - Ao criar bolão, `valor` é **obrigatório**
   - Ao criar sorteio, `valor` **não existe mais**

2. **Campo `valoresAcertados` removido de Apostas**
   - Agora está em `resultados_sorteios`
   - Permite múltiplos resultados (um por sorteio)

3. **Realizar sorteio agora tem efeitos colaterais**
   - Atualiza pontuações automaticamente
   - Cria registros de resultados
   - Processo mais pesado (mas mais completo)

---

## Resetar o Banco

Como a estrutura mudou, você precisa resetar:

```powershell
.\docker-db-reset.ps1
```

---

## Documentação Swagger

Acesse: http://localhost:8080/api-docs

Todas as alterações já estão refletidas! 🎉

---

## Vantagens das Mudanças

✅ **Valor único:** Todos os sorteios do bolão têm o mesmo valor (mais realista)
✅ **Automação:** Pontuação atualizada automaticamente ao realizar sorteio
✅ **Histórico:** Cada resultado é armazenado individualmente
✅ **Auditoria:** Possível ver exatamente o que cada pessoa acertou em cada sorteio
✅ **Escalabilidade:** Sistema pronto para múltiplos sorteios sem duplicação de dados
