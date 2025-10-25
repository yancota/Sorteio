# 🏆 Endpoint de Ranking Completo do Bolão

## GET /api/inscricoes/bolao/:bolaoId/ranking

Este endpoint retorna todas as informações necessárias para exibir o ranking completo de um bolão.

---

## Estrutura da Resposta (DTO)

```json
{
  "success": true,
  "data": {
    "bolao": {
      "id": 1,
      "nome": "Bolão da Mega Sena 2025",
      "valor": 15.00,
      "quantidadeCampeao": 1
    },
    "participantes": [
      {
        "posicao": 1,
        "inscricaoId": 1,
        "usuario": {
          "id": 1,
          "nome": "João Silva",
          "telefone": "11999999999"
        },
        "valoresEscolhidos": ["10", "25", "33", "42", "51", "60"],
        "pontuacaoTotal": 7,
        "totalAcertos": 7,
        "resultadosPorSorteio": [
          {
            "sorteioId": 1,
            "sorteioNome": "Concurso 2500",
            "valoresAcertados": ["10", "25", "33"],
            "pontuacao": 3
          },
          {
            "sorteioId": 2,
            "sorteioNome": "Concurso 2501",
            "valoresAcertados": ["10", "42", "51", "60"],
            "pontuacao": 4
          }
        ],
        "apto": true
      },
      {
        "posicao": 2,
        "inscricaoId": 2,
        "usuario": {
          "id": 2,
          "nome": "Maria Santos",
          "telefone": "11988888888"
        },
        "valoresEscolhidos": ["05", "15", "25", "35", "45", "55"],
        "pontuacaoTotal": 2,
        "totalAcertos": 2,
        "resultadosPorSorteio": [
          {
            "sorteioId": 1,
            "sorteioNome": "Concurso 2500",
            "valoresAcertados": ["25"],
            "pontuacao": 1
          },
          {
            "sorteioId": 2,
            "sorteioNome": "Concurso 2501",
            "valoresAcertados": [],
            "pontuacao": 0
          }
        ],
        "apto": true
      }
    ],
    "sorteios": [
      {
        "id": 1,
        "nome": "Concurso 2500",
        "valoresSorteados": ["10", "25", "33", "45", "52", "61"],
        "realizado": true
      },
      {
        "id": 2,
        "nome": "Concurso 2501",
        "valoresSorteados": ["10", "42", "51", "60", "55", "58"],
        "realizado": true
      },
      {
        "id": 3,
        "nome": "Concurso 2502",
        "valoresSorteados": [],
        "realizado": false
      }
    ]
  }
}
```

---

## Campos do Response

### `bolao`
Informações básicas do bolão:
- `id`: ID do bolão
- `nome`: Nome do bolão
- `valor`: Valor da aposta
- `quantidadeCampeao`: Quantidade de vencedores

### `participantes` (Array)
Lista de todos os participantes **ordenados por pontuação** (ranking):

- `posicao`: Posição no ranking (1º, 2º, 3º, etc.)
- `inscricaoId`: ID da inscrição
- `usuario`: Dados do usuário
  - `id`: ID do usuário
  - `nome`: Nome do usuário
  - `telefone`: Telefone do usuário
- `valoresEscolhidos`: Array com os números escolhidos pela pessoa
- `pontuacaoTotal`: Pontuação total acumulada (soma de todos os sorteios)
- `totalAcertos`: Total de números acertados (soma de todas as pontuações)
- `resultadosPorSorteio`: Array com detalhes de cada sorteio
  - `sorteioId`: ID do sorteio
  - `sorteioNome`: Nome do sorteio
  - `valoresAcertados`: Números que a pessoa acertou neste sorteio específico
  - `pontuacao`: Quantidade de acertos neste sorteio
- `apto`: Se a inscrição está apta

### `sorteios` (Array)
Lista de **todos os sorteios do bolão** (realizados ou não):

- `id`: ID do sorteio
- `nome`: Nome do sorteio
- `valoresSorteados`: Números que foram sorteados
- `realizado`: `true` se já foi realizado, `false` se ainda não

---

## Exemplo de Uso

### Request
```bash
GET /api/inscricoes/bolao/1/ranking
```

### Response de Sucesso (200)
```json
{
  "success": true,
  "data": {
    "bolao": { ... },
    "participantes": [ ... ],
    "sorteios": [ ... ]
  }
}
```

### Response de Erro (404)
```json
{
  "success": false,
  "message": "Bolão não encontrado"
}
```

---

## Casos de Uso

### 1. Exibir Ranking na Tela
```javascript
fetch('/api/inscricoes/bolao/1/ranking')
  .then(res => res.json())
  .then(data => {
    const { bolao, participantes, sorteios } = data.data;
    
    // Exibir informações do bolão
    console.log(`Bolão: ${bolao.nome} - R$ ${bolao.valor}`);
    
    // Exibir ranking
    participantes.forEach(p => {
      console.log(`${p.posicao}º - ${p.usuario.nome}: ${p.pontuacaoTotal} pontos`);
      console.log(`Números: ${p.valoresEscolhidos.join(', ')}`);
    });
    
    // Exibir sorteios realizados
    sorteios.filter(s => s.realizado).forEach(s => {
      console.log(`${s.nome}: ${s.valoresSorteados.join(', ')}`);
    });
  });
```

### 2. Ver Acertos Detalhados de um Participante
```javascript
const participante = participantes[0]; // Primeiro colocado

console.log(`${participante.usuario.nome} escolheu:`);
console.log(participante.valoresEscolhidos.join(', '));

console.log('\nResultados por sorteio:');
participante.resultadosPorSorteio.forEach(r => {
  console.log(`${r.sorteioNome}:`);
  console.log(`  Acertou: ${r.valoresAcertados.join(', ')}`);
  console.log(`  Pontos: ${r.pontuacao}`);
});
```

### 3. Comparar Números Escolhidos com Sorteados
```javascript
sorteios.filter(s => s.realizado).forEach(sorteio => {
  console.log(`\n${sorteio.nome}: ${sorteio.valoresSorteados.join(', ')}`);
  
  participantes.forEach(p => {
    const resultado = p.resultadosPorSorteio.find(r => r.sorteioId === sorteio.id);
    if (resultado) {
      console.log(`  ${p.usuario.nome}: ${resultado.pontuacao} acertos`);
    }
  });
});
```

---

## Observações Importantes

### 1. Ordenação Automática
Os participantes já vêm **ordenados por pontuação** (do maior para o menor).
O campo `posicao` já está calculado.

### 2. Sorteios Realizados vs Não Realizados
- Sorteios com `valoresSorteados.length > 0` têm `realizado: true`
- Sorteios sem valores ou com array vazio têm `realizado: false`
- Apenas sorteios realizados têm resultados calculados

### 3. Participantes Sem Aposta
Se um participante se inscreveu mas não fez aposta:
- `valoresEscolhidos` será um array vazio `[]`
- `resultadosPorSorteio` será um array vazio `[]`
- `pontuacaoTotal` será `0`

### 4. Performance
Este endpoint pode ser "pesado" se houver muitos participantes e sorteios.
Considere implementar cache ou paginação em produção.

---

## Fluxo Completo de Exemplo

```bash
# 1. Criar bolão
POST /api/boloes
{"nome": "Bolão 2025", "valor": 10.00, "quantidadeCampeao": 1}
# Resposta: { "id": 1, ... }

# 2. Criar sorteio 1
POST /api/sorteios
{"nome": "Concurso 2500", "bolao": 1, "valoresSorteados": ["10","25","33","42","51","60"]}

# 3. Criar sorteio 2
POST /api/sorteios
{"nome": "Concurso 2501", "bolao": 1}

# 4. Inscrever usuários
POST /api/inscricoes
{"bolao": 1, "usuario": 1}

POST /api/inscricoes
{"bolao": 1, "usuario": 2}

# 5. Fazer apostas
POST /api/apostas
{"inscricaoBolao": 1, "valoresEscolhidos": ["10","25","33","42","51","60"]}

POST /api/apostas
{"inscricaoBolao": 2, "valoresEscolhidos": ["05","15","25","35","45","55"]}

# 6. Realizar sorteio 1
POST /api/sorteios/1/realizar

# 7. Ver ranking (sorteio 1 já calculado)
GET /api/inscricoes/bolao/1/ranking

# 8. Adicionar valores ao sorteio 2
PUT /api/sorteios/2
{"valoresSorteados": ["10","42","51","60","55","58"]}

# 9. Realizar sorteio 2
POST /api/sorteios/2/realizar

# 10. Ver ranking final (ambos sorteios)
GET /api/inscricoes/bolao/1/ranking
```

---

## Swagger

Acesse http://localhost:8080/api-docs e teste o endpoint interativamente! 🎉

Veja a documentação completa com exemplos de resposta.
