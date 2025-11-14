const { Pool } = require('pg');
const dbConfig = require('../config/database');
const pool = new Pool(dbConfig);

class InscricaoBolaoRepository {
  // Criar uma nova inscrição
  async create(inscricaoData) {
    const { bolao_id, usuario_id, apto,  } = inscricaoData;
    const result = await pool.query(
      `INSERT INTO inscricoes_bolao (bolao_id, usuario_id, apto, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [bolao_id, usuario_id, apto !== undefined ? apto : true]
    );
    return result.rows[0];
  }

  // Buscar todas as inscrições
  async findAll() {
    const result = await pool.query('SELECT * FROM inscricoes_bolao');
    return result.rows;
  }

  // Buscar inscrição por ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM inscricoes_bolao WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Buscar inscrições por bolão
  async findByBolao(bolaoId) {
    const result = await pool.query('SELECT * FROM inscricoes_bolao WHERE bolao_id = $1', [bolaoId]);
    return result.rows;
  }

  // Buscar inscrições por usuário
  async findByUsuario(usuarioId) {
    const result = await pool.query('SELECT * FROM inscricoes_bolao WHERE usuario_id = $1', [usuarioId]);
    return result.rows;
  }

  // Buscar inscrição específica de usuário em bolão
  async findByUsuarioAndBolao(usuarioId, bolaoId) {
    const result = await pool.query('SELECT * FROM inscricoes_bolao WHERE usuario_id = $1 AND bolao_id = $2', [usuarioId, bolaoId]);
    return result.rows[0] || null;
  }

  // Buscar inscrições aptas em um bolão
  async findAptasByBolao(bolaoId) {
    const result = await pool.query('SELECT * FROM inscricoes_bolao WHERE bolao_id = $1 AND apto = true', [bolaoId]);
    return result.rows;
  }

  // Obter ranking de um bolão (ordenado por pontuação)
  async getRankingByBolao(bolaoId) {
    const result = await pool.query('SELECT * FROM inscricoes_bolao WHERE bolao_id = $1 ORDER BY pontuacao_total DESC', [bolaoId]);
    return result.rows;
  }

  // Atualizar inscrição
  async update(id, inscricaoData) {
    const { apto, pontuacao_total } = inscricaoData;
    const result = await pool.query(
      `UPDATE inscricoes_bolao SET apto = $1, pontuacao_total = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [apto !== undefined ? apto : true, pontuacao_total || 0, id]
    );
    return result.rows[0] || null;
  }

  // Atualizar pontuação
  async updatePontuacao(id, pontos) {
    const inscricao = await this.findById(id);
    if (!inscricao) return null;
    const novaPontuacao = (inscricao.pontuacao_total || 0) + pontos;
    const result = await pool.query(
      `UPDATE inscricoes_bolao SET pontuacao_total = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [novaPontuacao, id]
    );
    return result.rows[0] || null;
  }

  // Resetar pontuação
  async resetPontuacao(id) {
    const result = await pool.query(
      `UPDATE inscricoes_bolao SET pontuacao_total = 0, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Deletar inscrição
  async delete(id) {
    const result = await pool.query('DELETE FROM inscricoes_bolao WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async tornarApto(id) {
    const result = await pool.query(
      `UPDATE inscricoes_bolao SET apto = true, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new InscricaoBolaoRepository();
