class Aposta {
  constructor(id, inscricaoBolao, sorteio, valoresEscolhidos = [], valoresAcertados = []) {
    this.id = id;
    this.inscricaoBolao = inscricaoBolao;
    this.sorteio = sorteio; 
    this.valoresEscolhidos = valoresEscolhidos; 
    this.valoresAcertados = valoresAcertados; 
  }

  getId() {
    return this.id;
  }

  getInscricaoBolao() {
    return this.inscricaoBolao;
  }

  getSorteio() {
    return this.sorteio;
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

  setSorteio(sorteio) {
    this.sorteio = sorteio;
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

  calcularAcertos() {
    if (!this.sorteio || !this.sorteio.valoresSorteados) {
      return 0;
    }
    
    this.valoresAcertados = this.valoresEscolhidos.filter(valor => 
      this.sorteio.valoresSorteados.includes(valor)
    );
    
    return this.valoresAcertados.length;
  }

  toJSON() {
    return {
      id: this.id,
      inscricaoBolao: this.inscricaoBolao ? {
        id: this.inscricaoBolao.id
      } : null,
      sorteio: this.sorteio ? {
        id: this.sorteio.id,
        nome: this.sorteio.nome
      } : null,
      valoresEscolhidos: this.valoresEscolhidos,
      valoresAcertados: this.valoresAcertados
    };
  }
}

module.exports = Aposta;
