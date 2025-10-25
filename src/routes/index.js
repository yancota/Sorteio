// Arquivo central de rotas
const express = require('express');
const router = express.Router();

// Importar rotas
const usuarioRoutes = require('./usuarioRoutes');
const grupoRoutes = require('./grupoRoutes');
const sorteioRoutes = require('./sorteioRoutes');
const bolaoRoutes = require('./bolaoRoutes');
const inscricaoBolaoRoutes = require('./inscricaoBolaoRoutes');
const apostaRoutes = require('./apostaRoutes');

// Configurar rotas
router.use('/usuarios', usuarioRoutes);
router.use('/grupos', grupoRoutes);
router.use('/sorteios', sorteioRoutes);
router.use('/boloes', bolaoRoutes);
router.use('/inscricoes', inscricaoBolaoRoutes);
router.use('/apostas', apostaRoutes);

module.exports = router;
