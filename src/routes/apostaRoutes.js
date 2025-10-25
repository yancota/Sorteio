// Rotas para Apostas
const express = require('express');
const router = express.Router();
const ApostaController = require('../controllers/ApostaController');

router.post('/', ApostaController.create);
router.get('/', ApostaController.getAll);
router.get('/:id', ApostaController.getById);
router.get('/inscricao/:inscricaoId', ApostaController.getByInscricao);
router.get('/sorteio/:sorteioId', ApostaController.getBySorteio);
router.put('/:id', ApostaController.update);
router.post('/:id/calcular-acertos', ApostaController.calcularAcertos);
router.post('/sorteio/:sorteioId/calcular-acertos', ApostaController.calcularAcertosPorSorteio);
router.delete('/:id', ApostaController.delete);

module.exports = router;
