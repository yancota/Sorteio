// Arquivo central para exportar todos os repositories

const UsuarioRepository = require('./UsuarioRepository');
const GrupoRepository = require('./GrupoRepository');
const SorteioRepository = require('./SorteioRepository');
const BolaoRepository = require('./BolaoRepository');
const InscricaoBolaoRepository = require('./InscricaoBolaoRepository');
const ApostaRepository = require('./ApostaRepository');

module.exports = {
  UsuarioRepository,
  GrupoRepository,
  SorteioRepository,
  BolaoRepository,
  InscricaoBolaoRepository,
  ApostaRepository
};
