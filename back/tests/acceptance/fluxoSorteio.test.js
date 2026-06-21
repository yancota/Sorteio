// tests/acceptance/fluxoSorteio.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { _mockQuery } = require('pg');

// Mock do pg para simular o banco
jest.mock('pg');

describe('Fluxo de Aceitação E2E - Bolão e Sorteio', () => {
  let app;
  let adminToken;
  const JWT_SECRET = 'secret_for_e2e_acceptance_tests';
  const username = 'admin_e2e';
  const password = 'PasswordE2E123';

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.ADMIN_USERNAME = username;
    
    const salt = await bcrypt.genSalt(10);
    process.env.ADMIN_PASSWORD = await bcrypt.hash(password, salt);

    process.env.RUN_INIT_DB = 'false';
    app = require('../../src/index');

    // 1. Login para obter o token de Admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username, password });

    adminToken = loginRes.body.token;
  });

  afterAll(() => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.JWT_SECRET;
  });

  beforeEach(() => {
    _mockQuery.mockReset();
  });

  test('Deve executar o fluxo completo de sorteio com sucesso', async () => {
    // 2. Criar Usuário (Responsável)
    // findByTelefone check
    _mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    // create user query
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 10, nome: 'User E2E', telefone: '11999999999', grupo_id: null }],
      rowCount: 1
    });

    const userRes = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'User E2E', telefone: '11999999999' });

    expect(userRes.status).toBe(201);
    expect(userRes.body.success).toBe(true);
    expect(userRes.body.data.id).toBe(10);

    // 3. Criar Grupo (passando o usuário criado como responsável)
    // findById check (for responsible user)
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 10, nome: 'User E2E', telefone: '11999999999' }],
      rowCount: 1
    });
    // findByNome check
    _mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    // create group query
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, nome: 'Grupo E2E', usuario_responsavel_id: 10 }],
      rowCount: 1
    });

    const grupoRes = await request(app)
      .post('/api/grupos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Grupo E2E', usuario_responsavel_id: 10 });

    expect(grupoRes.status).toBe(201);
    expect(grupoRes.body.success).toBe(true);
    expect(grupoRes.body.data.id).toBe(1);

    // 4. Atualizar Usuário para associá-lo ao Grupo
    // findById check (userExistente)
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 10, nome: 'User E2E', telefone: '11999999999', grupo_id: null }],
      rowCount: 1
    });
    // update user query
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 10, nome: 'User E2E', telefone: '11999999999', grupo_id: 1 }],
      rowCount: 1
    });

    const userUpdateRes = await request(app)
      .put('/api/usuarios/10')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'User E2E', telefone: '11999999999', grupo_id: 1 });

    expect(userUpdateRes.status).toBe(200);
    expect(userUpdateRes.body.success).toBe(true);
    expect(userUpdateRes.body.data.grupo_id).toBe(1);

    // 5. Criar Bolão (com valor)
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 100, nome: 'Bolao Mega Sena', valor: 15.50, quantidade_campeao: 1 }],
      rowCount: 1
    });

    const bolaoRes = await request(app)
      .post('/api/boloes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Bolao Mega Sena', valor: 15.50, quantidadeCampeao: 1 });

    expect(bolaoRes.status).toBe(201);
    expect(bolaoRes.body.success).toBe(true);
    expect(bolaoRes.body.data.id).toBe(100);

    // 6. Inscrever Usuário no Bolão
    // findById bolao check
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 100, nome: 'Bolao Mega Sena', valor: 15.50 }],
      rowCount: 1
    });
    // findById usuario check
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 10, nome: 'User E2E', telefone: '11999999999' }],
      rowCount: 1
    });
    // findByUsuarioAndBolao duplicate check
    _mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    // create inscription query
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 500, bolao_id: 100, usuario_id: 10, apto: true, pontuacao_total: 0 }],
      rowCount: 1
    });

    const inscricaoRes = await request(app)
      .post('/api/inscricoes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ bolao_id: 100, usuario_id: 10 });

    expect(inscricaoRes.status).toBe(201);
    expect(inscricaoRes.body.success).toBe(true);
    expect(inscricaoRes.body.data.id).toBe(500);

    // 7. Fazer Aposta para a Inscrição
    // findById inscricao check
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 500, bolao_id: 100, usuario_id: 10, apto: true }],
      rowCount: 1
    });
    // findByInscricaoSingle duplicate check
    _mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    // create aposta query
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 900, inscricao_bolao_id: 500, valores_escolhidos: ['10', '20', '30', '40', '50', '60'] }],
      rowCount: 1
    });

    const apostaRes = await request(app)
      .post('/api/apostas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ inscricao_bolao_id: 500, valores_escolhidos: ['10', '20', '30', '40', '50', '60'] });

    expect(apostaRes.status).toBe(201);
    expect(apostaRes.body.success).toBe(true);
    expect(apostaRes.body.data.id).toBe(900);

    // 8. Criar Sorteio no Bolão (com os valores sorteados predefinidos)
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1000, nome: 'Concurso 001', bolao_id: 100, valores_sorteados: ['10', '20', '30', '44', '54', '64'] }],
      rowCount: 1
    });

    const sorteioRes = await request(app)
      .post('/api/sorteios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Concurso 001', bolao_id: 100, valores_sorteados: ['10', '20', '30', '44', '54', '64'] });

    expect(sorteioRes.status).toBe(201);
    expect(sorteioRes.body.success).toBe(true);
    expect(sorteioRes.body.data.id).toBe(1000);

    // 9. Realizar o Sorteio (para calcular acertos e pontuações)
    // findById sorteio check
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1000, nome: 'Concurso 001', bolao_id: 100, valores_sorteados: ['10', '20', '30', '44', '54', '64'] }],
      rowCount: 1
    });
    // findByBolao inscricoes check
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 500, bolao_id: 100, usuario_id: 10, apto: true, pontuacao_total: 0 }], rowCount: 1 });
    // findByInscricao apostas check
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 900, inscricao_bolao_id: 500, valores_escolhidos: ['10', '20', '30', '40', '50', '60'], valores_acertados: [] }], rowCount: 1 });
    // updateValoresAcertados query (matches are 10, 20, 30 = 3 matches)
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 900, valores_acertados: [10, 20, 30] }] });
    // updatePontuacao query (score = 3)
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 900, pontuacao: 3 }] });

    const realizarRes = await request(app)
      .post('/api/sorteios/1000/realizar')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(realizarRes.status).toBe(200);
    expect(realizarRes.body.success).toBe(true);
    expect(realizarRes.body.message).toBe('Sorteio realizado com sucesso');

    // 10. Verificar Ranking do Bolão
    // findById bolao check
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 100, nome: 'Bolao Mega Sena', valor: 15.50 }],
      rowCount: 1
    });
    // findByBolao inscricoes check
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 500, bolao_id: 100, usuario_id: 10, apto: true, pontuacao_total: 3 }], rowCount: 1 });
    // findByBolao sorteios check
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 1000, nome: 'Concurso 001', bolao_id: 100, valores_sorteados: ['10', '20', '30', '44', '54', '64'] }], rowCount: 1 });
    // findById user check inside loop
    _mockQuery.mockResolvedValueOnce({
      rows: [{ id: 10, nome: 'User E2E', telefone: '11999999999' }],
      rowCount: 1
    });
    // findByInscricao bet check inside loop
    _mockQuery.mockResolvedValueOnce({ rows: [{ id: 900, inscricao_bolao_id: 500, valores_escolhidos: ['10', '20', '30', '40', '50', '60'], valores_acertados: [10, 20, 30], pontuacao: 3 }], rowCount: 1 });

    const rankingRes = await request(app)
      .get('/api/inscricoes/bolao/100/ranking')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(rankingRes.status).toBe(200);
    expect(rankingRes.body.success).toBe(true);
    
    const rankingData = rankingRes.body.data;
    expect(rankingData.bolao).toBe('Bolao Mega Sena');
    expect(rankingData.participantes).toHaveLength(1);
    expect(rankingData.participantes[0].nome).toBe('User E2E');
    expect(rankingData.participantes[0].pontuacaoTotal).toBe(3);
    expect(rankingData.participantes[0].posicao).toBe(1);
  });
});
