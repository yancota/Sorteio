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
    return this.apostas.filter(a => 
      a.inscricaoBolao && a.inscricaoBolao.id === parseInt(inscricaoId)
    );
  }

  // Buscar apostas por sorteio
  async findBySorteio(sorteioId) {
    return this.apostas.filter(a => 
      a.sorteio && a.sorteio.id === parseInt(sorteioId)
    );
  }

  // Buscar aposta específica de inscrição em sorteio
  async findByInscricaoAndSorteio(inscricaoId, sorteioId) {
    return this.apostas.find(a => 
      a.inscricaoBolao && a.inscricaoBolao.id === parseInt(inscricaoId) &&
      a.sorteio && a.sorteio.id === parseInt(sorteioId)
    );
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
    this.apostas = this.apostas.filter(a => 
      !a.inscricaoBolao || a.inscricaoBolao.id !== parseInt(inscricaoId)
    );
    return true;
  }
}

module.exports = new ApostaRepository();
