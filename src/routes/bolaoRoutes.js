// Rotas para Bolões
const express = require('express');
const router = express.Router();
const BolaoController = require('../controllers/BolaoController');

router.post('/', BolaoController.create);
router.get('/', BolaoController.getAll);
router.get('/ativos', BolaoController.getAtivos);
router.get('/:id', BolaoController.getById);
router.get('/buscar/:nome', BolaoController.getByNome);
router.put('/:id', BolaoController.update);
router.post('/:id/sorteios/:sorteioId', BolaoController.addSorteio);
router.delete('/:id/sorteios/:sorteioId', BolaoController.removeSorteio);
router.post('/:id/reiniciar', BolaoController.reiniciar);
router.delete('/:id', BolaoController.delete);

module.exports = router;
