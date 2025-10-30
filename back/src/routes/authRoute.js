// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // O controller que valida pelo .env
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: sua_senha_aqui
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Usuário ou senha inválidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/login', authController.login);

module.exports = router;