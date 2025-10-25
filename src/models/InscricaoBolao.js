class InscricaoBolao {
  constructor(id, bolao, usuario, apto = true, pontuacaoTotal = 0) {
    this.id = id;
    this.bolao = bolao; 
    this.usuario = usuario; 
    this.apto = apto; 
    this.pontuacaoTotal = pontuacaoTotal;
  }

  getId() {
    return this.id;
  }

  getBolao() {
    return this.bolao;
  }

  getUsuario() {
    return this.usuario;
  }

  getApto() {
    return this.apto;
  }

  getPontuacaoTotal() {
    return this.pontuacaoTotal;
  }

  setBolao(bolao) {
    this.bolao = bolao;
  }

  setUsuario(usuario) {
    this.usuario = usuario;
  }

  setApto(apto) {
    this.apto = apto;
  }

  setPontuacaoTotal(pontuacaoTotal) {
    this.pontuacaoTotal = pontuacaoTotal;
  }

  adicionarPontuacao(pontos) {
    this.pontuacaoTotal += pontos;
  }

  resetarPontuacao() {
    this.pontuacaoTotal = 0;
  }

  toJSON() {
    return {
      id: this.id,
      bolao: this.bolao ? {
        id: this.bolao.id,
        nome: this.bolao.nome
      } : null,
      usuario: this.usuario ? {
        id: this.usuario.id,
        nome: this.usuario.nome
      } : null,
      apto: this.apto,
      pontuacaoTotal: this.pontuacaoTotal
    };
  }
}

module.exports = InscricaoBolao;
