require('dotenv').config({ path: '.env.bolao' });
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();
const PORT = process.env.PORT || 8080;

// Importar rotas
const routes = require('./routes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS
const cors = require('./middlewares/cors');
app.use(cors);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Sorteio - Documentação'
}));

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Sorteio - Sistema rodando!',
    version: '1.0.0',
    documentation: '/api-docs',
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
  console.log(`Documentação: http://localhost:${PORT}/api-docs`);
  console.log(`\nConfiguração do Banco:`);
  console.log(`- Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`- Port: ${process.env.DB_PORT || '5432'}`);
  console.log(`- Database: ${process.env.DB_NAME || 'sorteio'}`);
  console.log(`- User: ${process.env.DB_USER || 'postgres'}`);
});

module.exports = app;
