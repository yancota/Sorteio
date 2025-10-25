// Repository para gerenciar dados de Grupos

class GrupoRepository {
  constructor() {
    this.grupos = [];
    this.nextId = 1;
  }

  // Criar um novo grupo
  async create(grupoData) {
    const grupo = {
      id: this.nextId++,
      ...grupoData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.grupos.push(grupo);
    return grupo;
  }

  // Buscar todos os grupos
  async findAll() {
    return this.grupos;
  }

  // Buscar grupo por ID
  async findById(id) {
    return this.grupos.find(g => g.id === parseInt(id));
  }

  // Buscar grupos por usuário responsável
  async findByUsuarioResponsavel(usuarioId) {
    return this.grupos.filter(g => 
      g.usuarioResponsavel && g.usuarioResponsavel.id === parseInt(usuarioId)
    );
  }

  // Buscar grupo por nome
  async findByNome(nome) {
    return this.grupos.find(g => g.nome.toLowerCase() === nome.toLowerCase());
  }

  // Atualizar grupo
  async update(id, grupoData) {
    const index = this.grupos.findIndex(g => g.id === parseInt(id));
    if (index === -1) return null;

    this.grupos[index] = {
      ...this.grupos[index],
      ...grupoData,
      updatedAt: new Date()
    };
    return this.grupos[index];
  }

  // Deletar grupo
  async delete(id) {
    const index = this.grupos.findIndex(g => g.id === parseInt(id));
    if (index === -1) return false;

    this.grupos.splice(index, 1);
    return true;
  }
}

module.exports = new GrupoRepository();
