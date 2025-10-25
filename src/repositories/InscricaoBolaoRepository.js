// Repository para gerenciar Inscrições em Bolões

class InscricaoBolaoRepository {
  constructor() {
    this.inscricoes = [];
    this.nextId = 1;
  }

  // Criar uma nova inscrição
  async create(inscricaoData) {
    const inscricao = {
      id: this.nextId++,
      ...inscricaoData,
      pontuacaoTotal: inscricaoData.pontuacaoTotal || 0,
      apto: inscricaoData.apto !== undefined ? inscricaoData.apto : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inscricoes.push(inscricao);
    return inscricao;
  }

  // Buscar todas as inscrições
  async findAll() {
    return this.inscricoes;
  }

  // Buscar inscrição por ID
  async findById(id) {
    return this.inscricoes.find(i => i.id === parseInt(id));
  }

  // Buscar inscrições por bolão
  async findByBolao(bolaoId) {
    return this.inscricoes.filter(i => 
      i.bolao && i.bolao.id === parseInt(bolaoId)
    );
  }

  // Buscar inscrições por usuário
  async findByUsuario(usuarioId) {
    return this.inscricoes.filter(i => 
      i.usuario && i.usuario.id === parseInt(usuarioId)
    );
  }

  // Buscar inscrição específica de usuário em bolão
  async findByUsuarioAndBolao(usuarioId, bolaoId) {
    return this.inscricoes.find(i => 
      i.usuario && i.usuario.id === parseInt(usuarioId) &&
      i.bolao && i.bolao.id === parseInt(bolaoId)
    );
  }

  // Buscar inscrições aptas em um bolão
  async findAptasByBolao(bolaoId) {
    return this.inscricoes.filter(i => 
      i.bolao && i.bolao.id === parseInt(bolaoId) && i.apto === true
    );
  }

  // Obter ranking de um bolão (ordenado por pontuação)
  async getRankingByBolao(bolaoId) {
    const inscricoes = await this.findByBolao(bolaoId);
    return inscricoes.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  }

  // Atualizar inscrição
  async update(id, inscricaoData) {
    const index = this.inscricoes.findIndex(i => i.id === parseInt(id));
    if (index === -1) return null;

    this.inscricoes[index] = {
      ...this.inscricoes[index],
      ...inscricaoData,
      updatedAt: new Date()
    };
    return this.inscricoes[index];
  }

  // Atualizar pontuação
  async updatePontuacao(id, pontos) {
    const inscricao = await this.findById(id);
    if (!inscricao) return null;

    inscricao.pontuacaoTotal += pontos;
    inscricao.updatedAt = new Date();
    return inscricao;
  }

  // Resetar pontuação
  async resetPontuacao(id) {
    const inscricao = await this.findById(id);
    if (!inscricao) return null;

    inscricao.pontuacaoTotal = 0;
    inscricao.updatedAt = new Date();
    return inscricao;
  }

  // Deletar inscrição
  async delete(id) {
    const index = this.inscricoes.findIndex(i => i.id === parseInt(id));
    if (index === -1) return false;

    this.inscricoes.splice(index, 1);
    return true;
  }
}

module.exports = new InscricaoBolaoRepository();
