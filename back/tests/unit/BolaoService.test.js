// tests/unit/BolaoService.test.js
const BolaoService = require('../../src/services/BolaoService');
const BolaoRepository = require('../../src/repositories/BolaoRepository');
const SorteioRepository = require('../../src/repositories/SorteioRepository');

// Mock dos Repositories
jest.mock('../../src/repositories/BolaoRepository');
jest.mock('../../src/repositories/SorteioRepository');

describe('BolaoService - Testes de Unidade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('deve lançar erro se nome do bolão estiver ausente', async () => {
      await expect(BolaoService.create({ valor: 10, quantidadeCampeao: 1 }))
        .rejects.toThrow('Nome do bolão é obrigatório');
    });

    test('deve lançar erro se valor do bolão for menor ou igual a zero', async () => {
      await expect(BolaoService.create({ nome: 'Bolão A', valor: 0, quantidadeCampeao: 1 }))
        .rejects.toThrow('Valor do bolão deve ser maior que zero');
      await expect(BolaoService.create({ nome: 'Bolão A', valor: -5, quantidadeCampeao: 1 }))
        .rejects.toThrow('Valor do bolão deve ser maior que zero');
    });

    test('deve lançar erro se quantidade de campeões for menor ou igual a zero', async () => {
      await expect(BolaoService.create({ nome: 'Bolão A', valor: 10, quantidadeCampeao: 0 }))
        .rejects.toThrow('Quantidade de campeões deve ser maior que zero');
    });

    test('deve criar o bolão com sucesso se os dados forem válidos', async () => {
      const mockBolao = { id: 1, nome: 'Bolão da Copa', valor: 25.00, quantidadeCampeao: 2 };
      BolaoRepository.create.mockResolvedValue(mockBolao);

      const result = await BolaoService.create({ nome: 'Bolão da Copa', valor: 25.00, quantidadeCampeao: 2 });

      expect(result).toEqual(mockBolao);
      expect(BolaoRepository.create).toHaveBeenCalledWith({
        nome: 'Bolão da Copa',
        valor: 25.00,
        quantidadeCampeao: 2
      });
    });
  });

  describe('getAll', () => {
    test('deve retornar todos os bolões populados com seus respectivos sorteios', async () => {
      const mockBoloes = [
        { id: 1, nome: 'Bolão 1', valor: 10, quantidadeCampeao: 1 },
        { id: 2, nome: 'Bolão 2', valor: 20, quantidadeCampeao: 1 }
      ];
      const mockSorteiosB1 = [{ id: 101, nome: 'Sorteio 1', bolao_id: 1 }];
      const mockSorteiosB2 = [];

      BolaoRepository.findAll.mockResolvedValue(mockBoloes);
      SorteioRepository.findByBolao.mockImplementation((id) => {
        if (id === 1) return Promise.resolve(mockSorteiosB1);
        if (id === 2) return Promise.resolve(mockSorteiosB2);
        return Promise.resolve([]);
      });

      const result = await BolaoService.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].sorteios).toEqual(mockSorteiosB1);
      expect(result[1].sorteios).toEqual(mockSorteiosB2);
      expect(BolaoRepository.findAll).toHaveBeenCalled();
      expect(SorteioRepository.findByBolao).toHaveBeenCalledTimes(2);
    });
  });

  describe('getById', () => {
    test('deve lançar erro se o bolão não for encontrado', async () => {
      BolaoRepository.findById.mockResolvedValue(null);

      await expect(BolaoService.getById(99)).rejects.toThrow('Bolão não encontrado');
    });

    test('deve retornar o bolão se for encontrado', async () => {
      const mockBolao = { id: 1, nome: 'Bolão 1', valor: 10 };
      BolaoRepository.findById.mockResolvedValue(mockBolao);

      const result = await BolaoService.getById(1);

      expect(result).toEqual(mockBolao);
      expect(BolaoRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    test('deve lançar erro se o bolão não for encontrado para atualizar', async () => {
      BolaoRepository.findById.mockResolvedValue(null);

      await expect(BolaoService.update(99, { nome: 'Novo Nome' })).rejects.toThrow('Bolão não encontrado');
    });

    test('deve lançar erro se tentar atualizar com valor inválido', async () => {
      BolaoRepository.findById.mockResolvedValue({ id: 1, nome: 'Bolão 1', valor: 10 });

      await expect(BolaoService.update(1, { valor: -10 })).rejects.toThrow('Valor do bolão deve ser maior que zero');
    });

    test('deve atualizar o bolão com sucesso', async () => {
      const mockBolao = { id: 1, nome: 'Bolão 1', valor: 10, quantidadeCampeao: 1 };
      BolaoRepository.findById.mockResolvedValue(mockBolao);
      BolaoRepository.update.mockResolvedValue({ ...mockBolao, nome: 'Bolão Atualizado' });

      const result = await BolaoService.update(1, { nome: 'Bolão Atualizado' });

      expect(result.nome).toBe('Bolão Atualizado');
      expect(BolaoRepository.update).toHaveBeenCalledWith(1, { nome: 'Bolão Atualizado' });
    });
  });

  describe('delete', () => {
    test('deve lançar erro se o bolão não for encontrado para deletar', async () => {
      BolaoRepository.findById.mockResolvedValue(null);

      await expect(BolaoService.delete(99)).rejects.toThrow('Bolão não encontrado');
    });

    test('deve deletar o bolão com sucesso', async () => {
      BolaoRepository.findById.mockResolvedValue({ id: 1, nome: 'Bolão 1' });
      BolaoRepository.delete.mockResolvedValue(true);

      const result = await BolaoService.delete(1);

      expect(result).toBe(true);
      expect(BolaoRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
