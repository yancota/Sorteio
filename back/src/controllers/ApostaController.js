// Controller para gerenciar requisições HTTP de Apostas
const ApostaService = require('../services/ApostaService');

class ApostaController {
  // POST /apostas - Criar nova aposta
  async create(req, res) {
    try {
      const aposta = await ApostaService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Aposta criada com sucesso',
        data: aposta
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /apostas - Listar todas as apostas
  async getAll(req, res) {
    try {
      const apostas = await ApostaService.getAll();
      return res.status(200).json({
        success: true,
        data: apostas
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /apostas/:id - Buscar aposta por ID
  async getById(req, res) {
    try {
      const aposta = await ApostaService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: aposta
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /apostas/inscricao/:inscricaoId - Buscar apostas por inscrição
  async getByInscricao(req, res) {
    try {
      const apostas = await ApostaService.getByInscricao(req.params.inscricaoId);
      return res.status(200).json({
        success: true,
        data: apostas
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /apostas/bolao/:bolaoId - Buscar apostas por bolão
  async getByBolao(req, res) {
    try {
      const apostas = await ApostaService.getByBolao(req.params.bolaoId);
      return res.status(200).json({
        success: true,
        data: apostas
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /apostas/:id - Atualizar aposta
  async update(req, res) {
    try {
      const aposta = await ApostaService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Aposta atualizada com sucesso',
        data: aposta
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /apostas/:id/calcular-acertos/:sorteioId - Calcular acertos da aposta para um sorteio
  async calcularAcertos(req, res) {
    try {
      const resultado = await ApostaService.calcularAcertos(req.params.id, req.params.sorteioId);
      return res.status(200).json({
        success: true,
        message: 'Acertos calculados com sucesso',
        data: resultado
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /apostas/bolao/:bolaoId/sorteio/:sorteioId/calcular-acertos - Calcular acertos de todas as apostas
  async calcularAcertosPorSorteio(req, res) {
    try {
      const resultados = await ApostaService.calcularAcertosPorSorteio(req.params.bolaoId, req.params.sorteioId);
      return res.status(200).json({
        success: true,
        message: 'Acertos calculados com sucesso',
        data: resultados
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /apostas/:id - Deletar aposta
  async delete(req, res) {
    try {
      await ApostaService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Aposta deletada com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ApostaController();
