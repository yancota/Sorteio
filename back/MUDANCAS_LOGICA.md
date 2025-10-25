# 🔄 Mudanças na Lógica do Sistema

## Alterações Implementadas

### 1. **Sorteio agora pertence a um Bolão**

#### Antes:
- Sorteio era independente
- Relacionamento N:N entre Bolão e Sorteio (tabela `boloes_sorteios`)

#### Agora:
- Sorteio é criado **já vinculado a um bolão**
- Relacionamento 1:N (um bolão tem vários sorteios)
- Campo `bolao` é **obrigatório** na criação

#### Exemplo de Criação:
```json
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2500",
  "valor": 5.00,
  "bolao": 1  // ID do bolão (OBRIGATÓRIO)
}
```

### 2. **Aposta não referencia mais Sorteio diretamente**

#### Antes:
- Aposta tinha referência para `inscricaoBolao` E `sorteio`
- Uma aposta específica para cada sorteio
- Constraint: `UNIQUE(inscricao_bolao_id, sorteio_id)`

#### Agora:
- Aposta referencia apenas `inscricaoBolao`
- **Os mesmos números valem para TODOS os sorteios do bolão**
- Constraint: `UNIQUE(inscricao_bolao_id)`

#### Exemplo de Criação:
```json
POST /api/apostas
{
  "inscricaoBolao": 1,  // ID da inscrição
  "valoresEscolhidos": ["10", "25", "33", "42", "51", "60"]
  // Esses números valem para TODOS os sorteios do bolão!
}
```

---

## Mudanças no Banco de Dados

### Tabela `sorteios`
```sql
-- ANTES
CREATE TABLE sorteios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  valores_sorteados TEXT[]
);

-- AGORA
CREATE TABLE sorteios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  bolao_id INTEGER REFERENCES boloes(id) ON DELETE CASCADE,  -- NOVO!
  valores_sorteados TEXT[]
);
```

### Tabela `apostas`
```sql
-- ANTES
CREATE TABLE apostas (
  id SERIAL PRIMARY KEY,
  inscricao_bolao_id INTEGER REFERENCES inscricoes_bolao(id),
  sorteio_id INTEGER REFERENCES sorteios(id),  -- REMOVIDO!
  valores_escolhidos TEXT[] NOT NULL,
  UNIQUE(inscricao_bolao_id, sorteio_id)
);

-- AGORA
CREATE TABLE apostas (
  id SERIAL PRIMARY KEY,
  inscricao_bolao_id INTEGER REFERENCES inscricoes_bolao(id),
  valores_escolhidos TEXT[] NOT NULL,
  UNIQUE(inscricao_bolao_id)  -- Uma aposta por inscrição
);
```

### Tabela `boloes_sorteios` - REMOVIDA ❌
Não é mais necessária, pois o relacionamento agora é direto na tabela `sorteios`.

---

## Novos Endpoints

### Sorteios

#### `GET /api/sorteios/bolao/:bolaoId`
Busca todos os sorteios de um bolão específico.

**Exemplo:**
```bash
GET /api/sorteios/bolao/1
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Mega Sena - Concurso 2500",
      "valor": 5.00,
      "bolao": 1,
      "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
    }
  ]
}
```

### Apostas

#### `GET /api/apostas/bolao/:bolaoId`
Busca todas as apostas de um bolão (através das inscrições).

**Exemplo:**
```bash
GET /api/apostas/bolao/1
```

#### `POST /api/apostas/:id/calcular-acertos/:sorteioId`
Calcula os acertos de uma aposta específica para um sorteio.

**Exemplo:**
```bash
POST /api/apostas/1/calcular-acertos/1
```

**Resposta:**
```json
{
  "success": true,
  "message": "Acertos calculados com sucesso",
  "data": {
    "apostaId": 1,
    "sorteioId": 1,
    "quantidadeAcertos": 3,
    "valoresAcertados": ["10", "25", "33"]
  }
}
```

#### `POST /api/apostas/bolao/:bolaoId/sorteio/:sorteioId/calcular-acertos`
Calcula os acertos de TODAS as apostas de um bolão para um sorteio.

**Exemplo:**
```bash
POST /api/apostas/bolao/1/sorteio/1/calcular-acertos
```

---

## Endpoints Removidos

### ❌ `GET /api/apostas/sorteio/:sorteioId`
**Motivo:** Apostas não referenciam mais sorteios diretamente.
**Alternativa:** Use `GET /api/apostas/bolao/:bolaoId`

### ❌ `POST /api/apostas/sorteio/:sorteioId/calcular-acertos`
**Motivo:** Mudança na assinatura do método.
**Alternativa:** Use `POST /api/apostas/bolao/:bolaoId/sorteio/:sorteioId/calcular-acertos`

---

## Fluxo Atualizado

### Antes:
1. Criar Bolão
2. Criar Sorteio (independente)
3. Vincular Sorteio ao Bolão (endpoint separado)
4. Usuário se inscreve no Bolão
5. Usuário faz aposta para cada Sorteio

### Agora:
1. Criar Bolão
2. **Criar Sorteio JÁ VINCULADO ao Bolão** ⭐
3. Usuário se inscreve no Bolão
4. **Usuário faz UMA aposta (vale para todos os sorteios)** ⭐

---

## Vantagens da Nova Lógica

✅ **Simplicidade:** Usuário só precisa escolher os números uma vez
✅ **Menos dados:** Uma aposta por inscrição (não uma por sorteio)
✅ **Consistência:** Sorteio sempre pertence a um bolão
✅ **Performance:** Menos tabelas de relacionamento
✅ **Realista:** Simula bolões reais onde os números são fixos

---

## Exemplo Completo

### 1. Criar Bolão
```bash
POST /api/boloes
{
  "nome": "Bolão da Firma 2025",
  "quantidadeCampeao": 1,
  "reiniciarBolao": false
}
```

### 2. Criar Sorteio no Bolão
```bash
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2500",
  "valor": 5.00,
  "bolao": 1
}
```

### 3. Criar Outro Sorteio no Mesmo Bolão
```bash
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2501",
  "valor": 5.00,
  "bolao": 1
}
```

### 4. Usuário se Inscreve
```bash
POST /api/inscricoes
{
  "bolao": 1,
  "usuario": 1
}
```

### 5. Usuário Faz Aposta (vale para os 2 sorteios!)
```bash
POST /api/apostas
{
  "inscricaoBolao": 1,
  "valoresEscolhidos": ["10", "25", "33", "42", "51", "60"]
}
```

### 6. Realizar Sorteio 2500
```bash
POST /api/sorteios/1/realizar
{
  "valoresSorteados": ["10", "25", "33", "45", "52", "61"]
}
```

### 7. Calcular Acertos para o Sorteio 2500
```bash
POST /api/apostas/bolao/1/sorteio/1/calcular-acertos
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "apostaId": 1,
      "sorteioId": 1,
      "quantidadeAcertos": 3,
      "valoresAcertados": ["10", "25", "33"]
    }
  ]
}
```

### 8. Realizar Sorteio 2501
```bash
POST /api/sorteios/2/realizar
{
  "valoresSorteados": ["10", "42", "51", "60", "55", "58"]
}
```

### 9. Calcular Acertos para o Sorteio 2501 (mesma aposta!)
```bash
POST /api/apostas/bolao/1/sorteio/2/calcular-acertos
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "apostaId": 1,
      "sorteioId": 2,
      "quantidadeAcertos": 4,
      "valoresAcertados": ["10", "42", "51", "60"]
    }
  ]
}
```

---

## ⚠️ Breaking Changes

Se você já tinha dados no sistema:

1. **Banco de dados precisa ser resetado** (ou migrado manualmente)
2. **Código cliente precisa ser atualizado** para enviar `bolao` ao criar sorteios
3. **Apostas antigas serão incompatíveis** (precisam ser recriadas sem `sorteio`)

### Para Resetar o Banco:
```powershell
.\docker-db-reset.ps1
```

---

## 📝 Documentação Swagger

Acesse: http://localhost:8080/api-docs

Todas as alterações já estão refletidas na documentação Swagger! 🎉
