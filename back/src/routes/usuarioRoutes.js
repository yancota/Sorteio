// src/routes/usuarioRoutes.js
    const express = require('express');
    const router = express.Router();
    const UsuarioController = require('../controllers/UsuarioController');

    // --- Nossos Middlewares ---
    const authMiddleware = require('../middlewares/authMiddleware');
    const checkRole = require('../middlewares/checkRole');

    const adminOnly = [
        authMiddleware,
        checkRole('admin')
    ];

    /**
     * @swagger
     * /api/usuarios:
     *   post:
     *     summary: Criar novo usuário (Admin)
     *     tags:
     *       - Usuários
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nome
     *               - telefone
     *             properties:
     *               nome:
     *                 type: string
     *                 example: João Silva
     *               telefone:
     *                 type: string
     *                 example: "11999999999"
     *               grupo:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *     responses:
     *       '201':
     *         description: Usuário criado com sucesso
     *       '400':
     *         description: Erro na validação
     *       '401':
     *         description: Token inválido ou não fornecido
     *       '403':
     *         description: Acesso negado (não é admin)
     */
    router.post('/', adminOnly, UsuarioController.create);

    /**
     * @swagger
     * /api/usuarios:
     *   get:
     *     summary: Listar todos os usuários (Admin)
     *     tags:
     *       - Usuários
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Lista de usuários
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
     *                     $ref: '#/components/schemas/Usuario'
     */
    router.get('/', adminOnly, UsuarioController.getAll);

    /**
     * @swagger
     * /api/usuarios/{id}:
     *   get:
     *     summary: Buscar usuário por ID (Admin)
     *     tags:
     *       - Usuários
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do usuário
     *     responses:
     *       '200':
     *         description: Usuário encontrado
     *       '404':
     *         description: Usuário não encontrado
     */
    router.get('/:id', adminOnly, UsuarioController.getById);

    /**
     * @swagger
     * /api/usuarios/grupo/{grupoId}:
     *   get:
     *     summary: Buscar usuários por grupo (Admin)
     *     tags:
     *       - Usuários
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: grupoId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do grupo
     *     responses:
     *       '200':
     *         description: Lista de usuários do grupo
     */
    router.get('/grupo/:grupoId', adminOnly, UsuarioController.getByGrupo);

    /**
     * @swagger
     * /api/usuarios/{id}:
     *   put:
     *     summary: Atualizar usuário (Admin)
     *     tags:
     *       - Usuários
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do usuário
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               telefone:
     *                 type: string
     *               grupo:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *     responses:
     *       '200':
     *         description: Usuário atualizado com sucesso
     *       '400':
     *         description: Erro na validação
     *       '404':
     *         description: Usuário não encontrado
     */
    router.put('/:id', adminOnly, UsuarioController.update);

    /**
     * @swagger
     * /api/usuarios/{id}:
     *   delete:
     *     summary: Deletar usuário (Admin)
     *     tags:
     *       - Usuários
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do usuário
     *     responses:
     *       '200':
     *         description: Usuário deletado com sucesso
     *       '400':
     *         description: Erro ao deletar
     *       '404':
     *         description: Usuário não encontrado
     */
    router.delete('/:id', adminOnly, UsuarioController.delete);

    module.exports = router;