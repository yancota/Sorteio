// Controller para gerenciar requisições HTTP de Grupos
const GrupoService = require('../services/GrupoService');

class GrupoController {
  // POST /grupos - Criar novo grupo
  async create(req, res) {
    try {
      const grupo = await GrupoService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Grupo criado com sucesso',
        data: grupo
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /grupos - Listar todos os grupos
  async getAll(req, res) {
    try {
      const grupos = await GrupoService.getAll();
      return res.status(200).json({
        success: true,
        data: grupos
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /grupos/:id - Buscar grupo por ID
  async getById(req, res) {
    try {
      const grupo = await GrupoService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: grupo
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /grupos/responsavel/:usuarioId - Buscar grupos por usuário responsável
  async getByUsuarioResponsavel(req, res) {
    try {
      const grupos = await GrupoService.getByUsuarioResponsavel(req.params.usuarioId);
      return res.status(200).json({
        success: true,
        data: grupos
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /grupos/:id - Atualizar grupo
  async update(req, res) {
    try {
      const grupo = await GrupoService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Grupo atualizado com sucesso',
        data: grupo
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /grupos/:id - Deletar grupo
  async delete(req, res) {
    try {
      await GrupoService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Grupo deletado com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new GrupoController();
