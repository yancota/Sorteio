class Grupo {
  constructor(id, usuarioResponsavel, nome) {
    this.id = id;
    this.usuarioResponsavel = usuarioResponsavel; 
    this.nome = nome;
  }

  getId() {
    return this.id;
  }

  getUsuarioResponsavel() {
    return this.usuarioResponsavel;
  }

  getNome() {
    return this.nome;
  }

  setUsuarioResponsavel(usuarioResponsavel) {
    this.usuarioResponsavel = usuarioResponsavel;
  }

  setNome(nome) {
    this.nome = nome;
  }

  toJSON() {
    return {
      id: this.id,
      usuarioResponsavel: this.usuarioResponsavel ? {
        id: this.usuarioResponsavel.id,
        nome: this.usuarioResponsavel.nome
      } : null,
      nome: this.nome
    };
  }
}

module.exports = Grupo;
