import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/features/usuario/service/usuario_service.dart';

class CadastroUsuarioScreen extends StatefulWidget {
  const CadastroUsuarioScreen({Key? key}) : super(key: key);

  @override
  State<CadastroUsuarioScreen> createState() => _CadastroUsuarioScreenState();
}

class _PhoneInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    var digits = newValue.text.replaceAll(RegExp(r'\D'), '');
    if (digits.length > 11) digits = digits.substring(0, 11);

    String formatted = digits;

    if (digits.isEmpty) {
      formatted = '';
    } else if (digits.length <= 2) {
      formatted = '(${digits}';
    } else if (digits.length <= 6) {
      formatted = '(${digits.substring(0, 2)}) ${digits.substring(2)}';
    } else if (digits.length <= 10) {
      formatted =
          '(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}';
    } else {
      // 11 dígitos
      formatted =
          '(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}';
    }

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class _CadastroUsuarioScreenState extends State<CadastroUsuarioScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nomeController = TextEditingController();
  final TextEditingController _telefoneController = TextEditingController();
  final UsuarioService _service = UsuarioService();
  bool _isLoading = false;

  @override
  void dispose() {
    _nomeController.dispose();
    _telefoneController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final UsuarioDto usuario = await _service.cadastrarUsuario(
        _nomeController.text.trim(),
        _telefoneController.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Usuário ${usuario.nome} cadastrado com sucesso'),
        ),
      );

      // Retorna o usuário criado para a tela anterior
      Navigator.of(context).pop(usuario);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao cadastrar usuário: ${e.toString()}')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // Formatter simples para números de telefone brasileiros
  // Formatos:
  // 11 dígitos -> (AA) ABBBB-CCCC  e.g. (11) 98765-4321
  // 10 dígitos -> (AA) BBBB-CCCC   e.g. (11) 8765-4321
  // Enquanto digita aplica máscara
  TextInputFormatter phoneInputFormatter() {
    return _PhoneInputFormatter();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cadastro de Usuário')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _nomeController,
                decoration: const InputDecoration(
                  labelText: 'Nome',
                  hintText: 'Digite o nome completo',
                ),
                textInputAction: TextInputAction.next,
                validator: (v) {
                  if (v == null || v.trim().isEmpty)
                    return 'Nome é obrigatório';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _telefoneController,
                decoration: const InputDecoration(
                  labelText: 'Telefone',
                  hintText: 'Digite o telefone (apenas números)',
                ),
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.done,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(11),
                  phoneInputFormatter(),
                ],
                validator: (v) {
                  if (v == null || v.trim().isEmpty)
                    return 'Telefone é obrigatório';
                  // validação simples: apenas dígitos e pelo menos 7 caracteres
                  final digits = v.replaceAll(RegExp(r'\D'), '');
                  if (digits.length < 7) return 'Telefone inválido';
                  return null;
                },
                onFieldSubmitted: (_) => _submit(),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Cadastrar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
