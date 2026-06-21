require('dotenv').config({ path: '.env.bolao' });

      if (process.env.RUN_INIT_DB === "true") {
        const { Client } = require('pg');
        const fs = require('fs');
        const path = require('path');

        async function runInitScript() {
          const client = new Client({
            connectionString: process.env.DATABASE_URL
          });
          await client.connect();

          const sql = fs.readFileSync(path.join(__dirname, '../init-db.sql'), 'utf8');
          await client.query(sql);

          await client.end();
          console.log('Script de inicialização do banco executado.');
        }

        runInitScript()
          .then(startApp)
          .catch(err => {
            console.error('Erro ao executar init-db.sql:', err);
            process.exit(1);
          });
      } else {
        startApp();
      }

      function startApp() {
        const express = require('express');
        const swaggerUi = require('swagger-ui-express');
        const swaggerSpec = require('./config/swagger');
        const app = express();
        const PORT = process.env.PORT || 8080;

        const routes = require('./routes');
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        const cors = require('./middlewares/cors');
        app.use(cors);

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'API Sorteio - Documentação'
        }));

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

        app.use('/api', routes);

        if (process.env.NODE_ENV !== 'test') {
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
        }

        module.exports = app;
      }