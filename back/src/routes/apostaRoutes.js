// Rotas para Apostas
const express = require('express');
const router = express.Router();
const ApostaController = require('../controllers/ApostaController');

/**
 * @swagger
 * /api/apostas:
 *   post:
 *     summary: Criar nova aposta
 *     tags: [Apostas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inscricaoBolao
 *               - valoresEscolhidos
 *             properties:
 *               inscricaoBolao:
 *                 type: integer
 *                 example: 1
 *                 description: ID da inscrição no bolão
 *               valoresEscolhidos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["10", "25", "33", "42", "51", "60"]
 *                 description: Números escolhidos (valem para todos os sorteios do bolão)
 *     responses:
 *       201:
 *         description: Aposta criada com sucesso
 *       400:
 *         description: Erro na validação
 */
router.post('/', ApostaController.create);

/**
 * @swagger
 * /api/apostas:
 *   get:
 *     summary: Listar todas as apostas
 *     tags: [Apostas]
 *     responses:
 *       200:
 *         description: Lista de apostas
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
 *                     $ref: '#/components/schemas/Aposta'
 */
router.get('/', ApostaController.getAll);

/**
 * @swagger
 * /api/apostas/{id}:
 *   get:
 *     summary: Buscar aposta por ID
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da aposta
 *     responses:
 *       200:
 *         description: Aposta encontrada
 *       404:
 *         description: Aposta não encontrada
 */
router.get('/:id', ApostaController.getById);

/**
 * @swagger
 * /api/apostas/inscricao/{inscricaoId}:
 *   get:
 *     summary: Buscar apostas por inscrição
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: inscricaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Lista de apostas da inscrição
 */
router.get('/inscricao/:inscricaoId', ApostaController.getByInscricao);

/**
 * @swagger
 * /api/apostas/bolao/{bolaoId}:
 *   get:
 *     summary: Buscar apostas por bolão
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: bolaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bolão
 *     responses:
 *       200:
 *         description: Lista de apostas do bolão
 */
router.get('/bolao/:bolaoId', ApostaController.getByBolao);

/**
 * @swagger
 * /api/apostas/{id}:
 *   put:
 *     summary: Atualizar aposta
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da aposta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valoresEscolhidos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Aposta atualizada com sucesso
 *       400:
 *         description: Erro na validação (sorteio já realizado)
 *       404:
 *         description: Aposta não encontrada
 */
router.put('/:id', ApostaController.update);

/**
 * @swagger
 * /api/apostas/{id}/calcular-acertos/{sorteioId}:
 *   post:
 *     summary: Calcular acertos de uma aposta para um sorteio específico
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da aposta
 *       - in: path
 *         name: sorteioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sorteio
 *     responses:
 *       200:
 *         description: Acertos calculados com sucesso
 *       400:
 *         description: Sorteio ainda não foi realizado
 *       404:
 *         description: Aposta não encontrada
 */
router.post('/:id/calcular-acertos/:sorteioId', ApostaController.calcularAcertos);

/**
 * @swagger
 * /api/apostas/bolao/{bolaoId}/sorteio/{sorteioId}/calcular-acertos:
 *   post:
 *     summary: Calcular acertos de todas as apostas de um bolão para um sorteio
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: bolaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bolão
 *       - in: path
 *         name: sorteioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do sorteio
 *     responses:
 *       200:
 *         description: Acertos calculados para todas as apostas
 *       400:
 *         description: Erro ao calcular acertos
 */
router.post('/bolao/:bolaoId/sorteio/:sorteioId/calcular-acertos', ApostaController.calcularAcertosPorSorteio);

/**
 * @swagger
 * /api/apostas/{id}:
 *   delete:
 *     summary: Deletar aposta
 *     tags: [Apostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da aposta
 *     responses:
 *       200:
 *         description: Aposta deletada com sucesso
 *       400:
 *         description: Erro ao deletar
 *       404:
 *         description: Aposta não encontrada
 */
router.delete('/:id', ApostaController.delete);

module.exports = router;
