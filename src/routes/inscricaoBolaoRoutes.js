// Rotas para Inscrições em Bolões
const express = require('express');
const router = express.Router();
const InscricaoBolaoController = require('../controllers/InscricaoBolaoController');

router.post('/', InscricaoBolaoController.create);
router.get('/', InscricaoBolaoController.getAll);
router.get('/:id', InscricaoBolaoController.getById);
router.get('/bolao/:bolaoId', InscricaoBolaoController.getByBolao);
router.get('/usuario/:usuarioId', InscricaoBolaoController.getByUsuario);
router.get('/bolao/:bolaoId/aptas', InscricaoBolaoController.getAptasByBolao);
router.get('/bolao/:bolaoId/ranking', InscricaoBolaoController.getRanking);
router.put('/:id', InscricaoBolaoController.update);
router.post('/:id/pontuacao', InscricaoBolaoController.adicionarPontuacao);
router.post('/:id/resetar-pontuacao', InscricaoBolaoController.resetarPontuacao);
router.delete('/:id', InscricaoBolaoController.delete);

module.exports = router;
