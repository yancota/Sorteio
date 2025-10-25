const { Pool } = require('pg');
const dbConfig = require('../config/database');
const pool = new Pool(dbConfig);

class BolaoRepository {
  // Criar um novo bolão
  async create(bolaoData) {
    const { nome, valor, quantidadeCampeao, reiniciarBolao } = bolaoData;
    const result = await pool.query(
      `INSERT INTO boloes (nome, valor, quantidade_campeao, reiniciar_bolao, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [nome, valor, quantidadeCampeao, reiniciarBolao || false]
    );
    return result.rows[0];
  }

  // Buscar todos os bolões
  async findAll() {
    const result = await pool.query('SELECT * FROM boloes');
    return result.rows;
  }

  // Buscar bolão por ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM boloes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Buscar bolões por nome
  async findByNome(nome) {
    const result = await pool.query('SELECT * FROM boloes WHERE LOWER(nome) LIKE $1', [`%${nome.toLowerCase()}%`]);
    return result.rows;
  }

  // Buscar bolões ativos (não reiniciados)
  async findAtivos() {
    const result = await pool.query('SELECT * FROM boloes WHERE reiniciar_bolao = false');
    return result.rows;
  }

  // Atualizar bolão
  async update(id, bolaoData) {
    const { nome, valor, quantidadeCampeao, reiniciarBolao } = bolaoData;
    const result = await pool.query(
      `UPDATE boloes SET nome = $1, valor = $2, quantidade_campeao = $3, reiniciar_bolao = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
      [nome, valor, quantidadeCampeao, reiniciarBolao || false, id]
    );
    return result.rows[0] || null;
  }

  // Deletar bolão
  async delete(id) {
    const result = await pool.query('DELETE FROM boloes WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new BolaoRepository();
