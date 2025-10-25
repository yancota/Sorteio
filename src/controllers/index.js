// Arquivo central para exportar todos os controllers

const UsuarioController = require('./UsuarioController');
const GrupoController = require('./GrupoController');
const SorteioController = require('./SorteioController');
const BolaoController = require('./BolaoController');
const InscricaoBolaoController = require('./InscricaoBolaoController');
const ApostaController = require('./ApostaController');

module.exports = {
  UsuarioController,
  GrupoController,
  SorteioController,
  BolaoController,
  InscricaoBolaoController,
  ApostaController
};
