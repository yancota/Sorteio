// Service para lógica de negócio de Grupos
const GrupoRepository = require('../repositories/GrupoRepository');
const UsuarioRepository = require('../repositories/UsuarioRepository');

class GrupoService {
  // Criar novo grupo
  async create(grupoData) {
    // Validações
    if (!grupoData.nome) {
      throw new Error('Nome do grupo é obrigatório');
    }

    if (!grupoData.usuarioResponsavel || !grupoData.usuarioResponsavel.id) {
      throw new Error('Usuário responsável é obrigatório');
    }

    // Verificar se usuário responsável existe
    const usuario = await UsuarioRepository.findById(grupoData.usuarioResponsavel.id);
    if (!usuario) {
      throw new Error('Usuário responsável não encontrado');
    }

    // Verificar se já existe grupo com esse nome
    const grupoExistente = await GrupoRepository.findByNome(grupoData.nome);
    if (grupoExistente) {
      throw new Error('Já existe um grupo com este nome');
    }

    return await GrupoRepository.create(grupoData);
  }

  // Buscar todos os grupos
  async getAll() {
    return await GrupoRepository.findAll();
  }

  // Buscar grupo por ID
  async getById(id) {
    const grupo = await GrupoRepository.findById(id);
    if (!grupo) {
      throw new Error('Grupo não encontrado');
    }
    return grupo;
  }

  // Buscar grupos por usuário responsável
  async getByUsuarioResponsavel(usuarioId) {
    return await GrupoRepository.findByUsuarioResponsavel(usuarioId);
  }

  // Atualizar grupo
  async update(id, grupoData) {
    const grupoExistente = await GrupoRepository.findById(id);
    if (!grupoExistente) {
      throw new Error('Grupo não encontrado');
    }

    // Se está alterando nome, verificar se não existe outro grupo com esse nome
    if (grupoData.nome && grupoData.nome !== grupoExistente.nome) {
      const nomeJaExiste = await GrupoRepository.findByNome(grupoData.nome);
      if (nomeJaExiste) {
        throw new Error('Já existe outro grupo com este nome');
      }
    }

    return await GrupoRepository.update(id, grupoData);
  }

  // Deletar grupo
  async delete(id) {
    const grupo = await GrupoRepository.findById(id);
    if (!grupo) {
      throw new Error('Grupo não encontrado');
    }

    return await GrupoRepository.delete(id);
  }
}

module.exports = new GrupoService();
