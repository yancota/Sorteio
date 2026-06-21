// tests/integration/auth.test.js
const request = require('supertest');
const bcrypt = require('bcryptjs');

// Mock do pg para não conectar no banco físico
jest.mock('pg');

describe('authRoute - Testes de Integração', () => {
  let app;
  const username = 'admin_test';
  const password = 'AdminPassword123';

  beforeAll(async () => {
    // Definindo variáveis de ambiente antes de inicializar o app
    process.env.JWT_SECRET = 'super_secret_for_testing';
    process.env.ADMIN_USERNAME = username;
    
    // Gera hash bcrypt válido para a senha
    const salt = await bcrypt.genSalt(10);
    process.env.ADMIN_PASSWORD = await bcrypt.hash(password, salt);

    // Importa o app depois de configurar o ambiente
    // Nota: Como o index.js exporta a app através da função startApp, vamos iniciar e exportar
    // Mas wait, index.js roda startApp() se RUN_INIT_DB não for true.
    // E no final exporta o módulo. Vamos conferir.
    process.env.RUN_INIT_DB = 'false';
    app = require('../../src/index');
  });

  afterAll(() => {
    // Limpa variáveis de ambiente
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.JWT_SECRET;
  });

  test('POST /api/auth/login - Deve logar com sucesso e retornar token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username, password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Login bem-sucedido!');
  });

  test('POST /api/auth/login - Deve falhar se o usuário estiver incorreto', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'usuario_errado', password });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Usuário ou senha inválidos.');
  });

  test('POST /api/auth/login - Deve falhar se a senha estiver incorreta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username, password: 'senha_errada' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Usuário ou senha inválidos.');
  });
});
