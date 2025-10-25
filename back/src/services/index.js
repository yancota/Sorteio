// Arquivo central para exportar todos os services

const UsuarioService = require('./UsuarioService');
const GrupoService = require('./GrupoService');
const SorteioService = require('./SorteioService');
const BolaoService = require('./BolaoService');
const InscricaoBolaoService = require('./InscricaoBolaoService');
const ApostaService = require('./ApostaService');

module.exports = {
  UsuarioService,
  GrupoService,
  SorteioService,
  BolaoService,
  InscricaoBolaoService,
  ApostaService
};
