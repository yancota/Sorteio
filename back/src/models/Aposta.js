class Aposta {
  constructor(id, inscricaoBolao, valoresEscolhidos = [], valoresAcertados = []) {
    this.id = id;
    this.inscricaoBolao = inscricaoBolao;
    this.valoresEscolhidos = valoresEscolhidos; 
    this.valoresAcertados = valoresAcertados; 
  }

  getId() {
    return this.id;
  }

  getInscricaoBolao() {
    return this.inscricaoBolao;
  }

  getValoresEscolhidos() {
    return this.valoresEscolhidos;
  }

  getValoresAcertados() {
    return this.valoresAcertados;
  }

  setInscricaoBolao(inscricaoBolao) {
    this.inscricaoBolao = inscricaoBolao;
  }

  setValoresEscolhidos(valoresEscolhidos) {
    this.valoresEscolhidos = valoresEscolhidos;
  }

  setValoresAcertados(valoresAcertados) {
    this.valoresAcertados = valoresAcertados;
  }

  adicionarValorEscolhido(valor) {
    this.valoresEscolhidos.push(valor);
  }

  calcularAcertos(sorteio) {
    if (!sorteio || !sorteio.valoresSorteados) {
      return 0;
    }
    
    const acertos = this.valoresEscolhidos.filter(valor => 
      sorteio.valoresSorteados.includes(valor)
    );
    
    return acertos.length;
  }

  toJSON() {
    return {
      id: this.id,
      inscricaoBolao: this.inscricaoBolao ? (typeof this.inscricaoBolao === 'object' ? this.inscricaoBolao.id : this.inscricaoBolao) : null,
      valoresEscolhidos: this.valoresEscolhidos,
      valoresAcertados: this.valoresAcertados
    };
  }
}

module.exports = Aposta;
