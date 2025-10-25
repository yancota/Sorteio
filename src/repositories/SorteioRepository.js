const { Pool } = require('pg');
const dbConfig = require('../config/database');
const pool = new Pool(dbConfig);

class SorteioRepository {
  // Criar um novo sorteio
  async create(sorteioData) {
    const { nome, bolao_id, valoresSorteados } = sorteioData;
    const result = await pool.query(
      `INSERT INTO sorteios (nome, bolao_id, valores_sorteados, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [nome, bolao_id, valoresSorteados || []]
    );
    return result.rows[0];
  }

  // Buscar todos os sorteios
  async findAll() {
    const result = await pool.query('SELECT * FROM sorteios');
    return result.rows;
  }

  // Buscar sorteio por ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM sorteios WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Buscar sorteios por nome
  async findByNome(nome) {
    const result = await pool.query('SELECT * FROM sorteios WHERE LOWER(nome) LIKE $1', [`%${nome.toLowerCase()}%`]);
    return result.rows;
  }

  // Buscar sorteios por bolão
  async findByBolao(bolaoId) {
    const result = await pool.query('SELECT * FROM sorteios WHERE bolao_id = $1', [bolaoId]);
    return result.rows;
  }

  // Atualizar sorteio
  async update(id, sorteioData) {
    const { nome, bolao_id, valoresSorteados } = sorteioData;
    const result = await pool.query(
      `UPDATE sorteios SET nome = $1, bolao_id = $2, valores_sorteados = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      [nome, bolao_id, valoresSorteados || [], id]
    );
    return result.rows[0] || null;
  }

  // Atualizar valores sorteados
  async updateValoresSorteados(id, valoresSorteados) {
    const result = await pool.query(
      `UPDATE sorteios SET valores_sorteados = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [valoresSorteados || [], id]
    );
    return result.rows[0] || null;
  }

  // Deletar sorteio
  async delete(id) {
    const result = await pool.query('DELETE FROM sorteios WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new SorteioRepository();
