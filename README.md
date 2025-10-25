# 🎲 Sistema de Sorteio - API Backend

Sistema completo para gerenciamento de bolões e sorteios desenvolvido em Node.js com Express.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Swagger** - Documentação interativa da API
- **Nodemon** - Auto-reload em desenvolvimento

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Rodar em produção
npm start
```

## 🌐 Servidor

A aplicação roda por padrão na porta **8080**:
- API: `http://localhost:8080`
- Documentação Swagger: `http://localhost:8080/api-docs`

## 📚 Documentação da API

Acesse a documentação interativa completa em:
**http://localhost:8080/api-docs**

A documentação Swagger permite:
- ✅ Visualizar todos os endpoints
- ✅ Testar requisições diretamente no navegador
- ✅ Ver exemplos de request/response
- ✅ Consultar schemas dos modelos

## 🗂️ Estrutura do Projeto

```
src/
├── config/          # Configurações (Swagger, etc)
├── controllers/     # Controllers (lógica HTTP)
├── models/          # Modelos de dados
├── repositories/    # Repositories (acesso a dados)
├── services/        # Services (lógica de negócio)
├── routes/          # Rotas da API
├── middlewares/     # Middlewares customizados
├── utils/           # Utilitários
└── index.js         # Arquivo principal
```

## 🎯 Principais Endpoints

### Usuários
- `POST /api/usuarios` - Criar usuário
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/:id` - Buscar por ID
- `PUT /api/usuarios/:id` - Atualizar
- `DELETE /api/usuarios/:id` - Deletar

### Bolões
- `POST /api/boloes` - Criar bolão
- `GET /api/boloes` - Listar bolões
- `GET /api/boloes/ativos` - Listar ativos
- `POST /api/boloes/:id/sorteios/:sorteioId` - Adicionar sorteio

### Apostas
- `POST /api/apostas` - Criar aposta
- `POST /api/apostas/:id/calcular-acertos` - Calcular acertos
- `GET /api/apostas/sorteio/:sorteioId` - Listar por sorteio

**Para documentação completa, veja `/api-docs`**

## 📋 Entidades do Sistema

- **Usuario** - Usuários do sistema
- **Grupo** - Grupos de usuários
- **Sorteio** - Sorteios individuais
- **Bolao** - Bolões (conjunto de sorteios)
- **InscricaoBolao** - Inscrições de usuários em bolões
- **Aposta** - Apostas dos usuários nos sorteios

## 🔧 Scripts Disponíveis

```bash
npm start       # Iniciar servidor em produção
npm run dev     # Iniciar em modo desenvolvimento com auto-reload
```

## 📝 Licença

ISC
Aplicação para controle de sorteios de usuários em Node.js
