// tests/integration/usuarios.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { _mockQuery } = require('pg');

// Mock do pg para simular o banco
jest.mock('pg');

describe('usuarioRoutes - Testes de Integração', () => {
  let app;
  let adminToken;
  const JWT_SECRET = 'secret_for_user_integration_tests';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.RUN_INIT_DB = 'false';
    app = require('../../src/index');

    // Gera um token válido de admin
    adminToken = jwt.sign({ user: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  beforeEach(() => {
    _mockQuery.mockReset();
  });

  test('GET /api/usuarios - Deve retornar 401 se token não for fornecido', async () => {
    const res = await request(app).get('/api/usuarios');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido.');
  });

  test('GET /api/usuarios - Deve retornar 401 se token for inválido', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token inválido ou expirado.');
  });

  test('GET /api/usuarios - Deve retornar 200 e lista de usuários com token válido', async () => {
    const mockUsersList = [
      { id: 1, nome: 'Usuário A', telefone: '11999999999', grupo_id: null },
      { id: 2, nome: 'Usuário B', telefone: '11888888888', grupo_id: null }
    ];

    // Configura o mock do Pool.query para retornar os usuários
    _mockQuery.mockResolvedValue({
      rows: mockUsersList,
      rowCount: mockUsersList.length
    });

    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockUsersList);
    
    // Verifica se a query sql executada foi a de busca de todos os usuários
    expect(_mockQuery).toHaveBeenCalledWith('SELECT * FROM usuarios');
  });

  test('POST /api/usuarios - Deve criar usuário com sucesso se autenticado e dados válidos', async () => {
    const newUserInput = { nome: 'Lucas', telefone: '11777777777', grupo_id: null };
    const mockCreatedUser = { id: 3, nome: 'Lucas', telefone: '11777777777', grupo_id: null };

    // Primeiro mock: findByTelefone (retorna null indicando que telefone está vago)
    _mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 0
    });

    // Segundo mock: create (insere e retorna o usuário criado)
    _mockQuery.mockResolvedValueOnce({
      rows: [mockCreatedUser],
      rowCount: 1
    });

    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUserInput);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockCreatedUser);
  });
});
