class Usuario {
  constructor(id, nome, telefone, grupo = null) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.grupo = grupo;
  }

  getId() {
    return this.id;
  }

  getNome() {
    return this.nome;
  }

  getTelefone() {
    return this.telefone;
  }

  getGrupo() {
    return this.grupo;
  }

  setNome(nome) {
    this.nome = nome;
  }

  setTelefone(telefone) {
    this.telefone = telefone;
  }

  setGrupo(grupo) {
    this.grupo = grupo;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      telefone: this.telefone,
      grupo: this.grupo ? this.grupo.toJSON() : null
    };
  }
}

module.exports = Usuario;
