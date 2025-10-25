// Rotas para Grupos
const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/GrupoController');

/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Criar novo grupo
 *     tags: [Grupos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - usuarioResponsavel
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Grupo dos Amigos
 *               usuarioResponsavel:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *       400:
 *         description: Erro na validação
 */
router.post('/', GrupoController.create);

/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Listar todos os grupos
 *     tags: [Grupos]
 *     responses:
 *       200:
 *         description: Lista de grupos
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
 *                     $ref: '#/components/schemas/Grupo'
 */
router.get('/', GrupoController.getAll);

/**
 * @swagger
 * /api/grupos/{id}:
 *   get:
 *     summary: Buscar grupo por ID
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Grupo encontrado
 *       404:
 *         description: Grupo não encontrado
 */
router.get('/:id', GrupoController.getById);

/**
 * @swagger
 * /api/grupos/responsavel/{usuarioId}:
 *   get:
 *     summary: Buscar grupos por usuário responsável
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário responsável
 *     responses:
 *       200:
 *         description: Lista de grupos do responsável
 */
router.get('/responsavel/:usuarioId', GrupoController.getByUsuarioResponsavel);

/**
 * @swagger
 * /api/grupos/{id}:
 *   put:
 *     summary: Atualizar grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               usuarioResponsavel:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Grupo atualizado com sucesso
 *       400:
 *         description: Erro na validação
 *       404:
 *         description: Grupo não encontrado
 */
router.put('/:id', GrupoController.update);

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Deletar grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Grupo deletado com sucesso
 *       400:
 *         description: Erro ao deletar
 *       404:
 *         description: Grupo não encontrado
 */
router.delete('/:id', GrupoController.delete);

module.exports = router;
