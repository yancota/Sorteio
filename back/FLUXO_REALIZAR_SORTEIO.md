# 🎯 Fluxo de Realizar Sorteio

## Como Funciona Agora

### ⚠️ Importante: Os valores sorteados devem estar CADASTRADOS no sorteio

O endpoint `POST /api/sorteios/:id/realizar` **NÃO recebe** os valores sorteados no body.

Ele usa os valores que já estão salvos no campo `valoresSorteados` do sorteio.

---

## Fluxo Correto

### 1️⃣ Criar Sorteio (com ou sem valores sorteados)

```bash
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2500",
  "bolao": 1,
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]  # OPCIONAL na criação
}
```

### 2️⃣ Se não cadastrou os valores na criação, atualize o sorteio

```bash
PUT /api/sorteios/1
{
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
}
```

### 3️⃣ Realizar o Sorteio (sem body!)

```bash
POST /api/sorteios/1/realizar
# Body VAZIO ou apenas {}
```

**O que acontece:**
1. ✅ Busca o sorteio no banco
2. ✅ Verifica se `valoresSorteados` está preenchido
3. ✅ Se não estiver, retorna erro: "O sorteio precisa ter valores sorteados definidos antes de ser realizado"
4. ✅ Se estiver, calcula os acertos de todas as apostas
5. ✅ Cria/atualiza registros em `resultados_sorteios`
6. ✅ Atualiza a `pontuacaoTotal` de cada participante

---

## Exemplos Práticos

### ✅ Forma Correta 1: Criar com valores

```bash
# 1. Criar sorteio já com valores sorteados
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2500",
  "bolao": 1,
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
}

# 2. Realizar sorteio (sem body)
POST /api/sorteios/1/realizar
```

### ✅ Forma Correta 2: Criar sem valores, depois adicionar

```bash
# 1. Criar sorteio sem valores
POST /api/sorteios
{
  "nome": "Mega Sena - Concurso 2500",
  "bolao": 1
}

# 2. Atualizar com valores sorteados
PUT /api/sorteios/1
{
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
}

# 3. Realizar sorteio (sem body)
POST /api/sorteios/1/realizar
```

### ❌ Forma Incorreta (antiga)

```bash
# ❌ NÃO FUNCIONA MAIS
POST /api/sorteios/1/realizar
{
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
}
```

**Erro:** A API vai ignorar o body e tentar usar os valores que já estão no sorteio. Se não houver valores cadastrados, vai retornar erro.

---

## Vantagens da Nova Lógica

✅ **Separação de Responsabilidades:**
- Cadastrar valores = `POST /sorteios` ou `PUT /sorteios/:id`
- Processar sorteio = `POST /sorteios/:id/realizar`

✅ **Segurança:**
- Valores sorteados ficam registrados no banco
- Impossível "perder" os números após processar

✅ **Flexibilidade:**
- Pode cadastrar os valores antes ou depois da criação
- Pode atualizar os valores antes de realizar

✅ **Auditoria:**
- Histórico claro de quando os valores foram definidos
- Separação entre definir números e processar resultados

---

## Mensagens de Erro

### Se tentar realizar sorteio sem valores cadastrados:

**Request:**
```bash
POST /api/sorteios/1/realizar
```

**Response (400):**
```json
{
  "success": false,
  "message": "O sorteio precisa ter valores sorteados definidos antes de ser realizado"
}
```

**Solução:**
```bash
# Primeiro, adicione os valores
PUT /api/sorteios/1
{
  "valoresSorteados": ["10", "25", "33", "42", "51", "60"]
}

# Depois, realize o sorteio
POST /api/sorteios/1/realizar
```

---

## Resumo

| Endpoint | Body Necessário | O que faz |
|----------|----------------|-----------|
| `POST /api/sorteios` | `{ nome, bolao, valoresSorteados? }` | Cria sorteio (valores opcionais) |
| `PUT /api/sorteios/:id` | `{ valoresSorteados? }` | Atualiza sorteio (incluindo valores) |
| `POST /api/sorteios/:id/realizar` | **VAZIO** | Processa sorteio usando valores já cadastrados |

---

## Swagger

Acesse http://localhost:8080/api-docs e veja a documentação atualizada do endpoint `/api/sorteios/{id}/realizar`.

Note que não há mais `requestBody` obrigatório! 🎉
