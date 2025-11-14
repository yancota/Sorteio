import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/controller/usuario/palpite_bolao_controller.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class ParticipanteDetailPage extends StatefulWidget {
  final int? id;
  final String nome;
  final List<String> valoresEscolhidos;
  final List<String> valoresAcertados;
  final int inscricaoId;
  final bool apto;

  const ParticipanteDetailPage({
    Key? key,
    this.id,
    required this.nome,
    required this.valoresEscolhidos,
    required this.valoresAcertados,
    required this.inscricaoId,
    required this.apto,
  }) : super(key: key);

  @override
  State<ParticipanteDetailPage> createState() => _ParticipanteDetailPageState();
}

class _ParticipanteDetailPageState extends State<ParticipanteDetailPage> {
  final controller = PalpiteBolaoController();
  bool? _apto;

  @override
  void initState() {
    super.initState();
    _apto = widget.apto;
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> _tornarApto() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar'),
        content: const Text('Deseja tornar este usuário apto para participar?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Constants.primary),
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text(
              'Confirmar',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        final success = await controller.tornarApto(widget.inscricaoId);
        if (success && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Usuário tornado apto com sucesso')),
          );
          setState(() {
            _apto = true;
          });
        } else if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Falha ao tornar usuário apto')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Erro: $e')));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.nome,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 12),
            Text(
              'Números escolhidos',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),

            // Grid de números escolhidos
            if (widget.valoresEscolhidos.isNotEmpty)
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 12,
                runSpacing: 12,
                children: widget.valoresEscolhidos.map((v) {
                  final acertou = widget.valoresAcertados.contains(v);
                  return _numberChip(v, acertou, context);
                }).toList(),
              )
            else
              Center(
                heightFactor: 3,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 8),
                    const Icon(
                      Icons.info_outline,
                      size: 48,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Este participante ainda não escolheu números.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    if (_apto != null && !_apto!) ...[
                      ElevatedButton(
                        onPressed: _tornarApto,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orange,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            vertical: 12,
                            horizontal: 16,
                          ),
                        ),
                        child: const Text('Tornar Usuário Apto'),
                      ),
                      const SizedBox(height: 12),
                    ],
                    ElevatedButton(
                      onPressed: () {
                        if (widget.id != null) {
                          Modular.to.pushNamed(
                            '/bolao/fazer_aposta',
                            arguments: {
                              'inscricaoId': widget.inscricaoId,
                              'valoresEscolhidos': widget.valoresEscolhidos,
                              'apto': _apto,
                            },
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Constants.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          vertical: 12,
                          horizontal: 16,
                        ),
                      ),
                      child: const Text('Fazer aposta'),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _numberChip(String text, bool highlighted, BuildContext context) {
    final color = highlighted ? Constants.primary : Constants.lightGray;
    final textColor = highlighted ? Colors.white : Constants.primary;
    return Container(
      width: 100,
      height: 100,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: highlighted
            ? [
                BoxShadow(
                  color: color.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: textColor,
        ),
      ),
    );
  }
}
