// Rotas para Sorteios
const express = require('express');
const router = express.Router();
const SorteioController = require('../controllers/SorteioController');

router.post('/', SorteioController.create);
router.get('/', SorteioController.getAll);
router.get('/:id', SorteioController.getById);
router.get('/buscar/:nome', SorteioController.getByNome);
router.put('/:id', SorteioController.update);
router.post('/:id/realizar', SorteioController.realizarSorteio);
router.delete('/:id', SorteioController.delete);

module.exports = router;
