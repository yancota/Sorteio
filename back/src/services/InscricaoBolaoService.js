// Service para lógica de negócio de Inscrições em Bolões
const InscricaoBolaoRepository = require('../repositories/InscricaoBolaoRepository');
const BolaoRepository = require('../repositories/BolaoRepository');
const UsuarioRepository = require('../repositories/UsuarioRepository');
const SorteioRepository = require('../repositories/SorteioRepository');
const ApostaRepository = require('../repositories/ApostaRepository');
const RankingBolaoDTO = require('../models/RankingBolaoDTO');

class InscricaoBolaoService {
  // Criar nova inscrição
  async create(inscricaoData) {
    // Validações
    // Extrai os IDs dos objetos recebidos
    const bolao_id = inscricaoData.bolao_id || inscricaoData.bolao?.id;
    const usuario_id = inscricaoData.usuario_id || inscricaoData.usuario?.id;

    if (!bolao_id) {
      throw new Error('Bolão é obrigatório');
    }
    if (!usuario_id) {
      throw new Error('Usuário é obrigatório');
    }

    // Verificar se bolão existe
    const bolao = await BolaoRepository.findById(bolao_id);
    if (!bolao) {
      throw new Error('Bolão não encontrado');
    }

    // Verificar se usuário existe
    const usuario = await UsuarioRepository.findById(usuario_id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se usuário já está inscrito no bolão
    const inscricaoExistente = await InscricaoBolaoRepository.findByUsuarioAndBolao(
      usuario_id,
      bolao_id
    );
    if (inscricaoExistente) {
      throw new Error('Usuário já está inscrito neste bolão');
    }

    return await InscricaoBolaoRepository.create({
      bolao_id,
      usuario_id,
      apto: inscricaoData.apto
    });
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
    console.log('[Ranking] Iniciando ranking do bolão', bolaoId);
    const bolao = await BolaoRepository.findById(bolaoId);
    if (!bolao) {
      console.error('[Ranking] Bolão não encontrado:', bolaoId);
      throw new Error('Bolão não encontrado');
    }

    const inscricoes = await InscricaoBolaoRepository.findByBolao(bolaoId);
    console.log('[Ranking] Inscrições encontradas:', inscricoes.length);
    const sorteios = await SorteioRepository.findByBolao(bolaoId);
    console.log('[Ranking] Sorteios encontrados:', sorteios.length);

    const participantes = [];

    for (const inscricao of inscricoes) {
      console.log('[Ranking] Processando inscrição:', inscricao.id, inscricao);
      let usuarioId = inscricao.usuario_id;
      console.log('[Ranking] Buscando usuário:', usuarioId);
      let usuario = undefined;
      try {
        usuario = await UsuarioRepository.findById(usuarioId);
      } catch (err) {
        console.error('[Ranking] Erro ao buscar usuário:', usuarioId, err);
      }
      let nomeUsuario = 'Desconhecido';
      if (usuario && typeof usuario === 'object' && usuario.nome) {
        nomeUsuario = usuario.nome;
      } else {
        console.warn('[Ranking] Usuário não encontrado ou sem nome para inscrição:', inscricao.id, 'usuario_id:', usuarioId);
      }

      const apostas = await ApostaRepository.findByInscricao(inscricao.id);
      const aposta = apostas.length > 0 ? apostas[0] : null;
      if (!aposta) {
        console.log('[Ranking] Nenhuma aposta encontrada para inscrição:', inscricao.id);
      }

      let totalAcertos = 0;
      let valoresAcertados = [];

      if (aposta) {
        for (const sorteio of sorteios) {
          const valoresSorteados = sorteio.valores_sorteados || sorteio.valoresSorteados || [];
          if (valoresSorteados.length > 0) {
              totalAcertos += apostas.pontuacao || 0;
              valoresAcertados = valoresAcertados.concat(apostas.valoresAcertados || []);
          } else {
            console.log('[Ranking] Sorteio sem valores sorteados:', sorteio.id);
          }
        }
      }

      participantes.push({
        inscricaoId: inscricao.id,
        nome: nomeUsuario,
        valoresEscolhidos: aposta.valores_escolhidos ? aposta.valores_escolhidos : [],
        pontuacaoTotal: aposta.pontuacao || 0,
        posicao: 0,
        valoresAcertados: aposta.valores_acertados ? aposta.valores_acertados : [],
        apto: inscricao.apto
      });
    }

    // Ordenar por pontuação (ranking)
    participantes.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);

    let posicao = 1;
    let pontosAnterior = null;
    let posicaoAnterior = 1;

    participantes.forEach((participante, index) => {
      if (pontosAnterior !== null && participante.pontuacaoTotal === pontosAnterior) {
        participante.posicao = posicaoAnterior;
      } else {
        participante.posicao = posicao;
        posicaoAnterior = posicao;
      }
      pontosAnterior = participante.pontuacaoTotal;
      posicao++;
    });

    // Ajustar sorteios para DTO
    const sorteiosDTO = sorteios.map(sorteio => ({
      nome: sorteio.nome,
      valoresSorteados: sorteio.valores_sorteados || sorteio.valoresSorteados || []
    }));

    // Criar DTO
    return RankingBolaoDTO.create(bolao, participantes, sorteiosDTO);
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
