import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/controller/usuario/palpite_bolao_controller.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class FazerApostaPage extends StatefulWidget {
  final int? inscricaoId;
  final List<String>? valoresEscolhidos;
  final bool? apto;

  const FazerApostaPage({
    Key? key,
    this.inscricaoId,
    this.valoresEscolhidos,
    this.apto,
  }) : super(key: key);

  @override
  State<FazerApostaPage> createState() => _FazerApostaPageState();
}

class _FazerApostaPageState extends State<FazerApostaPage> {
  final controller = PalpiteBolaoController();
  final TextEditingController _inputController = TextEditingController();

  @override
  void initState() {
    super.initState();
    controller.init(widget.inscricaoId);
    if (widget.valoresEscolhidos != null)
      controller.valoresEscolhidos = List.from(widget.valoresEscolhidos!);
  }

  @override
  void dispose() {
    _inputController.dispose();
    controller.dispose();
    super.dispose();
  }

  Future<void> _confirm() async {
    try {
      final ok = await controller.fazerAposta();
      if (ok) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Aposta criada com sucesso')),
        );
        Modular.to.pop(true);
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Falha ao criar aposta')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Erro: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fazer Aposta'), centerTitle: true),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: AnimatedBuilder(
          animation: controller,
          builder: (context, _) {
            final valores = controller.valoresEscolhidos;
            return Column(
              children: [
                const SizedBox(height: 12),
                // Input + botão Adicionar
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _inputController,
                          decoration: const InputDecoration(
                            hintText: 'Ex: 07, 15, 22',
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () {
                          final text = _inputController.text;
                          if (text.trim().isEmpty) return;
                          controller.addValoresFromText(text);
                          _inputController.clear();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Constants.primary,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 12,
                          ),
                        ),
                        child: const Text(
                          'Adicionar',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Seus Números Selecionados',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                if (valores.isEmpty) ...[
                  const Text('Nenhum número selecionado.'),
                  const SizedBox(height: 8),
                  const Text('Adicione números antes de confirmar.'),
                ] else
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: valores.map((v) => _chipRemovivel(v)).toList(),
                  ),
                const Spacer(),
                SafeArea(
                  top: false,
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Constants.primary,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: controller.isLoading ? null : _confirm,
                      child: controller.isLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Confirmar Aposta',
                              style: TextStyle(color: Colors.white),
                            ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _chipRemovivel(String text) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: 80,
          height: 80,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Constants.lightGray,
            shape: BoxShape.circle,
          ),
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
        ),
        Positioned(
          top: -6,
          right: -6,
          child: GestureDetector(
            onTap: () => controller.removeValor(text),
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: Colors.grey.shade600,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close, size: 16, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }
}
