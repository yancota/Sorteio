class Sorteio {
  constructor(id, valor, nome, bolao, valoresSorteados = []) {
    this.id = id;
    this.valor = valor; 
    this.nome = nome;
    this.bolao = bolao; // Referência ao bolão
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

  getBolao() {
    return this.bolao;
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

  setBolao(bolao) {
    this.bolao = bolao;
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
      bolao: this.bolao ? (typeof this.bolao === 'object' ? this.bolao.id : this.bolao) : null,
      valoresSorteados: this.valoresSorteados
    };
  }
}

module.exports = Sorteio;
