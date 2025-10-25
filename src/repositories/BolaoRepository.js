// Repository para gerenciar dados de Bolões

class BolaoRepository {
  constructor() {
    this.boloes = [];
    this.nextId = 1;
  }

  // Criar um novo bolão
  async create(bolaoData) {
    const bolao = {
      id: this.nextId++,
      ...bolaoData,
      sorteios: bolaoData.sorteios || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.boloes.push(bolao);
    return bolao;
  }

  // Buscar todos os bolões
  async findAll() {
    return this.boloes;
  }

  // Buscar bolão por ID
  async findById(id) {
    return this.boloes.find(b => b.id === parseInt(id));
  }

  // Buscar bolões por nome
  async findByNome(nome) {
    return this.boloes.filter(b => 
      b.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  // Buscar bolões ativos (não reiniciados)
  async findAtivos() {
    return this.boloes.filter(b => !b.reiniciarBolao);
  }

  // Atualizar bolão
  async update(id, bolaoData) {
    const index = this.boloes.findIndex(b => b.id === parseInt(id));
    if (index === -1) return null;

    this.boloes[index] = {
      ...this.boloes[index],
      ...bolaoData,
      updatedAt: new Date()
    };
    return this.boloes[index];
  }

  // Adicionar sorteio ao bolão
  async addSorteio(id, sorteio) {
    const bolao = await this.findById(id);
    if (!bolao) return null;

    bolao.sorteios.push(sorteio);
    bolao.updatedAt = new Date();
    return bolao;
  }

  // Remover sorteio do bolão
  async removeSorteio(id, sorteioId) {
    const bolao = await this.findById(id);
    if (!bolao) return null;

    bolao.sorteios = bolao.sorteios.filter(s => s.id !== parseInt(sorteioId));
    bolao.updatedAt = new Date();
    return bolao;
  }

  // Deletar bolão
  async delete(id) {
    const index = this.boloes.findIndex(b => b.id === parseInt(id));
    if (index === -1) return false;

    this.boloes.splice(index, 1);
    return true;
  }
}

module.exports = new BolaoRepository();
