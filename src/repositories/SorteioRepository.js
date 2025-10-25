// Repository para gerenciar dados de Sorteios

class SorteioRepository {
  constructor() {
    this.sorteios = [];
    this.nextId = 1;
  }

  // Criar um novo sorteio
  async create(sorteioData) {
    const sorteio = {
      id: this.nextId++,
      ...sorteioData,
      valoresSorteados: sorteioData.valoresSorteados || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sorteios.push(sorteio);
    return sorteio;
  }

  // Buscar todos os sorteios
  async findAll() {
    return this.sorteios;
  }

  // Buscar sorteio por ID
  async findById(id) {
    return this.sorteios.find(s => s.id === parseInt(id));
  }

  // Buscar sorteios por nome
  async findByNome(nome) {
    return this.sorteios.filter(s => 
      s.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  // Buscar sorteios por bolão
  async findByBolao(bolaoId) {
    return this.sorteios.filter(s => {
      if (!s.bolao) return false;
      const bolaoDoSorteio = typeof s.bolao === 'object' ? s.bolao.id : s.bolao;
      return bolaoDoSorteio === parseInt(bolaoId);
    });
  }

  // Atualizar sorteio
  async update(id, sorteioData) {
    const index = this.sorteios.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null;

    this.sorteios[index] = {
      ...this.sorteios[index],
      ...sorteioData,
      updatedAt: new Date()
    };
    return this.sorteios[index];
  }

  // Atualizar valores sorteados
  async updateValoresSorteados(id, valoresSorteados) {
    const index = this.sorteios.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null;

    this.sorteios[index].valoresSorteados = valoresSorteados;
    this.sorteios[index].updatedAt = new Date();
    return this.sorteios[index];
  }

  // Deletar sorteio
  async delete(id) {
    const index = this.sorteios.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;

    this.sorteios.splice(index, 1);
    return true;
  }
}

module.exports = new SorteioRepository();
