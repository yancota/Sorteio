// Controller para gerenciar requisições HTTP de Bolões
const BolaoService = require('../services/BolaoService');

class BolaoController {
  // POST /boloes - Criar novo bolão
  async create(req, res) {
    try {
      const bolao = await BolaoService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Bolão criado com sucesso',
        data: bolao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /boloes - Listar todos os bolões
  async getAll(req, res) {
    try {
      const boloes = await BolaoService.getAll();
      return res.status(200).json({
        success: true,
        data: boloes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /boloes/ativos - Listar bolões ativos
  async getAtivos(req, res) {
    try {
      const boloes = await BolaoService.getAtivos();
      return res.status(200).json({
        success: true,
        data: boloes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /boloes/:id - Buscar bolão por ID
  async getById(req, res) {
    try {
      const bolao = await BolaoService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: bolao
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /boloes/buscar/:nome - Buscar bolões por nome
  async getByNome(req, res) {
    try {
      const boloes = await BolaoService.getByNome(req.params.nome);
      return res.status(200).json({
        success: true,
        data: boloes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /boloes/:id - Atualizar bolão
  async update(req, res) {
    try {
      const bolao = await BolaoService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Bolão atualizado com sucesso',
        data: bolao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /boloes/:id/sorteios/:sorteioId - Adicionar sorteio ao bolão
  async addSorteio(req, res) {
    try {
      const bolao = await BolaoService.addSorteio(
        req.params.id,
        req.params.sorteioId
      );
      return res.status(200).json({
        success: true,
        message: 'Sorteio adicionado ao bolão com sucesso',
        data: bolao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /boloes/:id/sorteios/:sorteioId - Remover sorteio do bolão
  async removeSorteio(req, res) {
    try {
      const bolao = await BolaoService.removeSorteio(
        req.params.id,
        req.params.sorteioId
      );
      return res.status(200).json({
        success: true,
        message: 'Sorteio removido do bolão com sucesso',
        data: bolao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /boloes/:id/reiniciar - Reiniciar bolão
  async reiniciar(req, res) {
    try {
      const bolao = await BolaoService.reiniciar(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Bolão reiniciado com sucesso',
        data: bolao
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /boloes/:id - Deletar bolão
  async delete(req, res) {
    try {
      await BolaoService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Bolão deletado com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BolaoController();
