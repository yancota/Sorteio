// Rotas para Grupos
const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/GrupoController');

router.post('/', GrupoController.create);
router.get('/', GrupoController.getAll);
router.get('/:id', GrupoController.getById);
router.get('/responsavel/:usuarioId', GrupoController.getByUsuarioResponsavel);
router.put('/:id', GrupoController.update);
router.delete('/:id', GrupoController.delete);

module.exports = router;
