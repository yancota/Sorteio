// Controller para gerenciar requisições HTTP de Inscrições em Bolões
const InscricaoBolaoService = require('../services/InscricaoBolaoService');

class InscricaoBolaoController {
  // POST /inscricoes - Criar nova inscrição
  async create(req, res) {
    try {
      const inscricao = await InscricaoBolaoService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Inscrição criada com sucesso',
        data: inscricao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /inscricoes - Listar todas as inscrições
  async getAll(req, res) {
    try {
      const inscricoes = await InscricaoBolaoService.getAll();
      return res.status(200).json({
        success: true,
        data: inscricoes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /inscricoes/:id - Buscar inscrição por ID
  async getById(req, res) {
    try {
      const inscricao = await InscricaoBolaoService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: inscricao
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /inscricoes/bolao/:bolaoId - Buscar inscrições por bolão
  async getByBolao(req, res) {
    try {
      const inscricoes = await InscricaoBolaoService.getByBolao(req.params.bolaoId);
      return res.status(200).json({
        success: true,
        data: inscricoes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /inscricoes/usuario/:usuarioId - Buscar inscrições por usuário
  async getByUsuario(req, res) {
    try {
      const inscricoes = await InscricaoBolaoService.getByUsuario(req.params.usuarioId);
      return res.status(200).json({
        success: true,
        data: inscricoes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /inscricoes/bolao/:bolaoId/aptas - Buscar inscrições aptas por bolão
  async getAptasByBolao(req, res) {
    try {
      const inscricoes = await InscricaoBolaoService.getAptasByBolao(req.params.bolaoId);
      return res.status(200).json({
        success: true,
        data: inscricoes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /inscricoes/bolao/:bolaoId/ranking - Obter ranking do bolão
  async getRanking(req, res) {
    try {
      const ranking = await InscricaoBolaoService.getRanking(req.params.bolaoId);
      return res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /inscricoes/:id - Atualizar inscrição
  async update(req, res) {
    try {
      const inscricao = await InscricaoBolaoService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Inscrição atualizada com sucesso',
        data: inscricao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /inscricoes/:id/pontuacao - Adicionar pontuação
  async adicionarPontuacao(req, res) {
    try {
      const inscricao = await InscricaoBolaoService.adicionarPontuacao(
          req.params.id,
          req.body.pontos
      );
      return res.status(200).json({
        success: true,
        message: 'Pontuação adicionada com sucesso',
        data: inscricao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /inscricoes/:id/resetar-pontuacao - Resetar pontuação
  async resetarPontuacao(req, res) {
    try {
      const inscricao = await InscricaoBolaoService.resetarPontuacao(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Pontuação resetada com sucesso',
        data: inscricao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /inscricoes/:id - Deletar inscrição
  async delete(req, res) {
    try {
      await InscricaoBolaoService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Inscrição deletada com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async tornarApto(req, res) {
    try {
      console.log('req.params:', req.params);
      const id = req.params.id;
      console.log('ID recebido:', id);

      const resultado = await InscricaoBolaoService.tornarApto(id);
      console.log('Resultado tornarApto:', resultado);

      return res.status(200).json({
        success: true,
        message: 'Inscrição agora está apta'
      });
    } catch (error) {
      console.error('Erro tornarApto:', error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
module.exports = new InscricaoBolaoController();
