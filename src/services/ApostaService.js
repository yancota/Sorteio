// Service para lógica de negócio de Apostas
const ApostaRepository = require('../repositories/ApostaRepository');
const InscricaoBolaoRepository = require('../repositories/InscricaoBolaoRepository');
const SorteioRepository = require('../repositories/SorteioRepository');

class ApostaService {
  // Criar nova aposta
  async create(apostaData) {
    // Validações
    if (!apostaData.inscricaoBolao || !apostaData.inscricaoBolao.id) {
      throw new Error('Inscrição no bolão é obrigatória');
    }

    if (!apostaData.sorteio || !apostaData.sorteio.id) {
      throw new Error('Sorteio é obrigatório');
    }

    if (!apostaData.valoresEscolhidos || apostaData.valoresEscolhidos.length === 0) {
      throw new Error('Valores escolhidos são obrigatórios');
    }

    // Verificar se inscrição existe
    const inscricao = await InscricaoBolaoRepository.findById(apostaData.inscricaoBolao.id);
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar se inscrição está apta
    if (!inscricao.apto) {
      throw new Error('Inscrição não está apta para fazer apostas');
    }

    // Verificar se sorteio existe
    const sorteio = await SorteioRepository.findById(apostaData.sorteio.id);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }

    // Verificar se já existe aposta para esta inscrição neste sorteio
    const apostaExistente = await ApostaRepository.findByInscricaoAndSorteio(
      apostaData.inscricaoBolao.id,
      apostaData.sorteio.id
    );
    if (apostaExistente) {
      throw new Error('Já existe uma aposta para este sorteio');
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

  // Buscar apostas por sorteio
  async getBySorteio(sorteioId) {
    return await ApostaRepository.findBySorteio(sorteioId);
  }

  // Atualizar aposta
  async update(id, apostaData) {
    const apostaExistente = await ApostaRepository.findById(id);
    if (!apostaExistente) {
      throw new Error('Aposta não encontrada');
    }

    // Verificar se o sorteio já foi realizado
    if (apostaExistente.sorteio && apostaExistente.sorteio.valoresSorteados && 
        apostaExistente.sorteio.valoresSorteados.length > 0) {
      throw new Error('Não é possível alterar aposta após sorteio realizado');
    }

    return await ApostaRepository.update(id, apostaData);
  }

  // Calcular acertos de uma aposta
  async calcularAcertos(id) {
    const aposta = await ApostaRepository.findById(id);
    if (!aposta) {
      throw new Error('Aposta não encontrada');
    }

    const sorteio = await SorteioRepository.findById(aposta.sorteio.id);
    if (!sorteio || !sorteio.valoresSorteados || sorteio.valoresSorteados.length === 0) {
      throw new Error('Sorteio ainda não foi realizado');
    }

    // Calcular valores acertados
    const valoresAcertados = aposta.valoresEscolhidos.filter(valor => 
      sorteio.valoresSorteados.includes(valor)
    );

    // Atualizar valores acertados na aposta
    await ApostaRepository.updateValoresAcertados(id, valoresAcertados);

    return {
      apostaId: id,
      quantidadeAcertos: valoresAcertados.length,
      valoresAcertados
    };
  }

  // Calcular acertos de todas as apostas de um sorteio
  async calcularAcertosPorSorteio(sorteioId) {
    const apostas = await ApostaRepository.findBySorteio(sorteioId);
    
    const resultados = [];
    for (const aposta of apostas) {
      const resultado = await this.calcularAcertos(aposta.id);
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
