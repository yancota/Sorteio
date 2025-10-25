// Rotas para Sorteios
const express = require('express');
const router = express.Router();
const SorteioController = require('../controllers/SorteioController');

/**
 * @swagger
 * /api/sorteios:
 *   post:
 *     summary: Criar novo sorteio
 *     tags: [Sorteios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - valor
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Mega Sena - Concurso 2500
 *               valor:
 *                 type: number
 *                 format: double
 *                 example: 5.00
 *               valoresSorteados:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *     responses:
 *       201:
 *         description: Sorteio criado com sucesso
 *       400:
 *         description: Erro na validação
 */
router.post('/', SorteioController.create);

/**
 * @swagger
 * /api/sorteios:
 *   get:
 *     summary: Listar todos os sorteios
 *     tags: [Sorteios]
 *     responses:
 *       200:
 *         description: Lista de sorteios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sorteio'
 */
router.get('/', SorteioController.getAll);

/**
 * @swagger
 * /api/sorteios/{id}:
 *   get:
 *     summary: Buscar sorteio por ID
 *     tags: [Sorteios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sorteio
 *     responses:
 *       200:
 *         description: Sorteio encontrado
 *       404:
 *         description: Sorteio não encontrado
 */
router.get('/:id', SorteioController.getById);

/**
 * @swagger
 * /api/sorteios/buscar/{nome}:
 *   get:
 *     summary: Buscar sorteios por nome
 *     tags: [Sorteios]
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do sorteio
 *     responses:
 *       200:
 *         description: Lista de sorteios encontrados
 */
router.get('/buscar/:nome', SorteioController.getByNome);

/**
 * @swagger
 * /api/sorteios/bolao/{bolaoId}:
 *   get:
 *     summary: Buscar sorteios por bolão
 *     tags: [Sorteios]
 *     parameters:
 *       - in: path
 *         name: bolaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bolão
 *     responses:
 *       200:
 *         description: Lista de sorteios do bolão
 */
router.get('/bolao/:bolaoId', SorteioController.getByBolao);

/**
 * @swagger
 * /api/sorteios/{id}:
 *   put:
 *     summary: Atualizar sorteio
 *     tags: [Sorteios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sorteio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               valor:
 *                 type: number
 *                 format: double
 *               valoresSorteados:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sorteio atualizado com sucesso
 *       400:
 *         description: Erro na validação
 *       404:
 *         description: Sorteio não encontrado
 */
router.put('/:id', SorteioController.update);

/**
 * @swagger
 * /api/sorteios/{id}/realizar:
 *   post:
 *     summary: Realizar sorteio (definir números sorteados)
 *     tags: [Sorteios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sorteio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valoresSorteados
 *             properties:
 *               valoresSorteados:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["10", "25", "33", "42", "51", "60"]
 *     responses:
 *       200:
 *         description: Sorteio realizado com sucesso
 *       400:
 *         description: Erro na validação
 *       404:
 *         description: Sorteio não encontrado
 */
router.post('/:id/realizar', SorteioController.realizarSorteio);

/**
 * @swagger
 * /api/sorteios/{id}:
 *   delete:
 *     summary: Deletar sorteio
 *     tags: [Sorteios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sorteio
 *     responses:
 *       200:
 *         description: Sorteio deletado com sucesso
 *       400:
 *         description: Erro ao deletar
 *       404:
 *         description: Sorteio não encontrado
 */
router.delete('/:id', SorteioController.delete);

module.exports = router;
