class Sorteio {
  constructor(id, valor, nome, valoresSorteados = []) {
    this.id = id;
    this.valor = valor; 
    this.nome = nome;
    this.valoresSorteados = valoresSorteados; 
  }

  getId() {
    return this.id;
  }

  getValor() {
    return this.valor;
  }

  getNome() {
    return this.nome;
  }

  getValoresSorteados() {
    return this.valoresSorteados;
  }

  setValor(valor) {
    this.valor = valor;
  }

  setNome(nome) {
    this.nome = nome;
  }

  setValoresSorteados(valoresSorteados) {
    this.valoresSorteados = valoresSorteados;
  }

  adicionarValorSorteado(valor) {
    this.valoresSorteados.push(valor);
  }

  limparValoresSorteados() {
    this.valoresSorteados = [];
  }

  // Método para retornar dados básicos
  toJSON() {
    return {
      id: this.id,
      valor: this.valor,
      nome: this.nome,
      valoresSorteados: this.valoresSorteados
    };
  }
}

module.exports = Sorteio;
