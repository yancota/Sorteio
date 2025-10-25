// Repository para gerenciar dados de Usuários
// Por enquanto, usando armazenamento em memória. Pode ser substituído por banco de dados.

class UsuarioRepository {
  constructor() {
    this.usuarios = [];
    this.nextId = 1;
  }

  // Criar um novo usuário
  async create(usuarioData) {
    const usuario = {
      id: this.nextId++,
      ...usuarioData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.usuarios.push(usuario);
    return usuario;
  }

  // Buscar todos os usuários
  async findAll() {
    return this.usuarios;
  }

  // Buscar usuário por ID
  async findById(id) {
    return this.usuarios.find(u => u.id === parseInt(id));
  }

  // Buscar usuário por telefone
  async findByTelefone(telefone) {
    return this.usuarios.find(u => u.telefone === telefone);
  }

  // Buscar usuários por grupo
  async findByGrupo(grupoId) {
    return this.usuarios.filter(u => {
      if (!u.grupo) return false;
      const grupoDoUsuario = typeof u.grupo === 'object' ? u.grupo.id : u.grupo;
      return grupoDoUsuario === parseInt(grupoId);
    });
  }

  // Atualizar usuário
  async update(id, usuarioData) {
    const index = this.usuarios.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;

    this.usuarios[index] = {
      ...this.usuarios[index],
      ...usuarioData,
      updatedAt: new Date()
    };
    return this.usuarios[index];
  }

  // Deletar usuário
  async delete(id) {
    const index = this.usuarios.findIndex(u => u.id === parseInt(id));
    if (index === -1) return false;

    this.usuarios.splice(index, 1);
    return true;
  }
}

module.exports = new UsuarioRepository();
