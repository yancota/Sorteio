// Service para lógica de negócio de Sorteios
const SorteioRepository = require('../repositories/SorteioRepository');
const ApostaRepository = require('../repositories/ApostaRepository');
const InscricaoBolaoRepository = require('../repositories/InscricaoBolaoRepository');

class SorteioService {
  async create(sorteioData) {
      if (!sorteioData.nome) {
        throw new Error('Nome do sorteio é obrigatório');
      }

      const bolao_id = sorteioData.bolao_id || sorteioData.bolao?.id;
      if (!bolao_id) {
        throw new Error('Bolão é obrigatório para criar um sorteio');
      }

      // Aceita tanto valores_sorteados (payload) quanto valoresSorteados (interno)
      const valoresSorteados = sorteioData.valores_sorteados || sorteioData.valoresSorteados || [];

      return await SorteioRepository.create({
        nome: sorteioData.nome,
        bolao_id,
        valoresSorteados
      });
  }

  async getAll() {
    return await SorteioRepository.findAll();
  }

  async getById(id) {
    const sorteio = await SorteioRepository.findById(id);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }
    return sorteio;
  }

  async getByNome(nome) {
    return await SorteioRepository.findByNome(nome);
  }

  async getByBolao(bolaoId) {
    return await SorteioRepository.findByBolao(bolaoId);
  }

  async update(id, sorteioData) {
    const sorteioExistente = await SorteioRepository.findById(id);
    if (!sorteioExistente) {
      throw new Error('Sorteio não encontrado');
    }

    return await SorteioRepository.update(id, sorteioData);
  }

  async realizarSorteio(id) {
    const sorteio = await SorteioRepository.findById(id);
    if (!sorteio) {
      console.error('[Sorteio] Sorteio não encontrado:', id);
      throw new Error('Sorteio não encontrado');
    }

    if (!sorteio.valores_sorteados || sorteio.valores_sorteados.length === 0) {
      console.error('[Sorteio] Sorteio sem valores sorteados:', id);
      throw new Error('O sorteio precisa ter valores sorteados definidos antes de ser realizado');
    }

    const valoresSorteados = sorteio.valores_sorteados;
    console.log('[Sorteio] Realizando sorteio:', id, 'valores sorteados:', valoresSorteados);
    const bolaoId = sorteio.bolao_id;
    const inscricoes = await InscricaoBolaoRepository.findByBolao(bolaoId);
    console.log('[Sorteio] Inscrições encontradas:', inscricoes.length);

    for (const inscricao of inscricoes) {

      const apostas = await ApostaRepository.findByInscricao(inscricao.id);
      if (apostas && apostas.length > 0) {
        const aposta = apostas[0];

        const valoresEscolhidos = Array.isArray(aposta.valores_escolhidos) ? aposta.valores_escolhidos : [];
        const valoresAcertados = valoresEscolhidos.filter(valor => valoresSorteados.includes(valor));

        await ApostaRepository.updateValoresAcertados(aposta.id, valoresAcertados);
        
        const pontuacao = valoresAcertados.length;
        
        const pontuacaoAtual = inscricao.pontuacaoTotal || 0;
        const novaPontuacao = pontuacaoAtual + pontuacao;
        console.log('[Sorteio] Atualizando pontuação total da inscrição:', inscricao.id, 'de', pontuacaoAtual, 'para', novaPontuacao);
        await ApostaRepository.updatePontuacao(aposta.id, novaPontuacao);
      } else {
        console.log('[Sorteio] Nenhuma aposta encontrada para inscrição:', inscricao.id);
      }
    }

    console.log('[Sorteio] Sorteio realizado com sucesso:', id);
    return sorteio;
  }

  async delete(id) {
    const sorteio = await SorteioRepository.findById(id);
    if (!sorteio) {
      throw new Error('Sorteio não encontrado');
    }

    return await SorteioRepository.delete(id);
  }
}

module.exports = new SorteioService();
