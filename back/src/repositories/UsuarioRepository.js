
const { Pool } = require('pg');
const dbConfig = require('../config/database');
const pool = new Pool(dbConfig);

class UsuarioRepository {
  // Criar um novo usuário
  async create(usuarioData) {
    const { nome, telefone, grupo_id } = usuarioData;
    const result = await pool.query(
      `INSERT INTO usuarios (nome, telefone, grupo_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [nome, telefone, grupo_id || null]
    );
    return result.rows[0];
  }

  // Buscar todos os usuários
  async findAll() {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
  }

  // Buscar usuário por ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Buscar usuário por telefone
  async findByTelefone(telefone) {
    const result = await pool.query('SELECT * FROM usuarios WHERE telefone = $1', [telefone]);
    return result.rows[0] || null;
  }

  // Buscar usuários por grupo
  async findByGrupo(grupoId) {
    const result = await pool.query('SELECT * FROM usuarios WHERE grupo_id = $1', [grupoId]);
    return result.rows;
  }

  // Atualizar usuário
  async update(id, usuarioData) {
    const { nome, telefone, grupo_id } = usuarioData;
    const result = await pool.query(
      `UPDATE usuarios SET nome = $1, telefone = $2, grupo_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      [nome, telefone, grupo_id || null, id]
    );
    return result.rows[0] || null;
  }

  // Deletar usuário
  async delete(id) {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new UsuarioRepository();
