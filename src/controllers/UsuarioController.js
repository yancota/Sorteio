// Controller para gerenciar requisições HTTP de Usuários
const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
  // POST /usuarios - Criar novo usuário
  async create(req, res) {
    try {
      const usuario = await UsuarioService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: usuario
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /usuarios - Listar todos os usuários
  async getAll(req, res) {
    try {
      const usuarios = await UsuarioService.getAll();
      return res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /usuarios/:id - Buscar usuário por ID
  async getById(req, res) {
    try {
      const usuario = await UsuarioService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /usuarios/grupo/:grupoId - Buscar usuários por grupo
  async getByGrupo(req, res) {
    try {
      const usuarios = await UsuarioService.getByGrupo(req.params.grupoId);
      return res.status(200).json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /usuarios/:id - Atualizar usuário
  async update(req, res) {
    try {
      const usuario = await UsuarioService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: usuario
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /usuarios/:id - Deletar usuário
  async delete(req, res) {
    try {
      await UsuarioService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UsuarioController();
