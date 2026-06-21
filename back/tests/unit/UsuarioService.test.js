// tests/unit/UsuarioService.test.js
const UsuarioService = require('../../src/services/UsuarioService');
const UsuarioRepository = require('../../src/repositories/UsuarioRepository');

// Mock do UsuarioRepository
jest.mock('../../src/repositories/UsuarioRepository');

describe('UsuarioService - Testes de Unidade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('deve lançar erro se nome ou telefone estiverem ausentes', async () => {
      await expect(UsuarioService.create({ nome: '' })).rejects.toThrow('Nome e telefone são obrigatórios');
      await expect(UsuarioService.create({ telefone: '' })).rejects.toThrow('Nome e telefone são obrigatórios');
    });

    test('deve lançar erro se o telefone já estiver cadastrado', async () => {
      UsuarioRepository.findByTelefone.mockResolvedValue({ id: 1, nome: 'João', telefone: '11999999999' });

      await expect(UsuarioService.create({ nome: 'Maria', telefone: '11999999999' }))
        .rejects.toThrow('Telefone já cadastrado');
      
      expect(UsuarioRepository.findByTelefone).toHaveBeenCalledWith('11999999999');
    });

    test('deve criar o usuário com sucesso se os dados forem válidos', async () => {
      const mockUser = { id: 2, nome: 'Maria', telefone: '11888888888', grupo_id: 1 };
      UsuarioRepository.findByTelefone.mockResolvedValue(null);
      UsuarioRepository.create.mockResolvedValue(mockUser);

      const result = await UsuarioService.create({ nome: 'Maria', telefone: '11888888888', grupo_id: 1 });

      expect(result).toEqual(mockUser);
      expect(UsuarioRepository.create).toHaveBeenCalledWith({
        nome: 'Maria',
        telefone: '11888888888',
        grupo_id: 1
      });
    });
  });

  describe('getAll', () => {
    test('deve retornar todos os usuários', async () => {
      const mockUsers = [
        { id: 1, nome: 'João', telefone: '11999999999' },
        { id: 2, nome: 'Maria', telefone: '11888888888' }
      ];
      UsuarioRepository.findAll.mockResolvedValue(mockUsers);

      const result = await UsuarioService.getAll();

      expect(result).toEqual(mockUsers);
      expect(UsuarioRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    test('deve lançar erro se o usuário não for encontrado', async () => {
      UsuarioRepository.findById.mockResolvedValue(null);

      await expect(UsuarioService.getById(99)).rejects.toThrow('Usuário não encontrado');
    });

    test('deve retornar o usuário se for encontrado', async () => {
      const mockUser = { id: 1, nome: 'João', telefone: '11999999999' };
      UsuarioRepository.findById.mockResolvedValue(mockUser);

      const result = await UsuarioService.getById(1);

      expect(result).toEqual(mockUser);
      expect(UsuarioRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    test('deve lançar erro se tentar atualizar usuário que não existe', async () => {
      UsuarioRepository.findById.mockResolvedValue(null);

      await expect(UsuarioService.update(99, { nome: 'Nome Novo' })).rejects.toThrow('Usuário não encontrado');
    });

    test('deve lançar erro se tentar alterar para um telefone que já está em uso por outro usuário', async () => {
      UsuarioRepository.findById.mockResolvedValue({ id: 1, nome: 'João', telefone: '11999999999' });
      UsuarioRepository.findByTelefone.mockResolvedValue({ id: 2, nome: 'Maria', telefone: '11888888888' });

      await expect(UsuarioService.update(1, { telefone: '11888888888' }))
        .rejects.toThrow('Telefone já cadastrado para outro usuário');
    });

    test('deve atualizar o usuário com sucesso', async () => {
      const mockUser = { id: 1, nome: 'João Silva', telefone: '11999999999' };
      UsuarioRepository.findById.mockResolvedValue(mockUser);
      UsuarioRepository.update.mockResolvedValue({ ...mockUser, nome: 'João Silva Novo' });

      const result = await UsuarioService.update(1, { nome: 'João Silva Novo' });

      expect(result.nome).toBe('João Silva Novo');
      expect(UsuarioRepository.update).toHaveBeenCalledWith(1, { nome: 'João Silva Novo' });
    });
  });

  describe('delete', () => {
    test('deve lançar erro se o usuário a ser deletado não for encontrado', async () => {
      UsuarioRepository.findById.mockResolvedValue(null);

      await expect(UsuarioService.delete(99)).rejects.toThrow('Usuário não encontrado');
    });

    test('deve deletar o usuário com sucesso', async () => {
      UsuarioRepository.findById.mockResolvedValue({ id: 1, nome: 'João' });
      UsuarioRepository.delete.mockResolvedValue(true);

      const result = await UsuarioService.delete(1);

      expect(result).toBe(true);
      expect(UsuarioRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
