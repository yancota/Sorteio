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
    const bolaoId = sorteio.bolao_id;
    const inscricoes = await InscricaoBolaoRepository.findByBolao(bolaoId);
    for (const inscricao of inscricoes) {

      const apostas = await ApostaRepository.findByInscricao(inscricao.id);
      if (apostas && apostas.length > 0) {
        const aposta = apostas[0];

        console.log('valoresEscolhidos:', aposta.valores_escolhidos);
console.log('valoresSorteados:', valoresSorteados);
console.log('valores acertados', aposta.valores_acertados)

const valoresEscolhidos = Array.isArray(aposta.valores_escolhidos) ? aposta.valores_escolhidos : [];
console.log('valoresEscolhidos (array):', valoresEscolhidos);

const valoresAcertados = valoresEscolhidos.filter(valor => valoresSorteados.includes(valor));
console.log('valoresAcertados:', valoresAcertados);

console.log('valoresAcertados anteriores:', aposta.valores_acertados);

const valoresUpdate = Array.from(new Set([
  ...(aposta.valores_acertados || []),
  ...valoresAcertados
])).map(Number);
console.log('valoresUpdate (acumulado):', valoresUpdate);

await ApostaRepository.updateValoresAcertados(aposta.id, valoresUpdate);

const pontuacao = valoresUpdate.length;
console.log('pontuacao:', pontuacao);
        await ApostaRepository.updatePontuacao(aposta.id, pontuacao);
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
