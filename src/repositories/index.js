// Arquivo central para exportar todos os repositories


const useSql = process.env.USE_SQL === 'true';

let BolaoRepositorySQL, UsuarioRepositorySQL, GrupoRepositorySQL, SorteioRepositorySQL, InscricaoBolaoRepositorySQL, ApostaRepositorySQL;
try {
  BolaoRepositorySQL = require('./BolaoRepositorySQL');
  UsuarioRepositorySQL = require('./UsuarioRepositorySQL');
  GrupoRepositorySQL = require('./GrupoRepositorySQL');
  SorteioRepositorySQL = require('./SorteioRepositorySQL');
  InscricaoBolaoRepositorySQL = require('./InscricaoBolaoRepositorySQL');
  ApostaRepositorySQL = require('./ApostaRepositorySQL');
} catch (e) {}

const UsuarioRepository = useSql && UsuarioRepositorySQL ? UsuarioRepositorySQL : require('./UsuarioRepository');
const GrupoRepository = useSql && GrupoRepositorySQL ? GrupoRepositorySQL : require('./GrupoRepository');
const SorteioRepository = useSql && SorteioRepositorySQL ? SorteioRepositorySQL : require('./SorteioRepository');
const BolaoRepository = useSql && BolaoRepositorySQL ? BolaoRepositorySQL : require('./BolaoRepository');
const InscricaoBolaoRepository = useSql && InscricaoBolaoRepositorySQL ? InscricaoBolaoRepositorySQL : require('./InscricaoBolaoRepository');
const ApostaRepository = useSql && ApostaRepositorySQL ? ApostaRepositorySQL : require('./ApostaRepository');

module.exports = {
  UsuarioRepository,
  GrupoRepository,
  SorteioRepository,
  BolaoRepository,
  InscricaoBolaoRepository,
  ApostaRepository
};
