class Bolao {
  constructor(id, nome, valor, sorteios = [], quantidadeCampeao, reiniciarBolao = false) {
    this.id = id;
    this.nome = nome;
    this.valor = valor; // Valor do bolão
    this.sorteios = sorteios; 
    this.quantidadeCampeao = quantidadeCampeao; 
    this.reiniciarBolao = reiniciarBolao; 
  }


  getId() {
    return this.id;
  }

  getNome() {
    return this.nome;
  }

  getValor() {
    return this.valor;
  }

  getSorteios() {
    return this.sorteios;
  }

  getQuantidadeCampeao() {
    return this.quantidadeCampeao;
  }

  getReiniciarBolao() {
    return this.reiniciarBolao;
  }

  setNome(nome) {
    this.nome = nome;
  }

  setValor(valor) {
    this.valor = valor;
  }

  setSorteios(sorteios) {
    this.sorteios = sorteios;
  }

  setQuantidadeCampeao(quantidadeCampeao) {
    this.quantidadeCampeao = quantidadeCampeao;
  }

  setReiniciarBolao(reiniciarBolao) {
    this.reiniciarBolao = reiniciarBolao;
  }

  // Métodos auxiliares
  adicionarSorteio(sorteio) {
    this.sorteios.push(sorteio);
  }

  removerSorteio(sorteioId) {
    this.sorteios = this.sorteios.filter(s => s.id !== sorteioId);
  }

  // Método para retornar dados básicos
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      valor: this.valor,
      sorteios: this.sorteios.map(s => s.toJSON()),
      quantidadeCampeao: this.quantidadeCampeao,
      reiniciarBolao: this.reiniciarBolao
    };
  }
}

module.exports = Bolao;
