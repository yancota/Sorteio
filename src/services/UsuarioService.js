// Service para lógica de negócio de Usuários
const UsuarioRepository = require('../repositories/UsuarioRepository');
const { Usuario } = require('../models');

class UsuarioService {
  // Criar novo usuário
  async create(usuarioData) {
    // Validações
    if (!usuarioData.nome || !usuarioData.telefone) {
      throw new Error('Nome e telefone são obrigatórios');
    }

    const grupo_id = usuarioData.grupo_id || usuarioData.grupo?.id;

    const usuarioExistente = await UsuarioRepository.findByTelefone(usuarioData.telefone);
    if (usuarioExistente) {
      throw new Error('Telefone já cadastrado');
    }

    return await UsuarioRepository.create({
      nome: usuarioData.nome,
      telefone: usuarioData.telefone,
      grupo_id
    });
  }

  async getAll() {
    return await UsuarioRepository.findAll();
  }

  async getById(id) {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async getByGrupo(grupoId) {
    return await UsuarioRepository.findByGrupo(grupoId);
  }

  // Atualizar usuário
  async update(id, usuarioData) {
    const usuarioExistente = await UsuarioRepository.findById(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    // Se está alterando telefone, verificar se não existe outro usuário com esse telefone
    if (usuarioData.telefone && usuarioData.telefone !== usuarioExistente.telefone) {
      const telefoneJaExiste = await UsuarioRepository.findByTelefone(usuarioData.telefone);
      if (telefoneJaExiste) {
        throw new Error('Telefone já cadastrado para outro usuário');
      }
    }

    return await UsuarioRepository.update(id, usuarioData);
  }

  // Deletar usuário
  async delete(id) {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return await UsuarioRepository.delete(id);
  }
}

module.exports = new UsuarioService();
