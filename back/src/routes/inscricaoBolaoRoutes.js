// Rotas para Inscrições em Bolões
const express = require('express');
const router = express.Router();
const InscricaoBolaoController = require('../controllers/InscricaoBolaoController');

/**
 * @swagger
 * /api/inscricoes:
 *   post:
 *     summary: Criar nova inscrição em bolão
 *     tags: [Inscrições]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bolao
 *               - usuario
 *             properties:
 *               bolao:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *               usuario:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *               apto:
 *                 type: boolean
 *                 example: true
 *               pontuacaoTotal:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso
 *       400:
 *         description: Erro na validação
 */
router.post('/', InscricaoBolaoController.create);

/**
 * @swagger
 * /api/inscricoes:
 *   get:
 *     summary: Listar todas as inscrições
 *     tags: [Inscrições]
 *     responses:
 *       200:
 *         description: Lista de inscrições
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
 *                     $ref: '#/components/schemas/InscricaoBolao'
 */
router.get('/', InscricaoBolaoController.getAll);

/**
 * @swagger
 * /api/inscricoes/{id}:
 *   get:
 *     summary: Buscar inscrição por ID
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Inscrição encontrada
 *       404:
 *         description: Inscrição não encontrada
 */
router.get('/:id', InscricaoBolaoController.getById);

/**
 * @swagger
 * /api/inscricoes/bolao/{bolaoId}:
 *   get:
 *     summary: Buscar inscrições por bolão
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: bolaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bolão
 *     responses:
 *       200:
 *         description: Lista de inscrições do bolão
 */
router.get('/bolao/:bolaoId', InscricaoBolaoController.getByBolao);

/**
 * @swagger
 * /api/inscricoes/usuario/{usuarioId}:
 *   get:
 *     summary: Buscar inscrições por usuário
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de inscrições do usuário
 */
router.get('/usuario/:usuarioId', InscricaoBolaoController.getByUsuario);

/**
 * @swagger
 * /api/inscricoes/bolao/{bolaoId}/aptas:
 *   get:
 *     summary: Buscar inscrições aptas de um bolão
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: bolaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bolão
 *     responses:
 *       200:
 *         description: Lista de inscrições aptas
 */
router.get('/bolao/:bolaoId/aptas', InscricaoBolaoController.getAptasByBolao);

/**
 * @swagger
 * /api/inscricoes/bolao/{bolaoId}/ranking:
 *   get:
 *     summary: Obter ranking completo do bolão
 *     description: Retorna informações otimizadas do bolão incluindo participantes com valores escolhidos, pontuação e posição no ranking
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: bolaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bolão
 *     responses:
 *       200:
 *         description: Ranking completo do bolão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     bolao:
 *                       type: string
 *                       description: Nome do bolão
 *                       example: "Bolão da Copa 2026"
 *                     participantes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                             description: Nome do participante
 *                             example: "João Silva"
 *                           valoresEscolhidos:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Números escolhidos pelo participante
 *                             example: ["7", "14", "21", "28", "35", "42", "49", "56", "63", "70"]
 *                           pontuacaoTotal:
 *                             type: integer
 *                             description: Pontuação total acumulada
 *                             example: 150
 *                           posicao:
 *                             type: integer
 *                             description: Posição no ranking
 *                             example: 1
 *                     sorteios:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                             description: Nome do sorteio
 *                             example: "Sorteio 1"
 *                           valoresSorteados:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Números sorteados
 *                             example: ["7", "14", "21", "28", "35"]
 *       404:
 *         description: Bolão não encontrado
 */
router.get('/bolao/:bolaoId/ranking', InscricaoBolaoController.getRanking);

/**
 * @swagger
 * /api/inscricoes/{id}:
 *   put:
 *     summary: Atualizar inscrição
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apto:
 *                 type: boolean
 *               pontuacaoTotal:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inscrição atualizada com sucesso
 *       400:
 *         description: Erro na validação
 *       404:
 *         description: Inscrição não encontrada
 */
router.put('/:id', InscricaoBolaoController.update);

/**
 * @swagger
 * /api/inscricoes/{id}/pontuacao:
 *   post:
 *     summary: Adicionar pontuação à inscrição
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pontos
 *             properties:
 *               pontos:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Pontuação adicionada com sucesso
 *       400:
 *         description: Erro na validação
 */
router.post('/:id/pontuacao', InscricaoBolaoController.adicionarPontuacao);

/**
 * @swagger
 * /api/inscricoes/{id}/resetar-pontuacao:
 *   post:
 *     summary: Resetar pontuação da inscrição para zero
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Pontuação resetada com sucesso
 *       404:
 *         description: Inscrição não encontrada
 */
router.post('/:id/resetar-pontuacao', InscricaoBolaoController.resetarPontuacao);

/**
 * @swagger
 * /api/inscricoes/{id}:
 *   delete:
 *     summary: Deletar inscrição
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Inscrição deletada com sucesso
 *       400:
 *         description: Erro ao deletar
 *       404:
 *         description: Inscrição não encontrada
 */
router.delete('/:id', InscricaoBolaoController.delete);

module.exports = router;
