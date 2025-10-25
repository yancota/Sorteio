// Service para lógica de negócio de Bolões
const BolaoRepository = require('../repositories/BolaoRepository');
const SorteioRepository = require('../repositories/SorteioRepository');

class BolaoService {
  // Criar novo bolão
  async create(bolaoData) {
    // Validações
    if (!bolaoData.nome) {
      throw new Error('Nome do bolão é obrigatório');
    }

    if (!bolaoData.valor || bolaoData.valor <= 0) {
      throw new Error('Valor do bolão deve ser maior que zero');
    }

    if (!bolaoData.quantidadeCampeao || bolaoData.quantidadeCampeao <= 0) {
      throw new Error('Quantidade de campeões deve ser maior que zero');
    }

    return await BolaoRepository.create(bolaoData);
  }

  // Buscar todos os bolões
  async getAll() {
    // Busca todos os bolões e popula os sorteios de cada bolão
    const boloes = await BolaoRepository.findAll();
    const SorteioRepository = require('../repositories/SorteioRepository');
    for (const bolao of boloes) {
      // Se for SQL, aqui deveria buscar no banco
      bolao.sorteios = await SorteioRepository.findByBolao(bolao.id);
    }
    return boloes;
  }

  // Buscar bolões ativos
  async getAtivos() {
    return await BolaoRepository.findAtivos();
  }

  // Buscar bolão por ID
  async getById(id) {
    const bolao = await BolaoRepository.findById(id);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }
    return bolao;
  }

  // Buscar bolões por nome
  async getByNome(nome) {
    return await BolaoRepository.findByNome(nome);
  }

  // Atualizar bolão
  async update(id, bolaoData) {
    const bolaoExistente = await BolaoRepository.findById(id);
    if (!bolaoExistente) {
      throw new Error('Bolão não encontrado');
    }

    if (bolaoData.valor && bolaoData.valor <= 0) {
      throw new Error('Valor do bolão deve ser maior que zero');
    }

    if (bolaoData.quantidadeCampeao && bolaoData.quantidadeCampeao <= 0) {
      throw new Error('Quantidade de campeões deve ser maior que zero');
    }

    return await BolaoRepository.update(id, bolaoData);
  }

  // Adicionar sorteio ao bolão
  async addSorteio(bolaoId, sorteioId) {
    const bolao = await BolaoRepository.findById(bolaoId);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    const sorteio = await SorteioRepository.findById(sorteioId);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }

    // Verificar se sorteio já está no bolão
    const sorteioJaAdicionado = bolao.sorteios.some(s => s.id === parseInt(sorteioId));
    if (sorteioJaAdicionado) {
      throw new Error('Sorteio já está vinculado a este bolão');
    }

    return await BolaoRepository.addSorteio(bolaoId, sorteio);
  }

  // Remover sorteio do bolão
  async removeSorteio(bolaoId, sorteioId) {
    const bolao = await BolaoRepository.findById(bolaoId);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    return await BolaoRepository.removeSorteio(bolaoId, sorteioId);
  }

  // Reiniciar bolão
  async reiniciar(id) {
    const bolao = await BolaoRepository.findById(id);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    return await BolaoRepository.update(id, { reiniciarBolao: true });
  }

  // Deletar bolão
  async delete(id) {
    const bolao = await BolaoRepository.findById(id);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    return await BolaoRepository.delete(id);
  }
}

module.exports = new BolaoService();
