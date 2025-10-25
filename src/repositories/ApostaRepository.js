// Repository para gerenciar Apostas

class ApostaRepository {
  constructor() {
    this.apostas = [];
    this.nextId = 1;
  }

  // Criar uma nova aposta
  async create(apostaData) {
    const aposta = {
      id: this.nextId++,
      ...apostaData,
      valoresEscolhidos: apostaData.valoresEscolhidos || [],
      valoresAcertados: apostaData.valoresAcertados || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.apostas.push(aposta);
    return aposta;
  }

  // Buscar todas as apostas
  async findAll() {
    return this.apostas;
  }

  // Buscar aposta por ID
  async findById(id) {
    return this.apostas.find(a => a.id === parseInt(id));
  }

  // Buscar apostas por inscrição
  async findByInscricao(inscricaoId) {
    return this.apostas.filter(a => {
      if (!a.inscricaoBolao) return false;
      const inscricaoDaAposta = typeof a.inscricaoBolao === 'object' ? a.inscricaoBolao.id : a.inscricaoBolao;
      return inscricaoDaAposta === parseInt(inscricaoId);
    });
  }

  // Buscar aposta específica de inscrição
  async findByInscricaoSingle(inscricaoId) {
    return this.apostas.find(a => {
      if (!a.inscricaoBolao) return false;
      const inscricaoDaAposta = typeof a.inscricaoBolao === 'object' ? a.inscricaoBolao.id : a.inscricaoBolao;
      return inscricaoDaAposta === parseInt(inscricaoId);
    });
  }

  // Atualizar aposta
  async update(id, apostaData) {
    const index = this.apostas.findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;

    this.apostas[index] = {
      ...this.apostas[index],
      ...apostaData,
      updatedAt: new Date()
    };
    return this.apostas[index];
  }

  // Atualizar valores acertados
  async updateValoresAcertados(id, valoresAcertados) {
    const index = this.apostas.findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;

    this.apostas[index].valoresAcertados = valoresAcertados;
    this.apostas[index].updatedAt = new Date();
    return this.apostas[index];
  }

  // Deletar aposta
  async delete(id) {
    const index = this.apostas.findIndex(a => a.id === parseInt(id));
    if (index === -1) return false;

    this.apostas.splice(index, 1);
    return true;
  }

  // Deletar todas as apostas de uma inscrição
  async deleteByInscricao(inscricaoId) {
    this.apostas = this.apostas.filter(a => {
      if (!a.inscricaoBolao) return true;
      const inscricaoDaAposta = typeof a.inscricaoBolao === 'object' ? a.inscricaoBolao.id : a.inscricaoBolao;
      return inscricaoDaAposta !== parseInt(inscricaoId);
    });
    return true;
  }
}

module.exports = new ApostaRepository();
