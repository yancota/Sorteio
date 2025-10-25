// Service para lógica de negócio de Sorteios
const SorteioRepository = require('../repositories/SorteioRepository');

class SorteioService {
  // Criar novo sorteio
  async create(sorteioData) {
    // Validações
    if (!sorteioData.nome) {
      throw new Error('Nome do sorteio é obrigatório');
    }

    if (!sorteioData.valor || sorteioData.valor <= 0) {
      throw new Error('Valor do sorteio deve ser maior que zero');
    }

    return await SorteioRepository.create(sorteioData);
  }

  // Buscar todos os sorteios
  async getAll() {
    return await SorteioRepository.findAll();
  }

  // Buscar sorteio por ID
  async getById(id) {
    const sorteio = await SorteioRepository.findById(id);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }
    return sorteio;
  }

  // Buscar sorteios por nome
  async getByNome(nome) {
    return await SorteioRepository.findByNome(nome);
  }

  // Atualizar sorteio
  async update(id, sorteioData) {
    const sorteioExistente = await SorteioRepository.findById(id);
    if (!sorteioExistente) {
      throw new Error('Sorteio não encontrado');
    }

    if (sorteioData.valor && sorteioData.valor <= 0) {
      throw new Error('Valor do sorteio deve ser maior que zero');
    }

    return await SorteioRepository.update(id, sorteioData);
  }

  // Realizar sorteio (adicionar valores sorteados)
  async realizarSorteio(id, valoresSorteados) {
    const sorteio = await SorteioRepository.findById(id);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }

    if (!valoresSorteados || valoresSorteados.length === 0) {
      throw new Error('Valores sorteados são obrigatórios');
    }

    return await SorteioRepository.updateValoresSorteados(id, valoresSorteados);
  }

  // Deletar sorteio
  async delete(id) {
    const sorteio = await SorteioRepository.findById(id);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }

    return await SorteioRepository.delete(id);
  }
}

module.exports = new SorteioService();
