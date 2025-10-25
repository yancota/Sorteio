const { Pool } = require('pg');
const dbConfig = require('../config/database');
const pool = new Pool(dbConfig);

class ApostaRepository {
  // Criar uma nova aposta
  async create(apostaData) {
    const { inscricao_bolao_id, valores_escolhidos } = apostaData;
    const result = await pool.query(
      `INSERT INTO apostas (inscricao_bolao_id, valores_escolhidos, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [inscricao_bolao_id, valores_escolhidos || []]
    );
    return result.rows[0];
  }

  // Buscar todas as apostas
  async findAll() {
    const result = await pool.query('SELECT * FROM apostas');
    return result.rows;
  }

  // Buscar aposta por ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM apostas WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Buscar apostas por inscrição
  async findByInscricao(inscricaoId) {
    const result = await pool.query('SELECT * FROM apostas WHERE inscricao_bolao_id = $1', [inscricaoId]);
    return result.rows;
  }

  // Buscar aposta específica de inscrição
  async findByInscricaoSingle(inscricaoId) {
    const result = await pool.query('SELECT * FROM apostas WHERE inscricao_bolao_id = $1', [inscricaoId]);
    return result.rows[0] || null;
  }

  // Atualizar aposta
  async update(id, apostaData) {
    const { valores_escolhidos } = apostaData;
    const result = await pool.query(
      `UPDATE apostas SET valores_escolhidos = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [valores_escolhidos || [], id]
    );
    return result.rows[0] || null;
  }

  async updateValoresAcertados(id, valoresAcertados) {
    const result = await pool.query(
      `UPDATE apostas SET valores_acertados = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [valoresAcertados || [], id]
    );
    return result.rows[0] || null;
  }

  async updatePontuacao(id, novaPontuacao) {
    const result = await pool.query(
      `UPDATE apostas SET pontuacao = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [novaPontuacao || 0, id]
    );
    return result.rows[0] || null;
  }

  // Deletar aposta
  async delete(id) {
    const result = await pool.query('DELETE FROM apostas WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Deletar todas as apostas de uma inscrição
  async deleteByInscricao(inscricaoId) {
    const result = await pool.query('DELETE FROM apostas WHERE inscricao_bolao_id = $1', [inscricaoId]);
    return result.rowCount > 0;
  }
}

module.exports = new ApostaRepository();
