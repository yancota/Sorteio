// Service para lógica de negócio de Apostas
const ApostaRepository = require('../repositories/ApostaRepository');
const InscricaoBolaoRepository = require('../repositories/InscricaoBolaoRepository');
const SorteioRepository = require('../repositories/SorteioRepository');

class ApostaService {
  // Criar nova aposta
  async create(apostaData) {
    // Validações
    if (!apostaData.inscricaoBolao) {
      throw new Error('Inscrição no bolão é obrigatória');
    }

    if (!apostaData.valoresEscolhidos || apostaData.valoresEscolhidos.length === 0) {
      throw new Error('Valores escolhidos são obrigatórios');
    }

    // Normalizar inscricaoBolao para ID se for objeto
    const inscricaoId = typeof apostaData.inscricaoBolao === 'object' 
      ? apostaData.inscricaoBolao.id 
      : apostaData.inscricaoBolao;

    // Verificar se inscrição existe
    const inscricao = await InscricaoBolaoRepository.findById(inscricaoId);
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar se inscrição está apta
    if (!inscricao.apto) {
      throw new Error('Inscrição não está apta para fazer apostas');
    }

    // Verificar se já existe aposta para esta inscrição
    const apostaExistente = await ApostaRepository.findByInscricao(inscricaoId);
    if (apostaExistente && apostaExistente.length > 0) {
      throw new Error('Já existe uma aposta para esta inscrição');
    }

    return await ApostaRepository.create(apostaData);
  }

  // Buscar todas as apostas
  async getAll() {
    return await ApostaRepository.findAll();
  }

  // Buscar aposta por ID
  async getById(id) {
    const aposta = await ApostaRepository.findById(id);
    if (!aposta) {
      throw new Error('Aposta não encontrada');
    }
    return aposta;
  }

  // Buscar apostas por inscrição
  async getByInscricao(inscricaoId) {
    return await ApostaRepository.findByInscricao(inscricaoId);
  }

  // Buscar apostas por bolão (através das inscrições)
  async getByBolao(bolaoId) {
    const inscricoes = await InscricaoBolaoRepository.findByBolao(bolaoId);
    const apostas = [];
    
    for (const inscricao of inscricoes) {
      const apostasInscricao = await ApostaRepository.findByInscricao(inscricao.id);
      apostas.push(...apostasInscricao);
    }
    
    return apostas;
  }

  // Atualizar aposta
  async update(id, apostaData) {
    const apostaExistente = await ApostaRepository.findById(id);
    if (!apostaExistente) {
      throw new Error('Aposta não encontrada');
    }

    return await ApostaRepository.update(id, apostaData);
  }

  // Calcular acertos de uma aposta para um sorteio específico
  async calcularAcertos(apostaId, sorteioId) {
    const aposta = await ApostaRepository.findById(apostaId);
    if (!aposta) {
      throw new Error('Aposta não encontrada');
    }

    const sorteio = await SorteioRepository.findById(sorteioId);
    if (!sorteio || !sorteio.valoresSorteados || sorteio.valoresSorteados.length === 0) {
      throw new Error('Sorteio ainda não foi realizado');
    }

    // Calcular valores acertados
    const valoresAcertados = aposta.valoresEscolhidos.filter(valor => 
      sorteio.valoresSorteados.includes(valor)
    );

    return {
      apostaId: apostaId,
      sorteioId: sorteioId,
      quantidadeAcertos: valoresAcertados.length,
      valoresAcertados
    };
  }

  // Calcular acertos de todas as apostas de um bolão para um sorteio
  async calcularAcertosPorSorteio(bolaoId, sorteioId) {
    const apostas = await this.getByBolao(bolaoId);
    
    const resultados = [];
    for (const aposta of apostas) {
      const resultado = await this.calcularAcertos(aposta.id, sorteioId);
      resultados.push(resultado);
    }

    return resultados;
  }

  // Deletar aposta
  async delete(id) {
    const aposta = await ApostaRepository.findById(id);
    if (!aposta) {
      throw new Error('Aposta não encontrada');
    }

    return await ApostaRepository.delete(id);
  }
}

module.exports = new ApostaService();
