// DTO para Ranking do Bolão (Otimizado)
class RankingBolaoDTO {
  constructor(bolaoNome, participantes, sorteios) {
    this.bolao = bolaoNome;
    this.participantes = participantes;
    this.sorteios = sorteios;
  }

  static create(bolao, participantes, sorteios) {
    // Nome do bolão defensivo
    const bolaoNome = bolao && bolao.nome ? bolao.nome : 'Desconhecido';

    // Participantes otimizados - apenas dados essenciais
    const participantesOtimizados = participantes.map(p => ({
      nome: (p.usuario && p.usuario.nome) ? p.usuario.nome : (p.nome || 'Desconhecido'),
      valoresEscolhidos: p.valoresEscolhidos,
      pontuacaoTotal: p.pontuacaoTotal,
      posicao: p.posicao,
      valoresAcertados: p.valoresAcertados || []
    }));

    // Sorteios com apenas dados essenciais
    const sorteiosOtimizados = sorteios.map(s => ({
      nome: s.nome || 'Desconhecido',
      valoresSorteados: s.valoresSorteados || []
    }));

    return new RankingBolaoDTO(bolaoNome, participantesOtimizados, sorteiosOtimizados);
  }

  toJSON() {
    return {
      bolao: this.bolao,
      participantes: this.participantes,
      sorteios: this.sorteios
    };
  }
}

module.exports = RankingBolaoDTO;
