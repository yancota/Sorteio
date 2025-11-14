import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/controller/bolao_controller.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class CriarBolaoPage extends StatefulWidget {
  const CriarBolaoPage({Key? key}) : super(key: key);

  @override
  State<CriarBolaoPage> createState() => _CriarBolaoPageState();
}

class _CriarBolaoPageState extends State<CriarBolaoPage> {
  final BolaoController _controller = BolaoController();
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nomeController = TextEditingController();
  final TextEditingController _quantidadeController = TextEditingController();
  final TextEditingController _valorController = TextEditingController();

  bool _reiniciarBolao = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _nomeController.dispose();
    _quantidadeController.dispose();
    _valorController.dispose();
    super.dispose();
  }

  String _formatCurrencyInput(String value) {
    // Remove tudo exceto números
    String numbers = value.replaceAll(RegExp(r'[^0-9]'), '');

    if (numbers.isEmpty) return '';

    // Converte para centavos
    double amount = double.parse(numbers) / 100;

    // Formata como moeda brasileira
    return 'R\$ ${amount.toStringAsFixed(2).replaceAll('.', ',')}';
  }

  double _parseCurrencyValue(String value) {
    // Remove tudo exceto números
    String numbers = value.replaceAll(RegExp(r'[^0-9]'), '');
    if (numbers.isEmpty) return 0.0;
    return double.parse(numbers) / 100;
  }

  Future<void> _criarBolao() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      final nome = _nomeController.text.trim();
      final quantidade = int.tryParse(_quantidadeController.text) ?? 0;
      final valor = _parseCurrencyValue(_valorController.text);

      await _controller.criarBolao(nome, quantidade, _reiniciarBolao, valor);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Bolão criado com sucesso!'),
            backgroundColor: Colors.green,
          ),
        );

        // Retorna true para indicar que deve atualizar a lista
        Modular.to.pop(true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao criar bolão: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final primary = Constants.primary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Criar Novo Bolão'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Nome do Bolão
                    const Text(
                      'Nome do Bolão',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _nomeController,
                      decoration: InputDecoration(
                        hintText: 'Ex: Bolão do Brasileirão 2024',
                        prefixIcon: const Icon(Icons.emoji_events),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Por favor, informe o nome do bolão';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),

                    // Quantidade de Ganhadores
                    const Text(
                      'Quantidade de Acertos',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _quantidadeController,
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      decoration: InputDecoration(
                        hintText: '0',
                        prefixIcon: const Icon(Icons.groups),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Por favor, informe a quantidade de acertos';
                        }
                        final num = int.tryParse(value);
                        if (num == null || num <= 0) {
                          return 'Informe um número válido maior que zero';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Quantos acertos para ganhar o bolão?',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Valor da Aposta
                    const Text(
                      'Valor da Bolão',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _valorController,
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      onChanged: (value) {
                        final formatted = _formatCurrencyInput(value);
                        _valorController.value = TextEditingValue(
                          text: formatted,
                          selection: TextSelection.collapsed(
                            offset: formatted.length,
                          ),
                        );
                      },
                      decoration: InputDecoration(
                        hintText: 'R\$ 0,00',
                        prefixIcon: const Icon(Icons.attach_money),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Por favor, informe o valor da bolão';
                        }
                        final val = _parseCurrencyValue(value);
                        if (val <= 0) {
                          return 'Informe um valor maior que zero';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),

                    // Reiniciar Bolão
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Reiniciar Bolão automaticamente?',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Cria um novo bolão com as mesmas regras ao final deste.',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Switch(
                            value: _reiniciarBolao,
                            onChanged: (value) {
                              setState(() => _reiniciarBolao = value);
                            },
                            activeColor: primary,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Action Bar
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                border: Border(
                  top: BorderSide(color: Colors.grey.shade300, width: 1),
                ),
              ),
              child: SafeArea(
                child: SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _criarBolao,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.5,
                            ),
                          )
                        : const Text(
                            'CRIAR BOLÃO',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
