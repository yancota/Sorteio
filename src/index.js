const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar rotas
const routes = require('./routes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Sorteio - Sistema rodando!',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      grupos: '/api/grupos',
      sorteios: '/api/sorteios',
      boloes: '/api/boloes',
      inscricoes: '/api/inscricoes',
      apostas: '/api/apostas'
    }
  });
});

// Rotas da API
app.use('/api', routes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;
