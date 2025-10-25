// Controller para gerenciar requisições HTTP de Sorteios
const SorteioService = require('../services/SorteioService');

class SorteioController {
  // POST /sorteios - Criar novo sorteio
  async create(req, res) {
    try {
      const sorteio = await SorteioService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Sorteio criado com sucesso',
        data: sorteio
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /sorteios - Listar todos os sorteios
  async getAll(req, res) {
    try {
      const sorteios = await SorteioService.getAll();
      return res.status(200).json({
        success: true,
        data: sorteios
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /sorteios/:id - Buscar sorteio por ID
  async getById(req, res) {
    try {
      const sorteio = await SorteioService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: sorteio
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /sorteios/buscar/:nome - Buscar sorteios por nome
  async getByNome(req, res) {
    try {
      const sorteios = await SorteioService.getByNome(req.params.nome);
      return res.status(200).json({
        success: true,
        data: sorteios
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /sorteios/bolao/:bolaoId - Buscar sorteios por bolão
  async getByBolao(req, res) {
    try {
      const sorteios = await SorteioService.getByBolao(req.params.bolaoId);
      return res.status(200).json({
        success: true,
        data: sorteios
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /sorteios/:id - Atualizar sorteio
  async update(req, res) {
    try {
      const sorteio = await SorteioService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Sorteio atualizado com sucesso',
        data: sorteio
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /sorteios/:id/realizar - Realizar sorteio
  async realizarSorteio(req, res) {
    try {
      const sorteio = await SorteioService.realizarSorteio(
        req.params.id,
        req.body.valoresSorteados
      );
      return res.status(200).json({
        success: true,
        message: 'Sorteio realizado com sucesso',
        data: sorteio
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /sorteios/:id - Deletar sorteio
  async delete(req, res) {
    try {
      await SorteioService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Sorteio deletado com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new SorteioController();
