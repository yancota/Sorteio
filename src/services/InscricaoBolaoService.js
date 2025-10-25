// Service para lógica de negócio de Inscrições em Bolões
const InscricaoBolaoRepository = require('../repositories/InscricaoBolaoRepository');
const BolaoRepository = require('../repositories/BolaoRepository');
const UsuarioRepository = require('../repositories/UsuarioRepository');

class InscricaoBolaoService {
  // Criar nova inscrição
  async create(inscricaoData) {
    // Validações
    if (!inscricaoData.bolao || !inscricaoData.bolao.id) {
      throw new Error('Bolão é obrigatório');
    }

    if (!inscricaoData.usuario || !inscricaoData.usuario.id) {
      throw new Error('Usuário é obrigatório');
    }

    // Verificar se bolão existe
    const bolao = await BolaoRepository.findById(inscricaoData.bolao.id);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    // Verificar se usuário existe
    const usuario = await UsuarioRepository.findById(inscricaoData.usuario.id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se usuário já está inscrito no bolão
    const inscricaoExistente = await InscricaoBolaoRepository.findByUsuarioAndBolao(
      inscricaoData.usuario.id,
      inscricaoData.bolao.id
    );
    if (inscricaoExistente) {
      throw new Error('Usuário já está inscrito neste bolão');
    }

    return await InscricaoBolaoRepository.create(inscricaoData);
  }

  // Buscar todas as inscrições
  async getAll() {
    return await InscricaoBolaoRepository.findAll();
  }

  // Buscar inscrição por ID
  async getById(id) {
    const inscricao = await InscricaoBolaoRepository.findById(id);
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }
    return inscricao;
  }

  // Buscar inscrições por bolão
  async getByBolao(bolaoId) {
    return await InscricaoBolaoRepository.findByBolao(bolaoId);
  }

  // Buscar inscrições por usuário
  async getByUsuario(usuarioId) {
    return await InscricaoBolaoRepository.findByUsuario(usuarioId);
  }

  // Buscar inscrições aptas por bolão
  async getAptasByBolao(bolaoId) {
    return await InscricaoBolaoRepository.findAptasByBolao(bolaoId);
  }

  // Obter ranking de um bolão
  async getRanking(bolaoId) {
    const bolao = await BolaoRepository.findById(bolaoId);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    return await InscricaoBolaoRepository.getRankingByBolao(bolaoId);
  }

  // Atualizar inscrição
  async update(id, inscricaoData) {
    const inscricaoExistente = await InscricaoBolaoRepository.findById(id);
    if (!inscricaoExistente) {
      throw new Error('Inscrição não encontrada');
    }

    return await InscricaoBolaoRepository.update(id, inscricaoData);
  }

  // Adicionar pontuação
  async adicionarPontuacao(id, pontos) {
    const inscricao = await InscricaoBolaoRepository.findById(id);
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    if (typeof pontos !== 'number' || pontos < 0) {
      throw new Error('Pontuação deve ser um número positivo');
    }

    return await InscricaoBolaoRepository.updatePontuacao(id, pontos);
  }

  // Resetar pontuação
  async resetarPontuacao(id) {
    const inscricao = await InscricaoBolaoRepository.findById(id);
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    return await InscricaoBolaoRepository.resetPontuacao(id);
  }

  // Deletar inscrição
  async delete(id) {
    const inscricao = await InscricaoBolaoRepository.findById(id);
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    return await InscricaoBolaoRepository.delete(id);
  }
}

module.exports = new InscricaoBolaoService();
