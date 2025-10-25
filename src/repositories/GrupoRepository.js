const { Pool } = require('pg');
const dbConfig = require('../config/database');
const pool = new Pool(dbConfig);

class GrupoRepository {
  // Criar um novo grupo
  async create(grupoData) {
    const { nome, usuario_responsavel_id } = grupoData;
    const result = await pool.query(
      `INSERT INTO grupos (nome, usuario_responsavel_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [nome, usuario_responsavel_id || null]
    );
    return result.rows[0];
  }

  // Buscar todos os grupos
  async findAll() {
    const result = await pool.query('SELECT * FROM grupos');
    return result.rows;
  }

  // Buscar grupo por ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM grupos WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Buscar grupos por usuário responsável
  async findByUsuarioResponsavel(usuarioId) {
    const result = await pool.query('SELECT * FROM grupos WHERE usuario_responsavel_id = $1', [usuarioId]);
    return result.rows;
  }

  // Buscar grupo por nome
  async findByNome(nome) {
    const result = await pool.query('SELECT * FROM grupos WHERE LOWER(nome) = $1', [nome.toLowerCase()]);
    return result.rows[0] || null;
  }

  // Atualizar grupo
  async update(id, grupoData) {
    const { nome, usuario_responsavel_id } = grupoData;
    const result = await pool.query(
      `UPDATE grupos SET nome = $1, usuario_responsavel_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [nome, usuario_responsavel_id || null, id]
    );
    return result.rows[0] || null;
  }

  // Deletar grupo
  async delete(id) {
    const result = await pool.query('DELETE FROM grupos WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new GrupoRepository();
