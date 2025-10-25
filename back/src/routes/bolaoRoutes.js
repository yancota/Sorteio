// Rotas para Bolões
const express = require('express');
const router = express.Router();
const BolaoController = require('../controllers/BolaoController');

/**
 * @swagger
 * /api/boloes:
 *   post:
 *     summary: Criar novo bolão
 *     tags: [Bolões]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - valor
 *               - quantidadeCampeao
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Bolão da Copa
 *               valor:
 *                 type: number
 *                 format: double
 *                 example: 10.00
 *                 description: Valor do bolão
 *               quantidadeCampeao:
 *                 type: integer
 *                 example: 3
 *               reiniciarBolao:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Bolão criado com sucesso
 */
router.post('/', BolaoController.create);

/**
 * @swagger
 * /api/boloes:
 *   get:
 *     summary: Listar todos os bolões
 *     tags: [Bolões]
 *     responses:
 *       200:
 *         description: Lista de bolões
 */
router.get('/', BolaoController.getAll);

/**
 * @swagger
 * /api/boloes/ativos:
 *   get:
 *     summary: Listar bolões ativos
 *     tags: [Bolões]
 *     responses:
 *       200:
 *         description: Lista de bolões ativos
 */
router.get('/ativos', BolaoController.getAtivos);

/**
 * @swagger
 * /api/boloes/{id}:
 *   get:
 *     summary: Buscar bolão por ID
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bolão encontrado
 *       404:
 *         description: Bolão não encontrado
 */
router.get('/:id', BolaoController.getById);

/**
 * @swagger
 * /api/boloes/buscar/{nome}:
 *   get:
 *     summary: Buscar bolões por nome
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de bolões encontrados
 */
router.get('/buscar/:nome', BolaoController.getByNome);

/**
 * @swagger
 * /api/boloes/{id}:
 *   put:
 *     summary: Atualizar bolão
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Bolão atualizado com sucesso
 */
router.put('/:id', BolaoController.update);

/**
 * @swagger
 * /api/boloes/{id}/sorteios/{sorteioId}:
 *   post:
 *     summary: Adicionar sorteio ao bolão
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: sorteioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sorteio adicionado ao bolão
 */
router.post('/:id/sorteios/:sorteioId', BolaoController.addSorteio);

/**
 * @swagger
 * /api/boloes/{id}/sorteios/{sorteioId}:
 *   delete:
 *     summary: Remover sorteio do bolão
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: sorteioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sorteio removido do bolão
 */
router.delete('/:id/sorteios/:sorteioId', BolaoController.removeSorteio);

/**
 * @swagger
 * /api/boloes/{id}/reiniciar:
 *   post:
 *     summary: Reiniciar bolão
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bolão reiniciado com sucesso
 */
router.post('/:id/reiniciar', BolaoController.reiniciar);

/**
 * @swagger
 * /api/boloes/{id}:
 *   delete:
 *     summary: Deletar bolão
 *     tags: [Bolões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bolão deletado com sucesso
 */
router.delete('/:id', BolaoController.delete);

module.exports = router;
